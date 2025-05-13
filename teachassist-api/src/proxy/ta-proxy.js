const express = require('express');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;
const TA_URL = 'https://ta.yrdsb.ca/live';

// Rate limiting
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
const requestCounts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  
  // Clean up old requests
  if (requestCounts.has(ip)) {
    requestCounts.set(ip, requestCounts.get(ip).filter(time => time > windowStart));
  }
  
  // Count requests in current window
  const count = requestCounts.get(ip)?.length || 0;
  if (count >= RATE_LIMIT) {
    return true;
  }
  
  // Add new request
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  requestCounts.get(ip).push(now);
  return false;
}

// Cookie handling
let cookies = [];

async function fetchCookie(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Cookie': cookies.join('; ')
    }
  });
  
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    cookies = setCookie.split(',').map(cookie => cookie.split(';')[0]);
  }
  
  return response;
}

// Middleware
app.use(express.json());

// Rate limiting middleware
app.use((req, res, next) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
});

// Main endpoint
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

// Start server
app.listen(PORT, () => {
  console.log(`TeachAssist proxy server running on port ${PORT}`);
}); 