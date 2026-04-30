import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/predict
router.post('/', async (req: Request, res: Response) => {
  try {
    const { exam, rank } = req.body;

    if (!exam || !rank) {
      return res.status(400).json({ error: 'exam and rank are required' });
    }

    const courses = await prisma.course.findMany({
      where: {
        exam: { contains: String(exam), mode: 'insensitive' },
        minRank: { lte: Number(rank) + 5000 },
        maxRank: { gte: Number(rank) - 2000 },
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            rating: true,
            fees: true,
          },
        },
      },
      orderBy: { minRank: 'asc' },
      take: 20,
    });

    const results = courses.map((c) => ({
      college: c.college,
      course: c.name,
      minRank: c.minRank,
      maxRank: c.maxRank,
      chance:
        Number(rank) <= (c.minRank || 0) + 1000
          ? 'High'
          : Number(rank) <= (c.maxRank || 0)
          ? 'Medium'
          : 'Low',
    }));

    res.json(results);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;