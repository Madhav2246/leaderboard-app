import React, { useState } from "react";
import '../assets/leaderboard.css'; // Make sure your styles are in place

export default function LeaderboardTable({ data = [], userRole = "participant", onEdit = null }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const start = (page - 1) * itemsPerPage;
  const paginated = data.slice(start, start + itemsPerPage);

  const goToPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goToNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="leaderboard-wrapper">
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Participant</th>
              <th>Email</th>
              <th>Mentor</th>
              <th>Total</th>
              <th>Ch1</th>
              <th>Ch2</th>
              <th>Ch3</th>
              <th>Ch4</th>
              <th>Cons</th>
              <th>Comm</th>
              <th>Final</th>
              {userRole !== "participant" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map((entry, idx) => (
              <tr key={entry.user_id} className="glow-row">
                <td>{start + idx + 1}</td>
                <td>{entry.participant_name}</td>
                <td>{entry.email}</td>
                <td>{entry.mentor_name || "-"}</td>
                <td><strong>{entry.total_score || 0}</strong></td>
                <td>{entry.challenge1_score || 0}</td>
                <td>{entry.challenge2_score || 0}</td>
                <td>{entry.challenge3_score || 0}</td>
                <td>{entry.challenge4_score || 0}</td>
                <td>{entry.consistency_score || 0}</td>
                <td>{entry.communication_score || 0}</td>
                <td>{entry.final_project_score || 0}</td>
                {userRole !== "participant" && (
                  <td>
                    {(userRole === "admin" || entry.isMentee) ? (
                      <button className="edit-btn" onClick={() => onEdit && onEdit(entry)}>Edit</button>
                    ) : "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button className="nav-btn" onClick={goToPrev} disabled={page === 1}>←</button>
        <span className="page-indicator">Page {page} of {totalPages}</span>
        <button className="nav-btn" onClick={goToNext} disabled={page === totalPages}>→</button>
      </div>
    </div>
  );
}
