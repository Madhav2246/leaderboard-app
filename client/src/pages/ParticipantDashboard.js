// StyledParticipantDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaderboardTable from "../components/LeaderboardTable";
import logo from '../assets/images/acm-logo.jpg';
import '../assets/ParticipantDashboardStyles.css';

export default function StyledParticipantDashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userScore, setUserScore] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const leaderboardRes = await axios.get("http://localhost:5000/api/leaderboard", config);
      setLeaderboard(leaderboardRes.data);

      const user = JSON.parse(localStorage.getItem("user"));
      const personal = leaderboardRes.data.find((e) => e.user_id === user.id);
      setUserScore(personal || null);
    };

    fetchData();
  }, []);

  const filtered = leaderboard.filter(
    (entry) =>
      entry.participant_name.toLowerCase().includes(search.toLowerCase()) ||
      (entry.mentor_name && entry.mentor_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: 'linear-gradient(135deg, #f5f7fa, #e4ecf1)', minHeight: '100vh', color: '#333' }}>

      {/* === Navbar === */}
      <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 600, color: '#1976d2' }}>
          <img src={logo} alt="ACM" style={{ height: '35px', width: 'auto' }} />
          <span>ACM Recruitment</span>
        </div>
        <div>
          <a href="/home" style={{ marginLeft: '20px', color: '#333', fontWeight: 500, textDecoration: 'none' }}>Home</a>
          <a href="/dashboard" style={{ marginLeft: '20px', color: '#333', fontWeight: 500, textDecoration: 'none' }}>Dashboard</a>
          <a href="/logout" style={{ marginLeft: '20px', color: '#333', fontWeight: 500, textDecoration: 'none' }}>Logout</a>
        </div>
      </nav>

      {/* === Participant Dashboard Section === */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#1976d2', fontSize: '2rem', marginBottom: '30px', textShadow: '0 0 8px rgba(25, 118, 210, 0.3)' }}>Participant Dashboard</h2>

        {userScore && (
          <div style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem', borderRadius: '10px', marginBottom: '30px', textAlign: 'left' }}>
            <h3 style={{ color: '#0d47a1' }}>Your Score Summary</h3>
            <p><strong>Mentor:</strong> {userScore.mentor_name || "Unassigned"}</p>
            <p><strong>Total Score:</strong> {userScore.total_score || 0}</p>
            <ul>
              <li>Challenge 1: {userScore.challenge1_score || 0}</li>
              <li>Challenge 2: {userScore.challenge2_score || 0}</li>
              <li>Challenge 3: {userScore.challenge3_score || 0}</li>
              <li>Challenge 4: {userScore.challenge4_score || 0}</li>
              <li>Consistency: {userScore.consistency_score || 0}</li>
              <li>Communication: {userScore.communication_score || 0}</li>
              <li>Final Project: {userScore.final_project_score || 0}</li>
            </ul>
          </div>
        )}

        <h4 style={{ marginBottom: '15px', color: '#0d47a1' }}>Leaderboard</h4>
        <input
          type="text"
          placeholder="Search by participant or mentor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '20px' }}
        />

        <LeaderboardTable data={filtered} userRole="participant" />
      </div>

      {/* === Footer === */}
      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '0.9rem', background: '#f2f2f2', color: '#777' }}>
        © ACM Amritapuri | 2025 | May the Code be with you!!
      </footer>
    </div>
  );
}
