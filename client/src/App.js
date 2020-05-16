import React from "react"; 
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css';
import {Navbar, NavbarBrand} from "react-bootstrap";
import { useEffect, useState} from "react";
import Page404 from "./components/Page404";
import Recommend from "./components/Recommend"
import Profile from "./components/Profile";
import Wallet from "./components/Wallet";

function App() {
  
  useEffect(()=>{
  },[]);

  return (
    <div className="App">      
      <div className="App-body">
      <Router>
          <Navbar className="bg-dark justify-content-around">
            <NavbarBrand className="name"> Counselor </NavbarBrand>
            <Link className="btn" to="/"> Home </Link>
            <Link className="btn" to="/machines/page/0"> Article </Link>
            <Link className="btn" to="/api/user/recommendations"> Recommendation </Link>
            <Link className="btn" to="/api/user/wallet"> Wallet </Link>
            <Link className="btn" to="/pokemon/page/0"> Courses </Link>
            <Link className="btn" to="/api/user/:id"> Profile </Link>
            <Link className="btn" to="/pokemon/page/0"> Session </Link>
            <Link className="btn" to="/pokemon/page/0"> Logout </Link>
          </Navbar>

          <Switch>
          <Route exact path="/" component={Page404} />
          <Route exact path="/api/user/wallet" component={Wallet} />
          <Route exact path="/api/user/recommendations" component={Recommend} />
          <Route exact path="/api/user/:id" component={Profile} />
          <Route exact path="/pokemon/:id" component={Page404} />    
          <Route component={Page404}/>
          </Switch>

        </Router>
      </div>
    </div>
  );
}

export default App;
