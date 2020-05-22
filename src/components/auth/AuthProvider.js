import React, {useState, useEffect} from 'react';
import axios from 'axios';

import {AuthContext} from "./AuthContext";
import Loading from "../others/Loading";


export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [cookies, setCookies] = useState("");

    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get("/api/user/detail")
            setCurrentUser(data)
            setLoadingUser(true)
        }

        fetchData()
    }, []);

    if (loadingUser) {
        return <Loading/>;
    }

    return <AuthContext.Provider value={{
        currentUser,
        setCurrentUser,
        cookies,
        setCookies
    }}>{children}</AuthContext.Provider>;
};