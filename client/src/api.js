import axios from "axios";

const instance = axios.create({
  baseURL: "https://leaderboard-app-qrsn.onrender.com", // change this
  withCredentials: true, // optional if you're using auth cookies
});

export default instance;
