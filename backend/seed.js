const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const lessonPaths = [
  {
    id: 1,
    title: "Budgeting Basics",
    description: "Learn the fundamentals of creating and managing a budget",
    color: "#3B82F6",
    icon: "Calculator",
    order: 1
  },
  {
    id: 2,
    title: "Saving & Emergency Funds",
    description: "Build financial security through smart saving strategies",
    color: "#10B981",
    icon: "PiggyBank",
    order: 2
  },
  {
    id: 3,
    title: "Credit & Debt",
    description: "Understand credit scores and manage debt effectively",
    color: "#F59E0B",
    icon: "CreditCard",
    order: 3
  }
];

const lessons = [
  // Budgeting Basics Path
  {
    id: 1,
    title: "What is a Budget?",
    description: "Understand the basics of budgeting and why it matters",
    type: "standard",
    order: 1,
    pathId: 1,
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
  {
    id: 2,
    title: "Income vs Expenses",
    description: "Learn to identify and categorize your income and expenses",
    type: "activity",
    order: 2,
    pathId: 1,
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
  },
  {
    id: 3,
    title: "The 50/30/20 Rule",
    description: "Learn a simple budgeting framework that works for most people",
    type: "standard",
    order: 3,
    pathId: 1,
    content: JSON.stringify({
      sections: [
        {
          type: "intro",
          title: "The 50/30/20 Budget Rule",
          content: "This popular budgeting method divides your after-tax income into three categories."
        },
        {
          type: "interactive",
          title: "Budget Pie Chart",
          activity: "scenario",
          scenario: {
            monthlyIncome: 4000,
            categories: [
              { name: "Needs (50%)", percentage: 50, amount: 2000, color: "#EF4444" },
              { name: "Wants (30%)", percentage: 30, amount: 1200, color: "#3B82F6" },
              { name: "Savings (20%)", percentage: 20, amount: 800, color: "#10B981" }
            ]
          }
        },
        {
          type: "explanation",
          title: "Breaking it Down",
          content: "• 50% for needs (rent, groceries, utilities)\n• 30% for wants (entertainment, dining out)\n• 20% for savings and debt payment"
        }
      ],
      quiz: [
        {
          question: "If you earn $3,000 per month, how much should you save using the 50/30/20 rule?",
          options: ["$300", "$600", "$900", "$1,500"],
          correct: 1,
          explanation: "20% of $3,000 is $600 for savings and debt payment."
        }
      ]
    })
  }
];

const badges = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "Trophy",
    color: "#F59E0B",
    criteria: JSON.stringify({ type: "lessons_completed", count: 1 })
  },
  {
    id: 2,
    name: "Budget Master",
    description: "Complete the Budgeting Basics path",
    icon: "Star",
    color: "#3B82F6",
    criteria: JSON.stringify({ type: "path_completed", pathId: 1 })
  },
  {
    id: 3,
    name: "Streak Starter",
    description: "Maintain a 3-day learning streak",
    icon: "Flame",
    color: "#EF4444",
    criteria: JSON.stringify({ type: "streak", count: 3 })
  },
  {
    id: 4,
    name: "Dedicated Learner",
    description: "Maintain a 7-day learning streak",
    icon: "Flame",
    color: "#DC2626",
    criteria: JSON.stringify({ type: "streak", count: 7 })
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.userBadge.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.lessonPath.deleteMany();

    // Create lesson paths
    for (const path of lessonPaths) {
      await prisma.lessonPath.create({ data: path });
    }
    console.log('✅ Lesson paths created');

    // Create lessons
    for (const lesson of lessons) {
      await prisma.lesson.create({ data: lesson });
    }
    console.log('✅ Lessons created');

    // Create badges
    for (const badge of badges) {
      await prisma.badge.create({ data: badge });
    }
    console.log('✅ Badges created');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };