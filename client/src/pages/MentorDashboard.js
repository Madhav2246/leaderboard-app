// MentorDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaderboardTable from "../components/LeaderboardTable";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MentorDashboard() {
  const [mentees, setMentees] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchMentees = async () => {
      const res = await axios.get("http://localhost:5000/api/mentor/mentees", config);
      setMentees(res.data);
    };

    const fetchLeaderboard = async () => {
      const res = await axios.get("http://localhost:5000/api/leaderboard", config);
      setLeaderboard(res.data);
    };

    fetchMentees();
    fetchLeaderboard();
  }, []);

  const handleEditSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/score/update",
        { userId: editingEntry.user_id, ...editForm },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Score updated successfully");
      setEditingEntry(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update score");
    }
  };

  const filtered = leaderboard.filter(
    (entry) =>
      entry.participant_name.toLowerCase().includes(search.toLowerCase()) ||
      (entry.mentor_name && entry.mentor_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary text-center">Mentor Dashboard</h2>

      <div className="mb-4">
        <h5>Your Mentees</h5>
        {mentees.length === 0 ? (
          <p>No mentees assigned.</p>
        ) : (
          <ul className="list-group mb-3">
            {mentees.map((mentee) => (
              <li
                key={mentee.user_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {mentee.name} ({mentee.email})
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setEditingEntry(mentee);
                    setEditForm({
                      challenge1_score: mentee.challenge1_score || 0,
                      challenge2_score: mentee.challenge2_score || 0,
                      challenge3_score: mentee.challenge3_score || 0,
                      challenge4_score: mentee.challenge4_score || 0,
                      consistency_score: mentee.consistency_score || 0,
                      communication_score: mentee.communication_score || 0,
                      final_project_score: mentee.final_project_score || 0,
                      feedback: ""
                    });
                  }}
                >
                  Edit Score
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="my-4" />
      <h5 className="mb-3">Overall Leaderboard</h5>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by participant or mentor"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <LeaderboardTable data={filtered} userRole="mentor" />

      {editingEntry && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Scores - {editingEntry.name}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingEntry(null)}></button>
              </div>
              <div className="modal-body">
                {Object.keys(editForm).map((key) => (
                  <div className="mb-2" key={key}>
                    <label className="form-label text-capitalize">{key.replace(/_/g, " ")}</label>
                    <input
                      type={key === "feedback" ? "text" : "number"}
                      className="form-control"
                      value={editForm[key]}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingEntry(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
