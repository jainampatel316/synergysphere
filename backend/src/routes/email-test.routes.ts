import { Router } from "express";

const router = Router();

// Test email route
router.post("/send", (req, res) => {
  res.json({ message: "Email test route" });
});

export default router;
