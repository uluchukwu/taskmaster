// config.js
const ALLOWED_PRODUCTION_HOSTS = ["taskmaster-fc59.onrender.com"];

const config = {
    API_BASE_URL: "https://taskmaster-9drx.onrender.com", 
};

if (ALLOWED_PRODUCTION_HOSTS.includes(window.location.hostname)) {
    config.API_BASE_URL = "https://taskmaster-9drx.onrender.com";
}

export default config;
