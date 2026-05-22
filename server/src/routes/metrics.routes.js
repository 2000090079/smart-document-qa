const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', protect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({
      totalUsers,
      revenue: 84230,
      activeSessions: 342,
      growthRate: 12.5,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/revenue', protect, (req, res) => {
  res.json([
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 51000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 63000 },
    { month: 'May', revenue: 71000 },
    { month: 'Jun', revenue: 68000 },
    { month: 'Jul', revenue: 75000 },
    { month: 'Aug', revenue: 82000 },
    { month: 'Sep', revenue: 79000 },
    { month: 'Oct', revenue: 84000 },
    { month: 'Nov', revenue: 91000 },
    { month: 'Dec', revenue: 98000 },
  ]);
});

router.get('/activity', protect, (req, res) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = [280, 320, 295, 410, 380, 240, 210];
  res.json(
    days.map((day, i) => ({
      day,
      users: base[i],
      sessions: Math.round(base[i] * 1.4),
    }))
  );
});

module.exports = router;
