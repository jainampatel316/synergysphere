import { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";
import { AuthenticatedRequest } from "../types";

// Get all tasks (with optional project filter)
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, status, assigneeId, limit = 50, page = 1 } = req.query;
    const userId = req.user!.id;

    // Build query
    const query: any = {};
    
    if (projectId) {
      // Verify user has access to this project
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Check if user is owner or member
      if (project.createdBy.toString() !== userId && !project.members.includes(userId)) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      query.projectId = projectId;
    } else {
      // If no project specified, only show tasks from projects user has access to
      const userProjects = await Project.find({
        $or: [
          { createdBy: userId },
          { members: userId }
        ]
      }).select('_id');
      
      query.projectId = { $in: userProjects.map(p => p._id) };
    }

    if (status) query.status = status;
    if (assigneeId) query.assigneeId = assigneeId;

    const skip = (Number(page) - 1) * Number(limit);
    
    const tasks = await Task.find(query)
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Get tasks assigned to current user
export const getMyTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 50, page = 1 } = req.query;

    const query: any = { assigneeId: userId };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('projectId', 'name')
      .sort({ 
        priority: { high: 1, medium: 2, low: 3 },
        dueDate: 1,
        createdAt: -1 
      })
      .limit(Number(limit))
      .skip(skip);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Get task by ID
export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await Task.findById(id)
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user has access to this task's project
    const project = await Project.findById(task.projectId);
    if (!project || (project.createdBy.toString() !== userId && !project.members.includes(userId))) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

// Create new task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, projectId, assigneeId, dueDate, priority = "medium" } = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!title || !projectId) {
      return res.status(400).json({ error: "Title and project ID are required" });
    }

    // Verify user has access to create tasks in this project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.createdBy.toString() !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Create task
    const task = new Task({
      title,
      description,
      projectId,
      assigneeId: assigneeId || userId,
      createdBy: userId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      status: "todo"
    });

    await task.save();

    // Populate the task before returning
    await task.populate('assigneeId', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('projectId', 'name');

    // Update project task count
    await Project.findByIdAndUpdate(projectId, {
      $inc: { totalTasks: 1 }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user has access to this task's project
    const project = await Project.findById(task.projectId);
    if (!project || (project.createdBy.toString() !== userId && !project.members.includes(userId))) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Track status change for project stats
    const oldStatus = task.status;
    const newStatus = updates.status;

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    // Update project completed tasks count if status changed
    if (oldStatus !== newStatus) {
      if (oldStatus === "done" && newStatus !== "done") {
        // Task was completed, now it's not
        await Project.findByIdAndUpdate(task.projectId, {
          $inc: { completedTasks: -1 }
        });
      } else if (oldStatus !== "done" && newStatus === "done") {
        // Task is now completed
        await Project.findByIdAndUpdate(task.projectId, {
          $inc: { completedTasks: 1 }
        });
      }
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user has access to delete this task
    const project = await Project.findById(task.projectId);
    if (!project || (project.createdBy.toString() !== userId && task.createdBy.toString() !== userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update project stats before deleting
    const decrementTotal = { totalTasks: -1 };
    const decrementCompleted = task.status === "done" ? { completedTasks: -1 } : {};

    await Project.findByIdAndUpdate(task.projectId, {
      $inc: { ...decrementTotal, ...decrementCompleted }
    });

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};