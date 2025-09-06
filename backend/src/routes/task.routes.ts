import { Router } from "express";
import {
  getTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from "../controllers/task.controller";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import { body, param, query } from "express-validator";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all tasks (with optional filters)
router.get("/", 
  [
    query("projectId").optional().isMongoId().withMessage("Invalid project ID"),
    query("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status"),
    query("assigneeId").optional().isMongoId().withMessage("Invalid assignee ID"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1")
  ],
  validateRequest,
  getTasks
);

// Get tasks assigned to current user
router.get("/my-tasks",
  [
    query("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1")
  ],
  validateRequest,
  getMyTasks
);

// Get task statistics
router.get("/stats",
  [
    query("projectId").optional().isMongoId().withMessage("Invalid project ID")
  ],
  validateRequest,
  getTaskStats
);

// Get task by ID
router.get("/:id",
  [
    param("id").isMongoId().withMessage("Invalid task ID")
  ],
  validateRequest,
  getTaskById
);

// Create new task
router.post("/",
  [
    body("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title must be 1-200 characters"),
    body("description").optional().trim().isLength({ max: 2000 }).withMessage("Description must be under 2000 characters"),
    body("projectId").isMongoId().withMessage("Invalid project ID"),
    body("assigneeId").optional().isMongoId().withMessage("Invalid assignee ID"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high")
  ],
  validateRequest,
  createTask
);

// Update task
router.put("/:id",
  [
    param("id").isMongoId().withMessage("Invalid task ID"),
    body("title").optional().trim().isLength({ min: 1, max: 200 }).withMessage("Title must be 1-200 characters"),
    body("description").optional().trim().isLength({ max: 2000 }).withMessage("Description must be under 2000 characters"),
    body("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status"),
    body("assigneeId").optional().isMongoId().withMessage("Invalid assignee ID"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high")
  ],
  validateRequest,
  updateTask
);

// Delete task
router.delete("/:id",
  [
    param("id").isMongoId().withMessage("Invalid task ID")
  ],
  validateRequest,
  deleteTask
);

export default router;