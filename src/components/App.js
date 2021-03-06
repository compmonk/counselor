import React from 'react';
import '../sass/App.css';
import '../sass/styles.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";


import {AuthProvider} from "./auth/AuthProvider";
import RecommendationContainer from "./article/RecommendationContainer";
import UserSession from "./user/UserSession";
import UserProfile from "./user/UserProfile";
import PurchasedArticles from "./article/PurchasedArticles";
import UserWallet from "./user/UserWallet";
import SignUp from "./user/SignUp";
import SignIn from "./user/SignIn";
import NewArticle from "./article/NewArticle";
import Navigation from "./others/Navigation";
import Home from "./others/Home";
import CoursesContainer from "./course/CoursesContainer";
import SignOut from "./user/SignOut";
import UserTransactions from "./user/UserTransactions";
import {LoginValidator} from "./auth/LoginValidator";
import Article from "./article/Article";
import axios from "axios";

function App() {

    return (
        <AuthProvider>
            <Router>
                <Navigation/>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/signup">
                        <SignUp/>
                    </Route>
                    <Route path="/signin">
                        <SignIn/>
                    </Route>
                    <Route path="/logout">
                        <SignOut signout={() => (axios.get("/api/root/logout"))}/>
                    </Route>
                    <Route path="/articles/all">
                        <LoginValidator ChildComponent={PurchasedArticles}/>
                    </Route>
                    <Route path="/articles/new">
                        <LoginValidator ChildComponent={NewArticle}/>
                    </Route>
                    <Route exact path="/articles/recommendations">
                        <LoginValidator ChildComponent={RecommendationContainer}/>
                    </Route>
                    <Route path="/user/account">
                        <LoginValidator ChildComponent={UserProfile}/>
                    </Route>
                    <Route path="/user/wallet">
                        <LoginValidator ChildComponent={UserWallet}/>
                    </Route>
                    <Route path="/user/sessions">
                        <LoginValidator ChildComponent={UserSession}/>
                    </Route>
                    <Route path="/user/transactions">
                        <LoginValidator ChildComponent={UserTransactions}/>
                    </Route>
                    <Route path="/courses">
                        <LoginValidator ChildComponent={CoursesContainer}/>
                    </Route>
                    <Route path="/articles/:articleId">
                        <LoginValidator ChildComponent={Article}/>
                    </Route>
                    <Route path="*">
                        <Redirect to="/"/>
                    </Route>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
