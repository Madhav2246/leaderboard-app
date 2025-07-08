import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaderboardTable from "../components/LeaderboardTable";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminDashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [mentors, setMentors] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentor"
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const leaderboardRes = await axios.get("http://localhost:5000/api/admin/leaderboard", config);
      setLeaderboard(leaderboardRes.data);

      const logsRes = await axios.get("http://localhost:5000/api/admin/score-logs", config);
      setLogs(logsRes.data);

      const mentorRes = await axios.get("http://localhost:5000/api/admin/mentors", config);
      setMentors(mentorRes.data);
    };

    fetchData();
  }, []);

  const handleAssignMentor = async (participantId, mentorId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/assign-mentor",
        { participantId, mentorId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Mentor assigned successfully");
    } catch (err) {
      alert("Failed to assign mentor");
      console.error(err);
    }
  };

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

  const exportCSV = () => {
    const headers = [
      "Participant Name", "Email", "Mentor", "Total Score",
      "Challenge1", "Challenge2", "Challenge3", "Challenge4",
      "Consistency", "Communication", "Final Project"
    ];

    const rows = filtered.map((row) => [
      row.participant_name,
      row.email,
      row.mentor_name || "Unassigned",
      row.total_score || 0,
      row.challenge1_score || 0,
      row.challenge2_score || 0,
      row.challenge3_score || 0,
      row.challenge4_score || 0,
      row.consistency_score || 0,
      row.communication_score || 0,
      row.final_project_score || 0,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1300px" }}>
      <div className="card p-4 shadow mb-5">
        <h4 className="text-success mb-3">Create Mentor / Admin</h4>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await axios.post(
                "http://localhost:5000/api/admin/create-user",
                createForm,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              alert(`✅ ${res.data.user.role} ${res.data.user.name} created successfully`);
              setCreateForm({ name: "", email: "", password: "", role: "mentor" });
            } catch (err) {
              alert("❌ Failed to create user");
              console.error(err);
            }
          }}
        >
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Full Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <input type="email" className="form-control" placeholder="Email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <input type="password" className="form-control" placeholder="Password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-success w-100">Add</button>
            </div>
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <input type="text" className="form-control me-2" placeholder="Search by participant or mentor" style={{ maxWidth: "300px" }} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-success" onClick={exportCSV}>Export CSV</button>
      </div>

      {filtered.map((entry) => (
        <div key={entry.user_id} className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
          <span><strong>{entry.participant_name}</strong> — {entry.email}</span>
          <div className="d-flex align-items-center gap-2">
            <label className="me-2">Mentor:</label>
            <select
              className="form-select"
              style={{ minWidth: "200px" }}
              value={entry.mentor_id || ""}
              onChange={(e) => handleAssignMentor(entry.user_id, e.target.value)}
            >
              <option value="">Unassigned</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <LeaderboardTable
        data={filtered.map(entry => ({
          ...entry,
          isMentee: true
        }))}
        userRole="admin"
        onEdit={(entry) => {
          setEditingEntry(entry);
          setEditForm({
            challenge1_score: entry.challenge1_score || 0,
            challenge2_score: entry.challenge2_score || 0,
            challenge3_score: entry.challenge3_score || 0,
            challenge4_score: entry.challenge4_score || 0,
            consistency_score: entry.consistency_score || 0,
            communication_score: entry.communication_score || 0,
            final_project_score: entry.final_project_score || 0,
            feedback: ""
          });
        }}
      />

      {editingEntry && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Scores - {editingEntry.participant_name}</h5>
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

      <hr className="my-5" />
      <h4 className="text-info mb-3">📋 Score Change Logs</h4>

      {logs.length === 0 ? (
        <p className="text-muted">No score changes recorded yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-light">
              <tr>
                <th>Participant</th>
                <th>Component</th>
                <th>Old</th>
                <th>New</th>
                <th>Updated By</th>
                <th>Feedback</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.participant_name}</td>
                  <td>{log.component.replace(/_/g, ' ')}</td>
                  <td>{log.old_value ?? "-"}</td>
                  <td>{log.new_value ?? "-"}</td>
                  <td>{log.updated_by}</td>
                  <td>{log.feedback || "-"}</td>
                  <td>{new Date(log.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
