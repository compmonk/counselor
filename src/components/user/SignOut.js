import React from 'react'
import Home from "../Home";

function SignOut({signout}) {
    signout().then((response) => {
        window.location.href = "/";
        return <Home/>
    })
}

export default SignOut;
