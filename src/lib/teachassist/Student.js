export default class Student {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.courses = [];
  }

  async login() {
    console.log('[TeachAssist] login() called');
    try {
      console.log('[TeachAssist] Sending login POST request...');
      const response = await fetch('https://ta.yrdsb.ca/live/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}&subject_id=0&submit=Login`,
      });
      console.log('[TeachAssist] Login response status:', response.status);
      if (!response.ok) throw new Error('Login failed');
      const text = await response.text();
      console.log('[TeachAssist] Login response body (first 500 chars):', text.slice(0, 500));
      if (text.includes('Invalid Student Number or Password')) {
        throw new Error('Invalid credentials');
      }
      // Optionally parse HTML here for session/cookies if needed
      return text;
    } catch (error) {
      console.error('[TeachAssist] Login error:', error.message, error.stack);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async getCourses() {
    console.log('[TeachAssist] getCourses() called');
    try {
      console.log('[TeachAssist] Sending GET request for courses...');
      const response = await fetch('https://ta.yrdsb.ca/live/students/listReports.php', {
        method: 'GET',
        // Add headers/cookies if needed
      });
      console.log('[TeachAssist] Courses response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const text = await response.text();
      console.log('[TeachAssist] Courses response body (first 500 chars):', text.slice(0, 500));
      // TODO: Parse HTML and populate this.courses
      // Example: this.courses = parseCoursesFromHTML(text);
      return this.courses;
    } catch (error) {
      console.error('[TeachAssist] getCourses error:', error.message, error.stack);
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  }

  async getMarks(courseID) {
    console.log('[TeachAssist] Fetching marks for course ID:', courseID);
    try {
      if (!this.courses.length) {
        console.log('[TeachAssist] No courses loaded, fetching courses first...');
        await this.getCourses();
      }
      const c = this.courses.find((c) => c.id === courseID);
      if (!c) {
        console.error('[TeachAssist] Course not found:', courseID);
        throw new Error("Course not found.");
      }
      return c.getMarks();
    } catch (error) {
      console.error('[TeachAssist] Error fetching marks:', error.message);
      throw error;
    }
  }

  async getMeta(courseID) {
    console.log('[TeachAssist] Fetching metadata for course ID:', courseID);
    try {
      await this.login();
      const c = this.courses.find((c) => c.id === courseID);
      if (!c) {
        console.error('[TeachAssist] Course not found:', courseID);
        throw new Error("Course not found.");
      }
      return c.getMeta();
    } catch (error) {
      console.error('[TeachAssist] Error fetching course metadata:', error.message);
      throw error;
    }
  }
}