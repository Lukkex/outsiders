// ViewPlayers.js

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

function ViewPlayers() {
  const [players, setPlayers] = useState([]);
  const [prisonFilter, setPrisonFilter] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: null, // "promote" or "delete"
    player: null,
  });

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

  const handleFilterChange = (event) => {
    setPrisonFilter(event.target.value);
  };

  const handlePromote = async (player) => {
    const confirm = window.confirm(
      `Are you sure you want to promote ${player.given_name} ${player.family_name} to Admin?`
    );
    if (!confirm) return;

    try {
      setLoading(true);
      await promoteUser(player.username);
      const updatedPlayers = players.map((p) =>
        p.username === player.username ? { ...p, groups: [...p.groups, "admin"] } : p
      );
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error("Promote User Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemote = async (player) => {
    try {
      setLoading(true);
      await demoteUser(player.username);
      const updatedPlayers = players.map((p) =>
        p.username === player.username ? { ...p, groups: p.groups.filter((g) => g !== "admin") } : p
      );
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error("Demote User Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (player) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${player.given_name} ${player.family_name}? This action cannot be undone.`
    );
    if (!confirm) return;

    try {
      setLoading(true);
      await deleteUser(player.username);
      const updatedPlayers = players.filter((p) => p.username !== player.username);
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error("Delete User Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, player) => {
    setModal({ open: true, type, player });
  };

  const closeModal = () => {
    setModal({ open: false, type: null, player: null });
  };

  const handleModalConfirm = async () => {
    if (!modal.player) return;
    setLoading(true);
    if (modal.type === "promote") {
      await promoteUser(modal.player.username);
      setPlayers(players.map((p) =>
        p.username === modal.player.username ? { ...p, groups: [...p.groups, "admin"] } : p
      ));
    } else if (modal.type === "delete") {
      await deleteUser(modal.player.username);
      setPlayers(players.filter((p) => p.username !== modal.player.username));
    }
    setLoading(false);
    closeModal();
  };

  const filteredPlayers = prisonFilter
    ? players.filter(
        (player) =>
          Array.isArray(player.preferred_prisons) &&
          player.preferred_prisons.includes(prisonFilter)
      )
    : players;

  return (
    <SiteContainer
      content={
        <div>
          <div className="admin-dashboard">
            <h1 className="dashboard-title">VIEW PLAYERS</h1>

            <div className="filters">
              <select onChange={handleFilterChange} value={prisonFilter}>
                <option value="">All Prisons</option>
                <option value="Folsom">Folsom</option>
                <option value="San Quentin">San Quentin</option>
              </select>
            </div>

            <table className="player-table">
              <thead>
                <tr>
                  <th>PLAYER NAME</th>
                  <th>PREFERRED PRISONS</th>
                  <th>REGISTRATION DATE</th>
                  <th>ROLE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player, index) => (
                    <tr key={index}>
                      <td>{`${player.given_name} ${player.family_name}`}</td>
                      <td>{player.preferred_prisons.join(', ') || "Unknown"}</td>
                      <td>{new Date(player.created_at).toLocaleString()}</td>
                      <td>
                        {player.groups && player.groups.includes("admin")
                          ? "Admin"
                          : "Basic User"}
                      </td>
                      <td className="action-buttons">
                        {player.email === currentUserEmail ? (
                          <span style={{ color: '#888' }}>N/A</span>
                        ) : (
                          <>
                            {player.groups && player.groups.includes("admin") ? (
                              <button
                                onClick={() => handleDemote(player)}
                                className="demote-button"
                                disabled={loading}
                              >
                                Demote
                              </button>
                            ) : (
                              <button
                                onClick={() => openModal("promote", player)}
                                className="promote-button"
                                disabled={loading}
                              >
                                Promote
                              </button>
                            )}
                            <button
                              onClick={() => openModal("delete", player)}
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
                    <td colSpan="5">No players found</td>
                  </tr>
                )}
              </tbody>
            </table>
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
      }
    />
  );
}

export default ViewPlayers;