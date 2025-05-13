import Course from './Course';
import Mark from './Mark';
import Weight from './Weight';
import TeachAssistError from './TeachAssistError';
import { request } from './http';

export const teachAssistService = {
  async login(username, password) {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('submit', 'Login');
      formData.append('subject_id', '0');

      const response = await request('index.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const html = await response.text();
      if (html.includes('Invalid Student Number or Password')) {
        throw new TeachAssistError('Invalid credentials', TeachAssistError.ERROR_TYPES.AUTH_ERROR);
      }

      const courses = this.parseCoursesFromHTML(html);
      if (!courses || courses.length === 0) {
        throw new TeachAssistError('No courses found', TeachAssistError.ERROR_TYPES.PARSE_ERROR);
      }

      return courses;
    } catch (error) {
      if (error instanceof TeachAssistError) {
        throw error;
      }
      throw new TeachAssistError(error.message, TeachAssistError.ERROR_TYPES.AUTH_ERROR);
    }
  },

  parseCoursesFromHTML(html) {
    try {
      const courses = [];
      const coursePattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
      const courseMatches = html.match(coursePattern) || [];

      for (const courseMatch of courseMatches) {
        if (courseMatch.includes('Course Name') || courseMatch.includes('Please see teacher')) {
          continue;
        }

        const courseData = this.parseCourseRow(courseMatch);
        if (courseData) {
          courses.push(courseData);
        }
      }

      return courses;
    } catch (error) {
      throw new TeachAssistError(
        `Failed to parse courses: ${error.message}`,
        TeachAssistError.ERROR_TYPES.PARSE_ERROR
      );
    }
  },

  parseCourseRow(row) {
    try {
      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      if (cells.length < 3) return null;

      const courseInfo = cells[0].replace(/<[^>]+>/g, '').trim().split('\n');
      if (courseInfo.length < 2) return null;

      const [courseCode, courseName] = courseInfo[0].split(':').map(s => s.trim());
      const blockMatch = courseInfo[1].match(/Block:\s*P(\d+)/i);
      const roomMatch = courseInfo[1].match(/rm\.\s*(\d+)/i);

      const markCell = cells[2].replace(/<[^>]+>/g, '').trim();
      const markInfo = this.parseMarkInfo(markCell);

      if (markInfo.mark === 'N/A') return null;

      const course = new Course(
        courseCode,
        courseName || courseCode,
        roomMatch ? roomMatch[1] : '',
        blockMatch ? blockMatch[1] : ''
      );

      course.overallMark = parseFloat(markInfo.mark);
      course.isFinal = markInfo.isFinal;
      course.isMidterm = markInfo.isMidterm;

      const linkMatch = row.match(/href="([^"]*viewReport[^"]*)"/);
      if (linkMatch) {
        course.link = linkMatch[1];
      }

      return course;
    } catch (error) {
      console.error('Error parsing course row:', error);
      return null;
    }
  },

  parseMarkInfo(markText) {
    if (!markText) return { mark: 'N/A', isFinal: false, isMidterm: false };
    
    markText = markText.trim().replaceAll(' ', '');
    const result = {
      mark: 'N/A',
      isFinal: false,
      isMidterm: false
    };

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
  },

  async getCourseDetails(course) {
    if (!course.link) {
      throw new TeachAssistError('No course link available', TeachAssistError.ERROR_TYPES.GENERAL_ERROR);
    }

    try {
      const response = await request(course.link);
      const html = await response.text();
      return this.parseCourseDetails(html);
    } catch (error) {
      throw new TeachAssistError(
        `Failed to get course details: ${error.message}`,
        TeachAssistError.ERROR_TYPES.NETWORK_ERROR
      );
    }
  },

  parseCourseDetails(html) {
    const assignments = [];
    const weightTable = {};

    try {
      // Parse weight table
      const weightCategories = {
        K: 'ffffaa',
        T: 'c0fea4',
        C: 'afafff',
        A: 'ffd490'
      };

      Object.entries(weightCategories).forEach(([category, color]) => {
        const weightRegex = new RegExp(`<tr[^>]*bgcolor="#${color}"[^>]*>([\s\S]*?)<\/tr>`, 'i');
        const weightMatch = html.match(weightRegex);
        
        if (weightMatch) {
          const cells = weightMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
          if (cells.length >= 3) {
            const weights = cells.map(cell => {
              const text = cell.replace(/<[^>]+>/g, '').trim();
              return parseFloat(text.replace('%', '')) || 0;
            });
            weightTable[category] = new Weight(...weights).toObject();
          }
        }
      });

      // Parse assignments
      const assignmentRows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
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
                const weight = weightMatch ? parseFloat(weightMatch[1]) : 1;
                
                assignment[category] = [new Mark(get, total, weight, !text.includes('finished'))];
              } catch (e) {
                assignment[category] = [new Mark(0, 0, 1, true)];
              }
            }
          });

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

      return {
        assignments,
        weightTable: Object.keys(weightTable).length > 0 ? weightTable : null
      };
    } catch (error) {
      throw new TeachAssistError(
        `Failed to parse course details: ${error.message}`,
        TeachAssistError.ERROR_TYPES.PARSE_ERROR
      );
    }
  }
}; 