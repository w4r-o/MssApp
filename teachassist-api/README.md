# TeachAssist API

A Node.js implementation of the YRDSB TeachAssist API.

## Features
- Login and fetch course data from YRDSB TeachAssist
- Parse marks, assignments, and weight tables
- Rate limiting and error handling
- Proxy server for secure API access

## Directory Structure
```
teachassist-api/
├── src/
│   ├── services/
│   └── proxy/
├── package.json
└── README.md
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the proxy server:
   ```bash
   npm start
   ```
3. Test with a POST request to `http://localhost:3000/api/teachassist`:
   ```json
   {
     "username": "student_number",
     "password": "password"
   }
   ```

## Implementation Notes
- **Authentication Flow:**
  - Get cookies, submit login, parse course list, fetch details for each course
- **HTML Parsing:**
  - Use regex to extract data, handle different mark formats, parse weights and assignments
- **Error Handling:**
  - Custom `TeachAssistError` class, meaningful error messages
- **Rate Limiting:**
  - Per-IP, sliding window (30 requests/minute)
- **Cookie Management:**
  - Store and update cookies between requests

## Security
- Do not expose this API publicly without proper authentication and rate limiting.
- Never log or store user credentials.

## License
See LICENSE.txt in the original repository. 