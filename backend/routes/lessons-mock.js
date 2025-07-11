const express = require('express');

const router = express.Router();

// Mock data for demonstration
const mockLessonPaths = [
  {
    id: 1,
    title: "Budgeting Basics",
    description: "Learn the fundamentals of creating and managing a budget",
    color: "#3B82F6",
    icon: "Calculator",
    order: 1,
    lessons: [
      {
        id: 1,
        title: "What is a Budget?",
        description: "Understand the basics of budgeting and why it matters",
        type: "standard",
        order: 1
      },
      {
        id: 2,
        title: "Income vs Expenses",
        description: "Learn to identify and categorize your income and expenses",
        type: "activity",
        order: 2
      },
      {
        id: 3,
        title: "The 50/30/20 Rule",
        description: "Learn a simple budgeting framework that works for most people",
        type: "standard",
        order: 3
      }
    ]
  },
  {
    id: 2,
    title: "Saving & Emergency Funds",
    description: "Build financial security through smart saving strategies",
    color: "#10B981",
    icon: "PiggyBank",
    order: 2,
    lessons: []
  },
  {
    id: 3,
    title: "Credit & Debt",
    description: "Understand credit scores and manage debt effectively",
    color: "#F59E0B",
    icon: "CreditCard",
    order: 3,
    lessons: []
  }
];

const mockLessons = {
  1: {
    id: 1,
    title: "What is a Budget?",
    description: "Understand the basics of budgeting and why it matters",
    type: "standard",
    order: 1,
    pathId: 1,
    path: mockLessonPaths[0],
    content: JSON.stringify({
      sections: [
        {
          type: "intro",
          title: "Welcome to Budgeting!",
          content: "A budget is your money's game plan. It helps you track income and expenses to reach your financial goals."
        },
        {
          type: "interactive",
          title: "Budget Definition Match",
          activity: "matching",
          pairs: [
            { left: "Income", right: "Money you earn" },
            { left: "Expenses", right: "Money you spend" },
            { left: "Budget", right: "A plan for your money" },
            { left: "Savings", right: "Money set aside for later" }
          ]
        },
        {
          type: "explanation",
          title: "Why Budget?",
          content: "Budgeting helps you avoid overspending, save for goals, and reduce financial stress."
        }
      ],
      quiz: [
        {
          question: "What is the main purpose of a budget?",
          options: [
            "To restrict your spending completely",
            "To plan how you'll use your money",
            "To make you feel guilty about purchases",
            "To impress others with your organization"
          ],
          correct: 1,
          explanation: "A budget is a plan that helps you allocate your money toward your priorities and goals."
        }
      ]
    })
  },
  2: {
    id: 2,
    title: "Income vs Expenses",
    description: "Learn to identify and categorize your income and expenses",
    type: "activity",
    order: 2,
    pathId: 1,
    path: mockLessonPaths[0],
    content: JSON.stringify({
      sections: [
        {
          type: "intro",
          title: "Income and Expenses",
          content: "To create a budget, you need to know what money comes in (income) and what goes out (expenses)."
        },
        {
          type: "interactive",
          title: "Drag & Drop Challenge",
          activity: "drag-drop",
          instructions: "Drag each item to the correct category:",
          categories: [
            { name: "Income", items: [] },
            { name: "Fixed Expenses", items: [] },
            { name: "Variable Expenses", items: [] }
          ],
          items: [
            { text: "Salary", category: "Income" },
            { text: "Rent", category: "Fixed Expenses" },
            { text: "Groceries", category: "Variable Expenses" },
            { text: "Car Payment", category: "Fixed Expenses" },
            { text: "Entertainment", category: "Variable Expenses" },
            { text: "Side Job", category: "Income" }
          ]
        }
      ],
      quiz: [
        {
          question: "Which of these is a fixed expense?",
          options: [
            "Dining out",
            "Rent payment",
            "Grocery shopping",
            "Gas for your car"
          ],
          correct: 1,
          explanation: "Fixed expenses stay the same each month, like rent or loan payments."
        }
      ]
    })
  }
};

// Mock user progress and badges data
let mockUserProgress = {};
let mockUserData = {
  currentStreak: 0,
  longestStreak: 0,
  badges: []
};

// Middleware to verify JWT token (simplified for demo)
const authenticateToken = (req, res, next) => {
  // For demo purposes, just add a mock user
  req.user = { id: 1 };
  next();
};

// Alternative middleware that skips auth for demo
const optionalAuth = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

// Get all lesson paths (public route)
router.get('/paths', async (req, res) => {
  try {
    res.json(mockLessonPaths);
  } catch (error) {
    console.error('Error fetching lesson paths:', error);
    res.status(500).json({ error: 'Failed to fetch lesson paths' });
  }
});

// Get lesson path with user progress
router.get('/paths/:pathId', optionalAuth, async (req, res) => {
  try {
    const { pathId } = req.params;
    const path = mockLessonPaths.find(p => p.id === parseInt(pathId));

    if (!path) {
      return res.status(404).json({ error: 'Lesson path not found' });
    }

    // Add mock progress data
    const pathWithProgress = {
      ...path,
      lessons: path.lessons.map(lesson => ({
        ...lesson,
        userProgress: mockUserProgress[lesson.id] ? [mockUserProgress[lesson.id]] : []
      }))
    };

    res.json(pathWithProgress);
  } catch (error) {
    console.error('Error fetching lesson path:', error);
    res.status(500).json({ error: 'Failed to fetch lesson path' });
  }
});

// Get specific lesson
router.get('/:lessonId', optionalAuth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = mockLessons[lessonId];

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Add mock progress data
    const lessonWithProgress = {
      ...lesson,
      userProgress: mockUserProgress[lessonId] ? [mockUserProgress[lessonId]] : []
    };

    res.json(lessonWithProgress);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Start lesson
router.post('/:lessonId/start', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    if (!mockUserProgress[lessonId]) {
      mockUserProgress[lessonId] = {
        userId: 1,
        lessonId: parseInt(lessonId),
        completed: false,
        attempts: 1
      };
    } else {
      mockUserProgress[lessonId].attempts++;
    }

    res.json(mockUserProgress[lessonId]);
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

    mockUserProgress[lessonId] = {
      userId: 1,
      lessonId: parseInt(lessonId),
      completed: true,
      score: score,
      completedAt: new Date(),
      attempts: mockUserProgress[lessonId]?.attempts || 1
    };

    // Update streak
    mockUserData.currentStreak += 1;
    mockUserData.longestStreak = Math.max(mockUserData.longestStreak, mockUserData.currentStreak);

    res.json({ progress: mockUserProgress[lessonId], streak: mockUserData.currentStreak });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// Get user progress summary
router.get('/progress/summary', optionalAuth, async (req, res) => {
  try {
    const completedLessons = Object.values(mockUserProgress).filter(p => p.completed);
    
    const pathProgress = mockLessonPaths.map(path => ({
      path: path,
      completed: completedLessons.filter(lesson => 
        path.lessons.some(pl => pl.id === lesson.lessonId)
      ).length,
      total: path.lessons.length
    }));

    res.json({
      currentStreak: mockUserData.currentStreak,
      longestStreak: mockUserData.longestStreak,
      totalLessonsCompleted: completedLessons.length,
      badges: mockUserData.badges,
      pathProgress: pathProgress
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    res.status(500).json({ error: 'Failed to fetch progress summary' });
  }
});

module.exports = router;