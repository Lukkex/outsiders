//UserSearch.js
/*
* Notes: - This page uses dummy data. it updates within itself and queries locally.
*        - Functions need updating for linked functionality
* TODO: - Link Backend!
*       - react table tree
* KEY - ## = todo target
*     - ##### = broad label
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
import { usePagination } from "@table-library/react-table-library/pagination";
import { useTree } from '@table-library/react-table-library/tree';
import styles from '../../Stylesheets/Scheduling.module.css';

//## temp data struture, use to identify what info we want to retrieve/display instead of all user data
const dummyUsers = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', nodes: [
        {title: 'test1', location: 'Folsom', date: '2/14/2025', time: '10:00 AM', canAttend: true },
        {title: 'test2', location: 'San Quentin', date: '2/24/2025', time: '11:00 AM', canAttend: true }
    ],},
    { id: 2, firstName: 'Bob', lastName: 'Jones', nodes: [
        {title: 'test1', location: 'Folsom', date: '', time: '', canAttend: true },
        {title: 'test2', location: 'Folsom', date: '', time: '', canAttend: true }
    ],},
    { id: 3, firstName: 'Smith', lastName: 'Jones', nodes: [
        {title: 'test1', location: 'Folsom', date: '', time: '', canAttend: true },
        {title: 'test2', location: 'Folsom', date: '', time: '', canAttend: true }
    ],},
    { id: 4, firstName: 'Jane', lastName: 'Smith', nodes: [
        {title: 'test1', location: 'Folsom', date: '', time: '', canAttend: true },
        {title: 'test2', location: 'Folsom', date: '', time: '', canAttend: true }
    ],},
  ];

const UserSearch = () => {
    //##### variables
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState(dummyUsers); //import user data here
    const PAGELIMIT = 10;

    // filter search logic
    const filteredUsers = users.filter((user) => //change to query backend for only matching users instead of parsing local data
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //##### Table variables
    const data = {nodes: filteredUsers};
    const tree = useTree(data, {
        onChange: onTreeChange,
    });

    //##### functions

    //currently just logs
    function onTreeChange(action, state) {
        console.log(action, state);
    }

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

    //##### table features

    const pagination = usePagination(data, {
          state: {
            page: 0,
            size: PAGELIMIT,
          },
          //onChange: onPaginationChange,
        });
    
    /* ##later implement this to 'get pages' from the table as they are needed
    function onPaginationChange(action, state) {
    doGet({
        offset: state.page * PAGELIMIT,
        limit: PAGELIMIT,
    });
    } */

    return (
    <div>
        <h2>User Search & RSVP Management</h2>
        <div className={styles.tableContainer}>
            <h2>User List</h2>
            <label htmlFor="search">Search User by Name: </label>
            <input //searchbar. Queries first/last/both
            type="text"
            name="search"
            placeholder="search"
            value={searchQuery}
            onChange={handleChange}
            />
            <Table className={styles.reactTable} data={data} pagination={pagination} tree={tree}>
                {(tableList) => (
                    <>
                    <Header className={styles.header}>
                        <HeaderRow className={styles.headerRow}>
                            <HeaderCell resize className={styles.headerCell}>First Name</HeaderCell>
                            <HeaderCell resize className={styles.headerCell}>Last Name</HeaderCell>
                            <HeaderCell resize className={styles.headerCell}>Event</HeaderCell>
                            <HeaderCell resize className={styles.headerCell}>Location</HeaderCell>
                            <HeaderCell resize className={styles.headerCell}>Date & Time</HeaderCell>
                            <HeaderCell resize className={styles.headerCell}>RSVP</HeaderCell>
                        </HeaderRow>
                    </Header>

                    <Body>
                        {tableList.map((item) => (
                            <Row key={item.id} item={item}>
                                <Cell className={styles.cell}>{item.firstName}</Cell>
                                <Cell className={styles.cell}>{item.lastName}</Cell>
                                <Cell className={styles.cell}>{item.title}</Cell>
                                <Cell className={styles.cell}>{item.location}</Cell>
                                {(item.date || item.time) && (
                                    <Cell className={styles.cell}>{item.date}, {item.time}</Cell>
                                ) || (
                                    <Cell className={styles.cell}></Cell>
                                )}
                                <Cell className={styles.cell}>
                                    <input
                                    type="checkbox"
                                    checked={item.canAttend}
                                    />
                                    <button onClick={() => handleRSVPChange(item.id)}>
                                        {item.canAttend ? " -Cancel RSVP" : " -RSVP"}
                                    </button>
                                </Cell>
                            </Row>
                        ))}
                    </Body>
                    </>
                )}
            </Table>
            Page:{' '}
            {pagination.state.getPages(data.nodes).map((_, index) => (
            <button
                key={index}
                type="button"
                style={{
                fontWeight: pagination.state.page === index ? 'bold' : 'normal',}}
                onClick={() => pagination.fns.onSetPage(index)}
            >
                {index + 1}
            </button>
          ))}
        </div>
    </div>
    );
};

export default UserSearch;