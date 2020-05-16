import React, {useEffect, useState} from "react";
import axios from 'axios'

function UserProfile() {
    const [user, setUser] = useState({})
    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get("https://api.github.com/users/compmonk")
            setUser(data)
        }
        fetchData();
    },[])

    return (
        <div>
            {user.login}
            <br/>
            {user.location}
            <br/>
            {user.bio}
        </div>
    )
}

export default UserProfile;