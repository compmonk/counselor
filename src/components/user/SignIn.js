import React, {useContext, useEffect, useState} from 'react'
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
    const [currencies, setCurrencies] = useState([])

    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get("/api/root/currency")
            setCurrencies(data.map(opt => ({
                label: `${opt['currency']} (${opt['code']})`,
                value: opt['code']
            })));
        }

        fetchData();

        console.log(currencies);
    }, []);


    const signin = async (e) => {
        e.preventDefault();
        console.log(e.target.elements)
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
        <Form className="container-fluid col-lg-6 counselor-form" onSubmit={signin}>

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
