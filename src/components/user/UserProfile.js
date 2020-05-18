import React from "react";
import { useState, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import { AuthContext } from "../auth/AuthContext";
import "../../sass/App.css";
import axios from "axios";

function UserProfile() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const changeFirstName = (e) => {
    setFirstName(e.target.value);
    e.preventDefault();
  };
  const changeLastName = (e) => {
    setLastName(e.target.value);
    e.preventDefault();
  };
  const submitNameChange = async () => {
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    let person = await axios.put("/api/user/update", currentUser);
    setCurrentUser(person);
  };
  if (!currentUser) return <Page404></Page404>;

  return (
    <div className="row justify-content-center">
      <Form
        className="col-sm-8 col-md-8 col-lg-8 counselor-form"
        onSubmit={submitNameChange}
      >
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder={currentUser.firstName}
          onChange={changeFirstName}
        />

        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder={currentUser.lastName}
          onChange={changeLastName}
        />

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control disabled type="email" placeholder={currentUser.email} />
          <Form.Text className="text-muted">
            You can't change your email here.
          </Form.Text>

          <Form.Label>Stellar Public Key</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder={currentUser.publicKey}
          />

          <Form.Label>Canvas User ID</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder={currentUser.canvasUserId}
          />

          <Form.Label>Total Purchased</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder={
              currentUser.purchased
                ? currentUser.purchased.length
                : "No Articles"
            }
          />
          <Form.Label>Total Published</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder={
              currentUser.published
                ? currentUser.published.length
                : "No Articles"
            }
          />
          <br/>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
export default UserProfile;
