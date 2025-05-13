import { CourseData, Assignment } from '../types/teachassist';

/**
 * Student class for interacting with the ta-api public endpoint.
 * Handles authentication and fetching course data for a student.
 */
export class Student {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * Fetches courses for the student from the ta-api local endpoint.
   * @returns Promise<CourseData[]> - Array of course data objects.
   * @throws Error if the API call fails or returns an error.
   */
  async fetchCourses(): Promise<CourseData[]> {
    try {
      // Make a POST request to the ta-api local endpoint
      const response = await fetch('http://localhost:3001/api/getCourses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.username, password: this.password })
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TeachAssist] API Error:', errorText);
        throw new Error('Failed to fetch courses: ' + errorText);
      }

      // Parse the returned JSON
      const apiData = await response.json();
      console.log('[TeachAssist] API Response:', JSON.stringify(apiData, null, 2));

      // Ensure the response is an array
      if (!Array.isArray(apiData)) return [];

      // Map the API response to your CourseData structure
      return apiData.map((course: any) => ({
        id: course.code || course.name,
        name: course.name,
        code: course.code,
        teacher: course.teacher, // May be undefined if not provided by API
        room: course.room,
        mark: course.overall_mark, // Use 'overall_mark' as the mark field
        block: course.block,
        assignments: (course.assignments as Assignment[]) || [],
        // Add any other fields you want to use from the API response
      }));
    } catch (err) {
      // Log and rethrow errors for higher-level handling
      console.error('[TeachAssist] Fetch Error:', err);
      throw err;
    }
  }
} 