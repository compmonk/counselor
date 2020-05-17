import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

function UserSession() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const sessions  = await axios.get("/api/user/sessions");
      console.log("session data-->", sessions, typeof (sessions.data));
      setSessions(sessions);
    }
    fetchData();
  }, []);

  console.log(sessions);
  return (
    <div className="container">
      <Table striped bordered hover>
        <thead>
          <tr><td>Start Time</td>
          <td>End Time</td>
          <td>Active</td></tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr>
              <td>{session.startTime}</td>
              <td>{session.endTime}</td>
              <td>{session.isActive}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserSession;
