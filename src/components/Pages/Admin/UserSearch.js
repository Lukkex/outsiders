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
import { useTree, TreeExpandClickTypes, CellTree} from '@table-library/react-table-library/tree';
import styles from '../../Stylesheets/Scheduling.module.css';

//## dummy user info
const userInfo = [
    { id: 1, firstName: "Alice", lastName: "Smith" },
    { id: 2, firstName: "Bob", lastName: "Jones" },
    { id: 3, firstName: "Jane", lastName: "Doe" },
];

//## dummy event info
const events = [
    { id: 101, title: "Event A", location: "Folsom", date: "2/14/2025", time: "10:00 AM" },
    { id: 102, title: "Event B", location: "San Quentin", date: "2/24/2025", time: "11:00 AM" },
];

//## dummy userEvent table array
const userEvent = [
    { userId: 1, eventId: 101, canAttend: true },
    { userId: 1, eventId: 102, canAttend: false },
    { userId: 2, eventId: 101, canAttend: true },
    { userId: 3, eventId: 102, canAttend: true },
];

//## build one big array from all imported data because react tables are a dumb bitch and want it that way
const constructArray = (userInfo, events, attendance) => {
    return userInfo.map(user => ({...user,
        nodes: events.map(event => {
            // Find attendance record for this user-event pair
            const userEvent = attendance.find(a => a.userId === user.id && a.eventId === event.id) || {};
            return {...event,
                canAttend: userEvent.canAttend ?? false // Default to false if no record exists
            };
        })
    }));
};

const UserSearch = () => {
    //##### variables
    const [searchQuery, setSearchQuery] = useState("");
    const constructedArray = constructArray(userInfo
    , events, userEvent);
    const [users, setUsers] = useState(constructedArray); //import user data here
    const PAGELIMIT = 10;

    // filter search logic
    const filteredUsers = users.filter((user) => //change to query backend for only matching users instead of parsing local data
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //##### Table variables
    const data = {nodes: filteredUsers};
    const tree = useTree(data, {
        onChange: onTreeChange,
    },
    {
        clickType: TreeExpandClickTypes.ButtonClick,
    }
    );

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
            prevUsers.map((user) => ({
                ...user,
                nodes: user.nodes.map((node) => 
                    node.id === userId ? { ...node, canAttend: !node.canAttend } : node
                )
            }))
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
        <div className={styles.tableContainer}>
            <label htmlFor="search">Search User by Name: </label>
            <input //searchbar. Queries first/last/both
            type="text"
            name="search"
            placeholder="search"
            value={searchQuery}
            onChange={handleChange}
            className={styles.searchInput}
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
                            <Row className={styles.body} key={item.id} item={item}>
                                {(item.firstName) && (
                                    <CellTree item={item} className={styles.cell}>{item.firstName}</CellTree>
                                ) || (
                                    <Cell className={styles.cell}> - </Cell>
                                )}

                                {(item.lastName) && (
                                    <Cell className={styles.cell}>{item.lastName}</Cell>
                                ) || (
                                    <Cell className={styles.cell}> - </Cell>
                                )}
                                
                                {(item.title) && (
                                    <Cell className={styles.cell}>{item.title}</Cell>
                                ) || (
                                    <Cell className={styles.cell}> - </Cell>
                                )}

                                {(item.title) && (
                                    <Cell className={styles.cell}>{item.location}</Cell>
                                ) || (
                                    <Cell className={styles.cell}> - </Cell>
                                )}
                                
                                {(item.date || item.time) && (
                                    <Cell className={styles.cell}>{item.date}, {item.time}</Cell>
                                ) || (
                                    <Cell className={styles.cell}> - </Cell>
                                )}

                                {!(item.nodes) && (
                                <Cell className={styles.cell}>
                                    <input type="checkbox" checked={item.canAttend}/>
                                    <button onClick={() => handleRSVPChange(item.id)}>-edit</button>
                                </Cell>
                                ) || (
                                    <Cell className={styles.cell}> - </Cell>
                                )}
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