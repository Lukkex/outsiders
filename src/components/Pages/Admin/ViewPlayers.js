import React, { useState, useEffect } from 'react';
import { getSubmittedForms } from '../../../services/formsApi';
import '../../Stylesheets/AdminDashboard.css';
import SiteHeader from '../../../utils/SiteHeader';

function ViewPlayers() {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            const allForms = await getSubmittedForms();
            const playerList = allForms.map(form => ({
                player: form.player,
                prison: form.prison,
                submissionDate: form.submittedAt
            }));
            setPlayers(playerList);
            setFilteredPlayers(playerList); 
        }
        fetchPlayers();
    }, []);

    const handleFilterChange = (event) => {
        const selectedPrison = event.target.value;
        setPrisonFilter(selectedPrison);

        if (selectedPrison === "") {
            setFilteredPlayers(players); 
        } else {
            setFilteredPlayers(players.filter(player => player.prison === selectedPrison));
        }
    };

    return (
        <div>
            <SiteHeader />
            <div className="admin-dashboard">
                <h1>View Players</h1>
                
                {/* Prison Filter Dropdown */}
                <div className="filters">
                    <select onChange={handleFilterChange} value={prisonFilter}>
                        <option value="">All Prisons</option>
                        <option value="Folsom State Prison">Folsom State Prison</option>
                        <option value="San Quentin State Prison">San Quentin State Prison</option>
                    </select>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Player Name</th>
                            <th>Prison</th>
                            <th>Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.length > 0 ? (
                            filteredPlayers.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.player}</td>
                                    <td>{player.prison}</td>
                                    <td>{new Date(player.submissionDate).toLocaleString()}</td>
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
