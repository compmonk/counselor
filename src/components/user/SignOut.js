import React, {useContext, useEffect, useState} from 'react'
import {Button, Col, Form} from "react-bootstrap";
import Select from 'react-select';

import axios from 'axios';
import {AuthContext} from "../auth/AuthContext";
import {Redirect} from "react-router-dom";
import Home from "../Home";

function SignOut() {
    const {currentUser, setCurrentUser, loadingUser, setLoadingUser, cookies, setCookies} = useContext(AuthContext);
    const [currencies, setCurrencies] = useState([])

    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get("/api/root/logout")
            fetchData()
        }

        fetchData();
        setCurrentUser(null)
        setCookies("")

    }, []);

    window.location.href ="/";
    return <Home/>
}

export default SignOut;
