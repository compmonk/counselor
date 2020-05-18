import React, {useContext, useEffect, useState} from 'react'
import {Button, Col, Form} from "react-bootstrap";
import Select from 'react-select';

import axios from 'axios';
import {AuthContext} from "../auth/AuthContext";
import {Redirect} from "react-router-dom";

function SignUp() {
    const {
        currentUser,
        setCurrentUser,
        loadingUser,
        setLoadingUser,
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


    const signup = async (e) => {
        e.preventDefault();
        console.log(e.target.elements)
        const {firstName, lastName, email, password, currency} = e.target.elements;
        const user = {
            "firstName": firstName.value,
            "lastName": lastName.value,
            "email": email.value,
            "password": password.value,
            "currency": currency.value
        }
        const {data} = await axios.post("/api/root/signup", user, {withCredentials: true, headers: cookies})
        setCurrentUser(data);
        setCookies(document.cookie)
    }

    if (currentUser) {
        return <Redirect to='/'/>;
    }

    return (
        <Form className="container-fluid col-lg-6 counselor-form" onSubmit={signup}>

            <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="firstName" type="input" placeholder="John"/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="lastName" type="input" placeholder="Doe"/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" placeholder="johndoe@example.com"/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="S3cR3t"/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Currency</Form.Label>
                <Select name="currency" options={currencies}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default SignUp;
