import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/colleges — list with search, filter, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      location,
      minFees,
      maxFees,
      course,
      page = '1',
      limit = '9',
    } = req.query;

    const where: any = {};

    if (search) {
      where.name = { contains: String(search), mode: 'insensitive' };
    }
    if (location) {
      where.state = { contains: String(location), mode: 'insensitive' };
    }
    if (minFees || maxFees) {
      where.fees = {};
      if (minFees) where.fees.gte = Number(minFees);
      if (maxFees) where.fees.lte = Number(maxFees);
    }
    if (course) {
      where.courses = {
        some: { name: { contains: String(course), mode: 'insensitive' } },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          courses: { take: 3 },
          placements: { take: 1, orderBy: { year: 'desc' } },
        },
        orderBy: { rating: 'desc' },
      }),
      prisma.college.count({ where }),
    ]);

    res.json({
      colleges,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/colleges/compare/multi?ids=1,2,3
router.get('/compare/multi', async (req: Request, res: Response) => {
  try {
    const ids = String(req.query.ids)
      .split(',')
      .map(Number)
      .filter(Boolean);

    if (ids.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 college IDs' });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        placements: { orderBy: { year: 'desc' }, take: 1 },
        courses: true,
      },
    });

    res.json(colleges);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/colleges/:id — single college detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' } },
        reviews: true,
        questions: {
          include: {
            answers: {
              include: { user: { select: { name: true } } },
            },
            user: { select: { name: true } },
          },
          take: 5,
        },
      },
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json(college);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;