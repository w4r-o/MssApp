const axios = require("axios");
const tough = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const http = wrapper(axios.create({
  withCredentials: true,
  jar: new tough.CookieJar(),
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  }
}));

module.exports = http; 