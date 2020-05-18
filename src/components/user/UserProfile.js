import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Page404 from "../FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState({});
  const [firstName, setFirstName] = useState({});
  const [lastName, setLastName] = useState({});
  let id = "";
  useEffect(() => {
    async function fetch() {
      let person = await axios.get("/api/user/detail");
      setProfile(person.data);
    }
    fetch();
  }, []);

  const changeFirstName = (e) => {
    setFirstName(e.target.value);
    e.preventDefault();
  };
  const changeLastName = (e) => {
    setLastName(e.target.value);
    e.preventDefault();
  };
  const submitNameChange = async () => {
    profile.firstName = firstName;
    profile.lastName = lastName;
    let person = await axios.put("/api/user/update", profile); 
    setProfile(person);
  };
  if (!profile) return <Page404></Page404>;

  return (
    <div className="row justify-content-center">
      <Form className="col-sm-8 col-md-8 col-lg-8 counselor-form" onSubmit={submitNameChange}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control disabled type="email" placeholder={profile.email} />
          <Form.Text className="text-muted">
            You can't change your email here.
          </Form.Text>

          <Form.Label>Public Key</Form.Label>
          <Form.Control disabled type="text" placeholder={profile.publicKey} />

          <Form.Label>Canvas User ID</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder={profile.canvasUserId}
          />

          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder={profile.firstName}
            onChange={changeFirstName}
          />

          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder={profile.lastName}
            onChange={changeLastName}
          />

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {profile &&
                profile.published &&
                profile.published.map((reward, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        Article ID: {reward.articleId} reward :{reward.cost}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Purchased</th>
              </tr>
            </thead>
            <tbody>
              {profile &&
                profile.purchased &&
                profile.purchased.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        Article ID: {item.articleId} reward :{item.cost}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>

          <Button variant="primary" type="submit">
            Change Name
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
export default UserProfile;
