const express = require('express');
const cors = require('cors');
const { Student } = require('teachassist');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/marks', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[API] /api/marks called at ${new Date().toISOString()}`);
  console.log(
    `[API] Received username: ${username ? '[REDACTED]' : 'undefined'}, password: ${password ? '[REDACTED]' : 'undefined'}`,
  );
  if (!username || !password) {
    console.log('[API] Missing credentials');
    return res.status(400).json({ error: 'Missing credentials' });
  }
  try {
    console.log('[API] Creating Student instance...');
    const student = new Student(username, password);
    console.log('[API] Fetching courses from TeachAssist...');
    const courses = await student.getCourses();
    console.log(`[API] Successfully fetched ${courses.length} courses.`);
    res.json({ courses });
  } catch (err) {
    console.error('[API] Error fetching marks:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch marks' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
