// config.js
const ALLOWED_PRODUCTION_HOSTS = ["taskmaster-fc59.onrender.com"];

const config = {
    API_BASE_URL: "http://localhost:8000", 
};

if (ALLOWED_PRODUCTION_HOSTS.includes(window.location.hostname)) {
    config.API_BASE_URL = "https://taskmaster-fc59.onrender.com";
}

export default config;
