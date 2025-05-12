const TeachAssistError = require("./TeachAssistError.js");
const http = require("./http.js");

class Course {
  constructor(id, name, grade, room, period, student) {
    this.id = id;
    this.name = name;
    this.grade = grade;
    this.room = room;
    this.period = period;
    this.block = period;
    this.student = student;
    this.marks = [];
    console.log('[TeachAssist] Created course instance:', name, '(ID:', id, ')');
  }

  async getMarks(cookieJar) {
    console.log('[TeachAssist] Fetching marks for course:', this.name);
    if (this.id === -1) {
      console.warn('[TeachAssist] Attempted to fetch marks for course without marks');
      throw new TeachAssistError("Course has no marks.");
    }

    try {
      console.log('[TeachAssist] Making marks request...');
      const res = await http.get(`https://ta.yrdsb.ca/live/students/viewReport.php?course_id=${this.id}&student_id=${this.student.id}`, {
        jar: cookieJar
      });

      console.log('[TeachAssist] Marks response status:', res.statusCode);

      const weights = {};
      const categories = {};
      const marks = [];

      // Extract weight information
      console.log('[TeachAssist] Parsing weight information...');
      const weightMatches = res.body.match(/W=(\d+)/g);
      if (weightMatches) {
        weightMatches.forEach(match => {
          const weight = parseInt(match.slice(2));
          const categoryMatch = res.body.match(new RegExp(`W=${weight}.*?>(.*?)</`));
          if (categoryMatch) {
            const category = categoryMatch[1].trim();
            weights[category] = weight;
            console.log('[TeachAssist] Found category weight:', category, '-', weight + '%');
          }
        });
      } else {
        console.warn('[TeachAssist] No weight information found');
      }

      // Extract mark information
      console.log('[TeachAssist] Parsing mark rows...');
      const rows = res.body.match(/<tr[^>]*>.*?<\/tr>/gs);
      if (!rows) {
        console.warn('[TeachAssist] No mark rows found in response');
        return { weights, categories, marks };
      }

      let currentCategory = null;

      for (const row of rows) {
        // Check for category row
        const categoryMatch = row.match(/<td[^>]*>.*?<b>([^<]+)<\/b>/);
        if (categoryMatch) {
          currentCategory = categoryMatch[1].trim();
          categories[currentCategory] = [];
          console.log('[TeachAssist] Processing category:', currentCategory);
          continue;
        }

        // Check for mark row
        const cells = row.match(/<td[^>]*>(.*?)<\/td>/gs);
        if (!cells || cells.length < 6 || !currentCategory) continue;

        const nameMatch = cells[0].match(/>([^<]+)</);
        const feedbackMatch = cells[1].match(/>([^<]+)</);
        const finishedMatch = cells[2].match(/>([^<]+)</);
        const markMatch = cells[4].match(/>([\d.]+)/);
        const weightMatch = cells[5].match(/>([\d.]+)/);

        if (!nameMatch || !finishedMatch || !markMatch || !weightMatch) {
          console.warn('[TeachAssist] Invalid mark row structure');
          continue;
        }

        const mark = {
          name: nameMatch[1].trim(),
          feedback: feedbackMatch ? feedbackMatch[1].trim() : "",
          finished: finishedMatch[1].trim() === "Y",
          mark: parseFloat(markMatch[1]),
          weight: parseFloat(weightMatch[1]),
          category: currentCategory
        };

        console.log('[TeachAssist] Found mark:', mark.name, '-', mark.mark + '%', '(Weight:', mark.weight + '%)');
        marks.push(mark);
        categories[currentCategory].push(mark);
      }

      console.log('[TeachAssist] Successfully parsed', marks.length, 'marks in', Object.keys(categories).length, 'categories');
      return { weights, categories, marks };
    } catch (error) {
      console.error('[TeachAssist] Error fetching marks:', error.message);
      throw error;
    }
  }

  async getMeta(cookieJar) {
    console.log('[TeachAssist] Fetching metadata for course:', this.name);
    if (this.id === -1) {
      console.warn('[TeachAssist] Attempted to fetch metadata for course without marks');
      throw new TeachAssistError("Course has no marks.");
    }

    try {
      console.log('[TeachAssist] Making metadata request...');
      const res = await http.get(`https://ta.yrdsb.ca/live/students/viewReport.php?course_id=${this.id}&student_id=${this.student.id}`, {
        jar: cookieJar
      });

      console.log('[TeachAssist] Metadata response status:', res.statusCode);

      const meta = {
        name: this.name,
        room: this.room,
        period: this.period,
        mark: this.mark
      };

      // Extract teacher name
      const teacherMatch = res.body.match(/Teacher:<\/b>\s*([^<]+)/);
      if (teacherMatch) {
        meta.teacher = teacherMatch[1].trim();
        console.log('[TeachAssist] Found teacher:', meta.teacher);
      } else {
        console.warn('[TeachAssist] Teacher information not found');
      }

      // Extract start and end dates
      const dateMatch = res.body.match(/Start Date:<\/b>\s*([^<]+).*?End Date:<\/b>\s*([^<]+)/s);
      if (dateMatch) {
        meta.startDate = dateMatch[1].trim();
        meta.endDate = dateMatch[2].trim();
        console.log('[TeachAssist] Found course dates:', meta.startDate, 'to', meta.endDate);
      } else {
        console.warn('[TeachAssist] Course dates not found');
      }

      return meta;
    } catch (error) {
      console.error('[TeachAssist] Error fetching course metadata:', error.message);
      throw error;
    }
  }
}

module.exports = Course;