const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');

const app = express();
app.use(cors());
app.use(express.json());

const TEACHASSIST_URL = 'https://ta.yrdsb.ca/live/index.php';

app.post('/teachassist/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const formData = qs.stringify({
      username,
      password,
      subject_id: 'true',
      submit: 'Login',
    });

    const response = await axios.post(TEACHASSIST_URL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    // TODO: Parse the HTML response and return the relevant data
    res.json({ html: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
