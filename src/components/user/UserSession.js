import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import axios from "axios";

function UserSession() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const sessions = await axios.get("/api/user/sessions");
            console.log("session data-->", sessions, typeof (sessions.data));
            setSessions(sessions.data);
        }

        fetchData();
    }, []);

    return (
        <div className="container">
            <Table striped bordered hover className="counselor-table">
                <thead>
                <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Active</th>
                    <th>Expiration Time</th>
                </tr>
                </thead>
                <tbody>
                {sessions && sessions.map((session, index) => (
                    <tr key={index}>
                        <td>{session.startTime}</td>
                        <td>{session.endTime ? session.endTime : "NA"}</td>
                        <td>{session.isActive ? "true" : "false"}</td>
                        <td>{session.expirationTime}</td>
                    </tr>
                )) || "No Data"}
                </tbody>
            </Table>
        </div>
    );
}

export default UserSession;
