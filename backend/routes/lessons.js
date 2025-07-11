const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

// Get all lesson paths
router.get('/paths', async (req, res) => {
  try {
    const paths = await prisma.lessonPath.findMany({
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            order: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(paths);
  } catch (error) {
    console.error('Error fetching lesson paths:', error);
    res.status(500).json({ error: 'Failed to fetch lesson paths' });
  }
});

// Get lesson path with user progress
router.get('/paths/:pathId', authenticateToken, async (req, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user.id;

    const path = await prisma.lessonPath.findUnique({
      where: { id: parseInt(pathId) },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            userProgress: {
              where: { userId: userId }
            }
          }
        }
      }
    });

    if (!path) {
      return res.status(404).json({ error: 'Lesson path not found' });
    }

    res.json(path);
  } catch (error) {
    console.error('Error fetching lesson path:', error);
    res.status(500).json({ error: 'Failed to fetch lesson path' });
  }
});

// Get specific lesson
router.get('/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        path: true,
        userProgress: {
          where: { userId: userId }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Start lesson (create progress entry)
router.post('/:lessonId/start', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: parseInt(lessonId)
        }
      },
      update: {
        attempts: { increment: 1 }
      },
      create: {
        userId: userId,
        lessonId: parseInt(lessonId),
        attempts: 1
      }
    });

    res.json(progress);
  } catch (error) {
    console.error('Error starting lesson:', error);
    res.status(500).json({ error: 'Failed to start lesson' });
  }
});

// Complete lesson
router.post('/:lessonId/complete', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { score } = req.body;
    const userId = req.user.id;

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: parseInt(lessonId)
        }
      },
      update: {
        completed: true,
        score: score,
        completedAt: new Date()
      },
      create: {
        userId: userId,
        lessonId: parseInt(lessonId),
        completed: true,
        score: score,
        completedAt: new Date(),
        attempts: 1
      }
    });

    // Update user streak
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (user.lastLessonDate) {
      const lastLessonDate = new Date(user.lastLessonDate);
      if (lastLessonDate.toDateString() === yesterday.toDateString()) {
        newStreak = user.currentStreak + 1;
      } else if (lastLessonDate.toDateString() === today.toDateString()) {
        newStreak = user.currentStreak;
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        lastLessonDate: today
      }
    });

    res.json({ progress, streak: newStreak });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// Get user progress summary
router.get('/progress/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProgress: {
          include: {
            lesson: {
              include: {
                path: true
              }
            }
          }
        },
        userBadges: {
          include: {
            badge: true
          }
        }
      }
    });

    const progressByPath = user.userProgress.reduce((acc, progress) => {
      const pathId = progress.lesson.path.id;
      if (!acc[pathId]) {
        acc[pathId] = {
          path: progress.lesson.path,
          completed: 0,
          total: 0
        };
      }
      acc[pathId].total++;
      if (progress.completed) {
        acc[pathId].completed++;
      }
      return acc;
    }, {});

    res.json({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalLessonsCompleted: user.userProgress.filter(p => p.completed).length,
      badges: user.userBadges.map(ub => ub.badge),
      pathProgress: Object.values(progressByPath)
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    res.status(500).json({ error: 'Failed to fetch progress summary' });
  }
});

module.exports = router;