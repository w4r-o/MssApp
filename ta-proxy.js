const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const tough = require('tough-cookie');
const fetchCookie = require('fetch-cookie/node-fetch')(fetch, new tough.CookieJar());
const rateLimit = require('express-rate-limit');

const TA_URL = 'https://ta.yrdsb.ca/live';

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 30 })); // 30 requests/minute per IP

// --- Parsing logic (adapted from your teachassist.js) ---
function parseCoursesFromHTML(html) {
  // Look for the marks table - try different patterns
  const tablePatterns = [
    /<table[^>]*class="[^"]*green_border_message[^"]*"[^>]*>([\s\S]*?)<\/table>/i,
    /<div[^>]*class="[^"]*green_border_message[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<table[^>]*bgcolor="#ffffff"[^>]*>([\s\S]*?)<\/table>/i,
    /<table[^>]*class="[^"]*marks[^"]*"[^>]*>([\s\S]*?)<\/table>/i
  ];

  let tableContent = '';
  for (const pattern of tablePatterns) {
    const match = html.match(pattern);
    if (match) {
      tableContent = match[1];
      break;
    }
  }
  if (!tableContent) return [];

  const courses = [];
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows = tableContent.matchAll(rowPattern);
  for (const [, row] of rows) {
    if (row.includes('Course Name') || row.includes('Please see teacher')) continue;
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    if (!cells || cells.length < 3) continue;
    const cleanCells = cells.map(cell => cell.replace(/<[^>]+>/g, '').trim());
    const courseInfo = cleanCells[0].split('\n').map(line => line.trim()).filter(Boolean);
    if (courseInfo.length < 2) continue;
    const [courseCode, courseName] = courseInfo[0].split(':').map(s => s.trim());
    if (!courseCode) continue;
    const blockMatch = courseInfo[1].match(/Block:\s*P(\d+)/i);
    const roomMatch = courseInfo[1].match(/rm\.\s*(\w+)/i);
    const markInfo = parseMarkInfo(cleanCells[2]);
    const linkMatch = row.match(/href="([^"]*viewReport[^"]*)"/);
    if (markInfo.mark !== 'N/A') {
      courses.push({
        code: courseCode,
        name: courseName || courseCode,
        room: roomMatch ? roomMatch[1] : '',
        block: blockMatch ? blockMatch[1] : '',
        overall_mark: markInfo.mark,
        isFinal: markInfo.isFinal,
        isMidterm: markInfo.isMidterm,
        link: linkMatch ? linkMatch[1] : null,
        assignments: []
      });
    }
  }
  return courses;
}

function parseMarkInfo(markText) {
  if (!markText) return { mark: 'N/A', isFinal: false, isMidterm: false };
  markText = markText.trim().replaceAll(' ', '');
  const result = { mark: 'N/A', isFinal: false, isMidterm: false };
  if (markText.includes('FINAL')) {
    const match = markText.match(/FINALMARK:(\d+\.?\d*)/i);
    if (match) {
      result.mark = parseFloat(match[1]);
      result.isFinal = true;
    }
  } else if (markText.includes('currentmark')) {
    const match = markText.match(/currentmark=(\d+\.?\d*)/i);
    if (match) {
      result.mark = parseFloat(match[1]);
    }
  } else if (markText.includes('MIDTERM')) {
    const match = markText.match(/MIDTERMMARK:(\d+\.?\d*)/i);
    if (match) {
      result.mark = parseFloat(match[1]);
      result.isMidterm = true;
    }
  }
  return result;
}

function parseCourseDetails(html) {
  const assignments = [];
  const weight_table = {};
  const weightCategories = {
    KU: 'ffffaa',
    A: 'ffd490',
    T: 'c0fea4',
    C: 'afafff',
    O: 'eeeeee',
    F: 'cccccc'
  };
  // Parse assignments table
  const assignmentTable = html.match(/<table[^>]*width="100%"[^>]*>([\s\S]*?)<\/table>/i);
  if (assignmentTable) {
    const assignmentRows = assignmentTable[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    for (let i = 0; i < assignmentRows.length; i++) {
      const row = assignmentRows[i];
      const nameCell = row.match(/<td[^>]*rowspan="2"[^>]*>([\s\S]*?)<\/td>/i);
      if (nameCell) {
        const assignment = {
          name: nameCell[1].replace(/<[^>]+>/g, '').trim()
        };
        Object.entries(weightCategories).forEach(([category, color]) => {
          const markRegex = new RegExp(`<td[^>]*bgcolor="#${color}"[^>]*>([\s\S]*?)<\/td>`, 'i');
          const markMatch = row.match(markRegex);
          if (markMatch) {
            const text = markMatch[1].replace(/<[^>]+>/g, '').trim();
            try {
              const [get, total] = text.split('/').map(n => parseFloat(n.trim()));
              const weightMatch = text.match(/weight=(\d+)/);
              const weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
              assignment[category] = [{ get, total, weight, finished: !text.includes('finished') }];
            } catch (e) {
              assignment[category] = [{ get: 0, total: 0, weight: 0, finished: true }];
            }
          }
        });
        // Get feedback from next row
        if (i + 1 < assignmentRows.length) {
          const feedbackRow = assignmentRows[i + 1];
          const feedback = feedbackRow.replace(/<[^>]+>/g, '').trim();
          if (feedback) {
            assignment.feedback = feedback;
          }
        }
        assignments.push(assignment);
      }
    }
  }
  return { assignments };
}

// --- Main endpoint ---
app.post('/api/teachassist', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. Get login page (to get cookies)
    await fetchCookie(`${TA_URL}/index.php`);
    // 2. Submit login form
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('submit', 'Login');
    formData.append('subject_id', '0');
    const loginResponse = await fetchCookie(`${TA_URL}/index.php`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const loginHtml = await loginResponse.text();
    if (loginHtml.includes('YRDSB teachassist login')) {
      return res.status(401).json({ error: 'Login failed' });
    }
    // 3. Fetch the marks page
    const marksResponse = await fetchCookie(`${TA_URL}/students/listReports.php`);
    const marksHtml = await marksResponse.text();
    // 4. Parse courses
    const courses = parseCoursesFromHTML(marksHtml);
    // 5. For each course, fetch and parse details
    for (const course of courses) {
      if (course.link) {
        const detailResponse = await fetchCookie(`${TA_URL}/students/${course.link}`);
        const detailHtml = await detailResponse.text();
        Object.assign(course, parseCourseDetails(detailHtml));
      }
    }
    // 6. Return JSON
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TA Proxy running on port ${PORT}`)); 