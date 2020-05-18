import React, {useState} from 'react'
import Home from "../others/Home";
import Loading from "../others/Loading"

function SignOut({signout}) {
    const [isLoading, setIsLoading] = useState(true)

    if (isLoading) {
        signout().then((response) => {
            window.location.href = "/";
            setIsLoading(false)
            return <Home/>
        })
        return <Loading/>
    }
}

export default SignOut;
