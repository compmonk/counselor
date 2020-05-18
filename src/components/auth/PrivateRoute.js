import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AuthContext} from './AuthContext';
import SignIn from "../user/SignIn";

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {currentUser} = useContext(AuthContext);

    console.log("Private Route")
    console.log(currentUser)
    return (
        <Route
            {...rest}
            render={(routeProps) => {console.log("in Route");return !!(currentUser) ? <RouteComponent {...routeProps} /> : <SignIn/>}}
        />
    );
};

export default PrivateRoute;