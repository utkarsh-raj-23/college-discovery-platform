import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/qa
router.get('/', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    const where = collegeId ? { collegeId: Number(collegeId) } : {};

    const questions = await prisma.question.findMany({
      where,
      include: {
        user: { select: { name: true } },
        answers: {
          include: { user: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/qa
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, collegeId } = req.body;

    const question = await prisma.question.create({
      data: {
        title,
        body,
        userId: req.userId!,
        collegeId: collegeId ? Number(collegeId) : null,
      },
      include: { user: { select: { name: true } } },
    });

    res.json(question);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/qa/:id/answers
router.post(
  '/:id/answers',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { body } = req.body;

      const answer = await prisma.answer.create({
        data: {
          body,
          userId: req.userId!,
          questionId: Number(req.params.id),
        },
        include: { user: { select: { name: true } } },
      });

      res.json(answer);
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;