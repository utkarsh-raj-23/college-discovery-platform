import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/saved
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.userId },
      include: { college: true },
    });
    res.json(saved.map((s) => s.college));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/saved/:collegeId
router.post(
  '/:collegeId',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const saved = await prisma.savedCollege.upsert({
        where: {
          userId_collegeId: {
            userId: req.userId!,
            collegeId: Number(req.params.collegeId),
          },
        },
        update: {},
        create: {
          userId: req.userId!,
          collegeId: Number(req.params.collegeId),
        },
      });
      res.json(saved);
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// DELETE /api/saved/:collegeId
router.delete(
  '/:collegeId',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId: req.userId!,
            collegeId: Number(req.params.collegeId),
          },
        },
      });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;