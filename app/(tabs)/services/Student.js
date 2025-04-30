export default class Student {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.courses = [];
  }

  async login() {
    try {
      const response = await fetch('https://ta.yrdsb.ca/live/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}&subject_id=0&submit=Login`,
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const text = await response.text();
      if (text.includes('Invalid Student Number or Password')) {
        throw new Error('Invalid credentials');
      }

      return text;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}