import { Router } from "express";

const router = Router();

// Invitation routes placeholder
router.post("/:projectId/invite", (req, res) => {
  res.json({ message: "Send invitation endpoint" });
});

router.get("/", (req, res) => {
  res.json({ message: "Get user invitations" });
});

export default router;
