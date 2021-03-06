import React, {useContext} from 'react'
import {Button, Col, Form} from "react-bootstrap";

import axios from 'axios';
import {AuthContext} from "../auth/AuthContext";
import {Redirect} from "react-router-dom";

function SignIn() {
    const {
        currentUser,
        setCurrentUser,
        cookies,
        setCookies
    } = useContext(AuthContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const {email, password} = e.target.elements;
        const user = {
            "email": email.value,
            "password": password.value,
        }
        const {data} = await axios.post("/api/root/login", user, {withCredentials: true, headers: cookies})
        setCurrentUser(data);
        setCookies(document.cookie)
    }

    if (currentUser) {
        return <Redirect to='/'/>;
    }


    return (
        <Form className="container-fluid col-sm-4 col-md-4 col-lg-4 counselor-form" onSubmit={onSubmit}>

            <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" placeholder="johndoe@example.com"/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="S3cR3t"/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default SignIn;
