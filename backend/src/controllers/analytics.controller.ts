import { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";
import User from "../models/User";
import Attachment from "../models/Attachment";

// Get project analytics
export const getProjectAnalytics = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

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

    // Get task statistics
    const taskStats = await Task.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const tasksByStatus = {
      todo: 0,
      "in-progress": 0,
      review: 0,
      done: 0
    };

    taskStats.forEach(stat => {
      if (stat._id in tasksByStatus) {
        tasksByStatus[stat._id as keyof typeof tasksByStatus] = stat.count;
      }
    });

    // Get task priority distribution
    const priorityStats = await Task.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    const tasksByPriority = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    priorityStats.forEach(stat => {
      if (stat._id in tasksByPriority) {
        tasksByPriority[stat._id as keyof typeof tasksByPriority] = stat.count;
      }
    });

    // Get tasks completed over time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const completionTrend = await Task.aggregate([
      {
        $match: {
          projectId: project._id,
          status: "done",
          updatedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get team member task distribution
    const memberStats = await Task.aggregate([
      { $match: { projectId: project._id, assignedTo: { $exists: true } } },
      {
        $group: {
          _id: "$assignedTo",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          user: { $arrayElemAt: ["$user", 0] },
          totalTasks: 1,
          completedTasks: 1,
          inProgressTasks: 1,
          completionRate: {
            $cond: [
              { $eq: ["$totalTasks", 0] },
              0,
              { $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100] }
            ]
          }
        }
      }
    ]);

    // Get attachment statistics
    const attachmentCount = await Attachment.countDocuments({ projectId });
    const totalAttachmentSize = await Attachment.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } }
    ]);

    // Calculate project progress
    const totalTasks = Object.values(tasksByStatus).reduce((sum, count) => sum + count, 0);
    const completedTasks = tasksByStatus.done;
    const projectProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      projectId: project._id,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    res.json({
      projectInfo: {
        id: project._id,
        name: project.name,
        progress: projectProgress,
        memberCount: project.members.length + 1, // +1 for owner
        createdAt: project.createdAt
      },
      taskAnalytics: {
        byStatus: tasksByStatus,
        byPriority: tasksByPriority,
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionTrend
      },
      teamAnalytics: {
        memberStats,
        totalMembers: project.members.length + 1
      },
      attachmentAnalytics: {
        count: attachmentCount,
        totalSize: totalAttachmentSize[0]?.totalSize || 0
      }
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to get analytics" });
  }
};

// Get user dashboard analytics
export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get user's projects
    const ownedProjects = await Project.countDocuments({ ownerId: userId });
    const memberProjects = await Project.countDocuments({
      "members.userId": userId
    });

    // Get user's tasks
    const userTasks = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const tasksByStatus = {
      todo: 0,
      "in-progress": 0,
      review: 0,
      done: 0
    };

    userTasks.forEach(stat => {
      if (stat._id in tasksByStatus) {
        tasksByStatus[stat._id as keyof typeof tasksByStatus] = stat.count;
      }
    });

    // Get recent activity (tasks updated in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTasks = await Task.find({
      assignedTo: userId,
      updatedAt: { $gte: weekAgo }
    })
    .populate("projectId", "name")
    .sort({ updatedAt: -1 })
    .limit(10);

    // Get overdue tasks assigned to user
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    // Get productivity metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const productivityStats = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
          updatedAt: { $gte: thirtyDaysAgo },
          status: "done"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt"
            }
          },
          tasksCompleted: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalTasks = Object.values(tasksByStatus).reduce((sum, count) => sum + count, 0);
    const completedTasks = tasksByStatus.done;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      projectStats: {
        owned: ownedProjects,
        member: memberProjects,
        total: ownedProjects + memberProjects
      },
      taskStats: {
        byStatus: tasksByStatus,
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate
      },
      productivity: {
        thirtyDayTrend: productivityStats,
        recentActivity: recentTasks
      }
    });
  } catch (error) {
    console.error("User analytics error:", error);
    res.status(500).json({ error: "Failed to get user analytics" });
  }
};

// Get global platform analytics (admin only - for future use)
export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    // This would be for admin dashboard - basic stats for now
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalAttachments = await Attachment.countDocuments();

    // Growth metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const newProjects = await Project.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      totals: {
        users: totalUsers,
        projects: totalProjects,
        tasks: totalTasks,
        attachments: totalAttachments
      },
      growth: {
        newUsers,
        newProjects
      }
    });
  } catch (error) {
    console.error("Platform analytics error:", error);
    res.status(500).json({ error: "Failed to get platform analytics" });
  }
};
