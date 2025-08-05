import React, { useState, useEffect } from "react";
import {
  fetchAllUsers,
  promoteUser,
  demoteUser,
  deleteUser,
  getCurrentUserInfo,
} from "../../../services/authConfig";
import "../../Stylesheets/AdminDashboard.css";
import SiteContainer from "../../../utils/SiteContainer.js";
import { list, remove } from 'aws-amplify/storage';

function ViewPlayers() {
  const [players, setPlayers] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ open: false, type: null, player: null });
  const playersPerPage = 15;

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const users = await fetchAllUsers();
        setPlayers(users);
        const currentUser = await getCurrentUserInfo();
        setCurrentUserEmail(currentUser.email);
      } catch (error) {
        console.error("Fetch Players Error:", error);
      }
    }
    fetchPlayers();
  }, []);

  const handleSearch = () => setCurrentPage(1);

  const filteredPlayers = players.filter(player =>
    `${player.given_name} ${player.family_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  const deleteUserUploads = async (email) => {
    try {
      const files = await list({
        path: `uploads/${email}/`
        // Alternatively, path: ({identityId}) => `album/${identityId}/photos/`
      });
      console.log(files);
      if (files.items.length == 0) {
        console.log('No associated files found. Proceeding with account deletion');
        return;
      }
      for (let i = 0; i < files.items.length; i++) {
        const result = await remove({ 
          path: files.items[i].path
          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
        });
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleModalConfirm = async () => {
    if (!modal.player) return;
    setLoading(true);
    if (modal.type === "promote") {
      await promoteUser(modal.player.username);
      setPlayers(players.map(p =>
        p.username === modal.player.username ? { ...p, groups: [...p.groups, "admin"] } : p
      ));
    } else if (modal.type === "delete") {
      await deleteUser(modal.player.username);
      console.log(modal.player.email)
      await deleteUserUploads(modal.player.email);
      setPlayers(players.filter(p => p.username !== modal.player.username));
    }
    setLoading(false);
    closeModal();
  };

  const closeModal = () => setModal({ open: false, type: null, player: null });

  return (
    <SiteContainer content={
      <div>
        <div className="admin-dashboard">
          <h1 className="dashboard-title text-center mb-6">VIEW USERS</h1>

          <div className="filters mb-4 flex justify-start">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="px-3 py-2 border rounded w-80"
            />
          </div>

          <table className="player-table">
            <thead>
              <tr>
                <th>PLAYER NAME</th>
                <th>REGISTRATION DATE</th>
                <th>ROLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentPlayers.length > 0 ? (
                currentPlayers.map((player, index) => (
                  <tr key={index}>
                    <td>{`${player.given_name} ${player.family_name}`}</td>
                    <td>{new Date(player.created_at).toLocaleString()}</td>
                    <td>
                      {player.groups && player.groups.includes("admin") ? "Admin" : "Basic User"}
                    </td>
                    <td>
                      {player.email === currentUserEmail ? (
                        <span style={{ color: '#888' }}>N/A</span>
                      ) : (
                        <>
                          {player.groups && player.groups.includes("admin") ? (
                            <button
                              onClick={() => demoteUser(player.username)}
                              className="demote-button"
                              disabled={loading}
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              onClick={() => setModal({ open: true, type: "promote", player })}
                              className="promote-button"
                              disabled={loading}
                            >
                              Promote
                            </button>
                          )}
                          <button
                            onClick={() => setModal({ open: true, type: "delete", player })}
                            className="delete-button"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No players found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="bg-sky-700 text-white px-3 py-1 rounded shadow"
              disabled={currentPage === 1}
            >
              &larr;
            </button>
            <span className="px-4 py-1">Page {currentPage} of {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="bg-sky-700 text-white px-3 py-1 rounded shadow"
              disabled={currentPage === totalPages}
            >
              &rarr;
            </button>
          </div>
        </div>

        {modal.open && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3>
                {modal.type === "promote"
                  ? `Promote ${modal.player.given_name} ${modal.player.family_name} to Admin?`
                  : `Delete ${modal.player.given_name} ${modal.player.family_name}?`}
              </h3>
              <p>
                {modal.type === "promote"
                  ? "Are you sure you want to promote this user to Admin?"
                  : "Are you sure you want to delete this user? This action cannot be undone."}
              </p>
              <div className="modal-actions">
                <button onClick={handleModalConfirm} disabled={loading} className="promote-button">
                  Confirm
                </button>
                <button onClick={closeModal} className="delete-button" disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    } />
  );
}

export default ViewPlayers;
