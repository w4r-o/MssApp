const express = require('express');
const cors = require('cors');
const { Student } = require('teachassist');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/marks', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const student = new Student(username, password);
    const courses = await student.getCourses();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch marks' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
