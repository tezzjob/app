const API_ENDPOINT_URL =
  process.env.APP_ENV === 'production'
    ? '/api' // Production: relative path, same domain
    : 'http://localhost:8080/api'; // Development: server URL

export default API_ENDPOINT_URL;
