const DEV_MODE = true; // Set to false for production

const config = {
  API_URL: DEV_MODE
    ? "http://192.168.0.202:3000" // Your computer's IP address
    : "http://localhost:3000", // Local development
};

export default config;
