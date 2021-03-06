import React, {useContext} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {isLoggedIn} from "../auth/LoginValidator";
import "../../sass/styles.css";

const Navigation = () => {
    const {currentUser} = useContext(AuthContext);
    return (
        <div>
            {isLoggedIn() ? <UserNavigation user={currentUser}/> : <GuestNavigation/>}
        </div>
    )
}

const UserNavigation = ({user}) => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                Counselor
            </Navbar.Brand>
                <Nav className="justify-content-end">
                <NavDropdown title="Article" id="nav-dropdown">
                    <NavDropdown.Item href="/articles/new">New Article</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item href="/articles/all">Library</NavDropdown.Item>
                    <NavDropdown.Item href="/articles/recommendations">Recommendations</NavDropdown.Item>
                </NavDropdown>
                <Nav.Item>
                    <Nav.Link href="/courses" title="Courses">Courses</Nav.Link>
                </Nav.Item>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
                <NavDropdown title={user ? `${user.firstName} ${user.lastName}` : ""} id="nav-dropdown">
                    <NavDropdown.Item href="/user/account">Account</NavDropdown.Item>
                    <NavDropdown.Item href="/user/wallet">Wallet</NavDropdown.Item>
                    <NavDropdown.Item href="/user/transactions">Transactions</NavDropdown.Item>
                    <NavDropdown.Item href="/user/sessions">Sessions</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
        </Navbar>
    );
};

const GuestNavigation = () => {
    return (<div className="nav-bar">
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    Counselor
                </Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Item>
                        <Nav.Link href="/signup" title="Signup">Sign Up</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/signin" title="Signin">Sign In</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        </div>
    );
}

export default Navigation;