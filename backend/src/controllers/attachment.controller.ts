import { Request, Response } from "express";
import Attachment from "../models/Attachment";
import Project from "../models/Project";
import { getFileInfo, deleteFile } from "../middleware/upload";
import path from "path";
import fs from "fs";

// Upload attachments to a project
export const uploadAttachments = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { description } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      // Clean up uploaded files
      files.forEach(file => deleteFile(file.path));
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is project member
    const isMember = project.members.some(member => 
      member.userId.toString() === req.user?.id
    );
    
    if (!isMember && project.ownerId.toString() !== req.user?.id) {
      // Clean up uploaded files
      files.forEach(file => deleteFile(file.path));
      return res.status(403).json({ error: "Access denied" });
    }

    // Create attachment records
    const attachments = await Promise.all(
      files.map(async (file) => {
        const fileInfo = getFileInfo(file);
        
        const attachment = new Attachment({
          ...fileInfo,
          projectId,
          uploadedBy: req.user?.id,
          description: description || undefined
        });

        return await attachment.save();
      })
    );

    // Populate user info
    await Attachment.populate(attachments, {
      path: "uploadedBy",
      select: "name email avatarUrl"
    });

    res.status(201).json({
      message: `${attachments.length} file(s) uploaded successfully`,
      attachments
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up files on error
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      files.forEach(file => deleteFile(file.path));
    }
    
    res.status(500).json({ error: "Failed to upload files" });
  }
};

// Get attachments for a project
export const getProjectAttachments = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = project.members.some(member => 
      member.userId.toString() === req.user?.id
    );
    
    if (!isMember && project.ownerId.toString() !== req.user?.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get attachments with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const attachments = await Attachment.find({ projectId })
      .populate("uploadedBy", "name email avatarUrl")
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Attachment.countDocuments({ projectId });

    res.json({
      attachments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get attachments error:", error);
    res.status(500).json({ error: "Failed to get attachments" });
  }
};

// Download attachment
export const downloadAttachment = async (req: Request, res: Response) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findById(attachmentId)
      .populate("projectId", "ownerId members");

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Check project access
    const project = attachment.projectId as any;
    const isMember = project.members.some((member: any) => 
      member.userId.toString() === req.user?.id
    );
    
    if (!isMember && project.ownerId.toString() !== req.user?.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if file exists
    if (!fs.existsSync(attachment.path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set headers for download
    res.setHeader("Content-Disposition", `attachment; filename="${attachment.originalName}"`);
    res.setHeader("Content-Type", attachment.mimeType);
    
    // Stream file
    const fileStream = fs.createReadStream(attachment.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
};

// Delete attachment
export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findById(attachmentId)
      .populate("projectId", "ownerId");

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Check permissions (only uploader or project owner can delete)
    const project = attachment.projectId as any;
    const canDelete = attachment.uploadedBy.toString() === req.user?.id ||
                     project.ownerId.toString() === req.user?.id;

    if (!canDelete) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Delete file from filesystem
    deleteFile(attachment.path);

    // Delete from database
    await Attachment.findByIdAndDelete(attachmentId);

    res.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error("Delete attachment error:", error);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
};
