import React, { useState, useEffect } from 'react';
import { fetchUsersInGroup } from '../../../services/authConfig';
import '../../Stylesheets/AdminDashboard.css';
import SiteHeader from '../../../utils/SiteHeader';

function ViewPlayers() {
    const [players, setPlayers] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            try {
                console.log("Fetching users from group...");
                const users = await fetchUsersInGroup("basic_users");
                console.log("Fetched Users:", users);
                setPlayers(users);
            } catch (error) {
                console.error("Fetch Players Error:", error);
            }
        }
        fetchPlayers();
    }, []);

    const handleFilterChange = (event) => {
        setPrisonFilter(event.target.value);
    };

    const filteredPlayers = prisonFilter
    ? players.filter(player => Array.isArray(player.preferred_prisons) && player.preferred_prisons.includes(prisonFilter))
    : players;


    return (
        <div>
            <SiteHeader />
            <div className="admin-dashboard">
                <h1 className="dashboard-title">VIEW PLAYERS</h1>

                <div className="filters">
                    <select onChange={handleFilterChange} value={prisonFilter}>
                        <option value="">All Prisons</option>
                        <option value="Folsom">Folsom</option>
                        <option value="San Quentin">San Quentin</option>
                    </select>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>PLAYER NAME</th>
                            <th>PREFERRED PRISONS</th>
                            <th>REGISTRATION DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.length > 0 ? (
                            filteredPlayers.map((player, index) => (
                                <tr key={index}>
                                    <td>{`${player.given_name} ${player.family_name}`}</td>
                                    <td>{player.preferred_prisons.join(', ') || "Unknown"}</td>
                                    <td>{new Date(player.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No players found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewPlayers;
