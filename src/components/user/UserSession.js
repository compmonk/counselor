import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import axios from 'axios'

function UserSession() {
    const [sessions, setSessions] = useState([])

    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get("/data")
            setSessions(data)
        }
        fetchData();
    }, [])

    console.log(sessions)
    return (
        <div className="container">
            <Table striped bordered hover>
                <thead>
                <th>
                    <td>
                        Start Time
                    </td>
                    <td>
                        End Time
                    </td>
                    <td>
                        Active
                    </td>
                </th>
                </thead>
                <tbody>
                {sessions.map((session) =>
                    (<tr>
                            <td>{session.startTime}</td>
                            <td>{session.endTime}</td>
                            <td>{session.isActive}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UserSession;