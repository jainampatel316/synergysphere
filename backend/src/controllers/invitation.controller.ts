import { Request, Response } from "express";
import { Types } from "mongoose";
import Invitation from "../models/Invitation";
import Project from "../models/Project";
import User from "../models/User";
import { sendProjectInvitationEmail } from "../services/email.service";
import { generateConfirmationToken } from "../utils/jwt";
import env from "../config/env";

// Send team invitation
export const sendInvitation = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { email, role = "member" } = req.body;

    // Verify project exists and user is owner/admin
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check permissions
    const isOwner = project.ownerId.toString() === req.user?.id;
    const isAdmin = project.members.some(member => 
      member.userId.toString() === req.user?.id && member.role === "admin"
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Only project owners and admins can send invitations" });
    }

    // Check if user is already a member (we'll check by email separately)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isOwner = project.ownerId.toString() === (existingUser._id as Types.ObjectId).toString();
      const isMember = project.members.some(member => 
        member.userId.toString() === (existingUser._id as Types.ObjectId).toString()
      );
      
      if (isOwner || isMember) {
        return res.status(400).json({ error: "User is already a project member" });
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await Invitation.findOne({
      projectId,
      email,
      status: "pending",
      expiresAt: { $gt: new Date() }
    });

    if (existingInvitation) {
      return res.status(400).json({ error: "Invitation already sent to this email" });
    }

    // Generate invitation token
    const token = generateConfirmationToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation
    const invitation = new Invitation({
      projectId,
      invitedBy: req.user?.id,
      email,
      role,
      token,
      expiresAt
    });

    await invitation.save();

    // Send invitation email
    try {
      const inviterUser = await User.findById(req.user?.id, "name");
      await sendProjectInvitationEmail(
        email,
        email.split("@")[0], // Use email prefix as name placeholder
        project.name,
        inviterUser?.name || "A team member"
      );
      
      console.log(`📧 Project invitation sent to ${email} for project ${project.name}`);
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      // Don't fail the invitation if email fails
    }

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error("Send invitation error:", error);
    res.status(500).json({ error: "Failed to send invitation" });
  }
};

// Accept invitation
export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Find valid invitation
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() }
    }).populate("projectId", "name ownerId members");

    if (!invitation) {
      return res.status(400).json({ error: "Invalid or expired invitation" });
    }

    // Check if user is already registered
    const user = await User.findOne({ email: invitation.email });
    if (!user) {
      return res.status(400).json({ 
        error: "Please register an account first",
        email: invitation.email 
      });
    }

    // Check if user is the current logged-in user
    if ((user._id as Types.ObjectId).toString() !== req.user?.id) {
      return res.status(403).json({ error: "You can only accept invitations for your own email" });
    }

    const project = invitation.projectId as any;

    // Add user to project members
    project.members.push({
      userId: user._id as Types.ObjectId,
      role: invitation.role,
      joinedAt: new Date()
    });

    await project.save();

    // Update invitation status
    invitation.status = "accepted";
    invitation.respondedAt = new Date();
    await invitation.save();

    res.json({
      message: "Invitation accepted successfully",
      project: {
        id: project._id,
        name: project.name,
        role: invitation.role
      }
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
};

// Decline invitation
export const declineInvitation = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return res.status(400).json({ error: "Invalid or expired invitation" });
    }

    invitation.status = "declined";
    invitation.respondedAt = new Date();
    await invitation.save();

    res.json({ message: "Invitation declined" });
  } catch (error) {
    console.error("Decline invitation error:", error);
    res.status(500).json({ error: "Failed to decline invitation" });
  }
};

// Get project invitations (for project owners/admins)
export const getProjectInvitations = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    // Verify project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isOwner = project.ownerId.toString() === req.user?.id;
    const isAdmin = project.members.some(member => 
      member.userId.toString() === req.user?.id && member.role === "admin"
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const invitations = await Invitation.find({ projectId })
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ invitations });
  } catch (error) {
    console.error("Get invitations error:", error);
    res.status(500).json({ error: "Failed to get invitations" });
  }
};

// Get user's pending invitations
export const getUserInvitations = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const invitations = await Invitation.find({
      email: user.email,
      status: "pending",
      expiresAt: { $gt: new Date() }
    })
    .populate("projectId", "name description")
    .populate("invitedBy", "name email")
    .sort({ createdAt: -1 });

    res.json({ invitations });
  } catch (error) {
    console.error("Get user invitations error:", error);
    res.status(500).json({ error: "Failed to get invitations" });
  }
};
