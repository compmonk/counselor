import React, {useState} from 'react';
import '../sass/App.css';
import '../sass/styles.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";


import {AuthProvider} from "./auth/AuthProvider";
import ArticlesContainer from "./article/ArticlesContainer";
import RecommendationContainer from "./article/RecommendationContainer";
import FourZeroFour from "./FourZeroFour";
import UserSession from "./user/UserSession";
import UserProfile from "./user/UserProfile";
import PurchasedArticles from "./article/PurchasedArticles";
import UserWallet from "./user/UserWallet";
import SignUp from "./user/SignUp";
import SignIn from "./user/SignIn";
import NewArticle from "./article/NewArticle";
import Navigation from "./Navigation";
import Home from "./Home";
import CoursesContainer from "./course/CoursesContainer";

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
                    <Route exact path="/articles">
                        <ArticlesContainer/>
                    </Route>
                    <Route exact path="/articles/recommendations">
                        <RecommendationContainer/>
                    </Route>
                    <Route path="/user/account">
                        <UserProfile/>
                    </Route>
                    <Route path="/user/wallet">
                        <UserWallet/>
                    </Route>
                    <Route path="/user/sessions">
                        <UserSession/>
                    </Route>
                    <Route path="/user/transaction">
                        <UserProfile/>
                    </Route>
                    <Route path="/courses">
                        <CoursesContainer/>
                    </Route>
                    <Route path="/articles/all">
                        <PurchasedArticles />
                    </Route>
                    <Route path="/articles/new">
                        <NewArticle/>
                    </Route>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
