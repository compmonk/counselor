import React from "react";
import {useContext} from "react";
import {Form, Button, Table, Col} from "react-bootstrap";
import {AuthContext} from "../auth/AuthContext";
import "../../sass/App.css";
import axios from "axios";
import FourZeroFour from "../others/FourZeroFour";

function UserProfile() {
    const {currentUser, setCurrentUser, cookies, setCookies} = useContext(AuthContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const {firstName, lastName} = e.target.elements;
        const user = {
            "firstName": firstName.value,
            "lastName": lastName.value
        }
        const {data} = await axios.put("/api/user/update", user, {withCredentials: true, headers: cookies})
        setCurrentUser(data);
        setCookies(document.cookie)
        window.location.href = "/"
    }


    if (!currentUser) {
        return <FourZeroFour/>;
    }

    return (
        <Form className="container col-sm-6 col-md-6 col-lg-6 counselor-form" onSubmit={onSubmit}>
            <Form.Group as={Col}>
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" defaultValue={currentUser.firstName} name="firstName"/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" defaultValue={currentUser.lastName} name="lastName"/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Email address</Form.Label>
                <Form.Control disabled type="email" defaultValue={currentUser.email}/>
                <Form.Text className="text-muted">
                    You can't change your email here.
                </Form.Text>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Stellar Public Key</Form.Label>
                <Form.Control disabled type="text" defaultValue={currentUser.publicKey}/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Canvas User ID</Form.Label>
                <Form.Control disabled type="text" defaultValue={currentUser.canvasUserId}/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Total Purchased</Form.Label>
                <Form.Control disabled type="text"
                              defaultValue={currentUser.purchased ? currentUser.purchased.length : "No Articles"}
                />
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Currency</Form.Label>
                <Form.Control disabled type="text" defaultValue={currentUser.currency}/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Total Published</Form.Label>
                <Form.Control disabled type="text"
                              defaultValue={currentUser.published ? currentUser.published.length : "No Articles"}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Update
            </Button>
        </Form>
    );
}

export default UserProfile;
