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
import SignOut from "./user/SignOut";
import PrivateRoute from "./auth/PrivateRoute";
import UserTransactions from "./user/UserTransactions";

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
                    <PrivateRoute path="/logout">
                        <SignOut/>
                    </PrivateRoute>
                    <PrivateRoute exact path="/articles">
                        <ArticlesContainer/>
                    </PrivateRoute>
                    <PrivateRoute path="/articles/all">
                        <PurchasedArticles/>
                    </PrivateRoute>
                    <PrivateRoute path="/articles/new">
                        <NewArticle/>
                    </PrivateRoute>
                    <PrivateRoute exact path="/articles/recommendations">
                        <RecommendationContainer/>
                    </PrivateRoute>
                    <PrivateRoute path="/user/account">
                        <UserProfile/>
                    </PrivateRoute>
                    <PrivateRoute path="/user/wallet">
                        <UserWallet/>
                    </PrivateRoute>
                    <PrivateRoute path="/user/sessions">
                        <UserSession/>
                    </PrivateRoute>
                    <PrivateRoute path="/user/transactions">
                        <UserTransactions/>
                    </PrivateRoute>
                    <PrivateRoute path="/courses">
                        <CoursesContainer/>
                    </PrivateRoute>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
