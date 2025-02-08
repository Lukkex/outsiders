//UserSearch.js
/*
* Notes: - This page uses dummy data. it updates within itself and queries locally.
*        - Functions need updating for linked functionality
* TODO: - Link Backend!
*
*
*/
import React, { useState } from 'react';
import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
} from '@table-library/react-table-library/table';

//## temp data struture, use to identify what info we want to retrieve/display instead of all user data
const dummyUsers = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', location: 'Folsom', canAttend: true },
    { id: 2, firstName: 'Bob', lastName: 'Jones', location: 'San Quentin', canAttend: false },
    { id: 3, firstName: 'Smith', lastName: 'Jones', location: 'San Quentin', canAttend: true },
    { id: 4, firstName: 'Jane', lastName: 'Smith', location: 'Folsom', canAttend: false },
  ];

const UserSearch = () => {
    //variables
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState(dummyUsers); //import user data here
    
    //filter logic
    const filteredUsers = users.filter((user) => //change to query backend for only matching users instead of parsing local data
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //Table data format
    const data = {nodes: filteredUsers};

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    //## Needs adjustment for backent querying and updating
    const handleRSVPChange = (userId) => {
        setUsers((prevUsers) => 
            prevUsers.map((user) =>
                user.id === userId ? { ...user, canAttend: !user.canAttend } : user
            )
        );
    };

    return (
    <div>
    <h2>User Search & RSVP Management</h2>
        <div>
            <label htmlFor="search">Search User by Name: </label>
            <input //searchbar. Queries first/last/both
            type="text"
            name="search"
            placeholder="search"
            value={searchQuery}
            onChange={handleChange}
            />
        </div>
      
        <Table data={data}>
            {(tableList) => (
                <>
                <Header>
                    <HeaderRow>
                        <HeaderCell>First Name</HeaderCell>
                        <HeaderCell>Last Name</HeaderCell>
                        <HeaderCell>Location</HeaderCell>
                        <HeaderCell>RSVP</HeaderCell>
                    </HeaderRow>
                </Header>

                <Body>
                    {tableList.map((item) => (
                        <Row key={item.id} item={item}>
                            <Cell>{item.firstName}</Cell>
                            <Cell>{item.lastName}</Cell>
                            <Cell>{item.location}</Cell>
                            <Cell>
                                <input
                                type="checkbox"
                                checked={item.canAttend}
                                />
                                <button onClick={() => handleRSVPChange(item.id)}>
                                    {item.canAttend ? "-Cancel RSVP" : "-RSVP"}
                                </button>
                            </Cell>
                        </Row>
                    ))}
                </Body>
                </>
            )}
        </Table>
    </div>
    );
};

export default UserSearch;