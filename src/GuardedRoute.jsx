import React from 'react';
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        
        localStorage.getItem("Login") === "true"
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)

export default GuardedRoute;