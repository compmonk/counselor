import React from 'react';
import '../sass/App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {NavDropdown, Nav, Navbar} from 'react-bootstrap'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import ArticlesContainer from "./article/ArticlesContainer";
import RecommendationContainer from "./article/RecommendationContainer";
import FourZeroFour from "./FourZeroFour";
import UserSession from "./user/UserSession";
import UserProfile from "./user/UserProfile";

import UserWallet from "./user/UserWallet";

function App() {
  return (
      <Router>
        <div className="nav-bar">
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
        <Switch>
          <Route exact path="/articles">
            <ArticlesContainer/>
          </Route>
          <Route exact path="/articles/recommendations">
            <RecommendationContainer/>
          </Route>
          <Route path="*">
            <UserProfile/>
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
