import React, {useContext} from "react";
import {AuthContext} from "./auth/AuthContext";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";

const Navigation = () => {
    const {currentUser} = useContext(AuthContext);
    return (
        <div>
            {currentUser ? <UserNavigation/> : <GuestNavigation/>}
        </div>
    )
}

const UserNavigation = () => {
    return (<div className="nav-bar">
            <Navbar bg="light">
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
                    <NavDropdown title="Profile" id="nav-dropdown">
                        <NavDropdown.Item href="/user/account">Account</NavDropdown.Item>
                        <NavDropdown.Item href="/user/wallet">Wallet</NavDropdown.Item>
                        <NavDropdown.Item href="/user/transactions">Transactions</NavDropdown.Item>
                        <NavDropdown.Item href="/user/sessions">Sessions</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Item>
                        <Nav.Link href="/courses" title="Courses">Courses</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        </div>
    );
};

const GuestNavigation = () => {
    return (<div className="nav-bar">
            <Navbar bg="light">
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