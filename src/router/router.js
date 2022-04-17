import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ChangePassword from "../components/changePassword";
import Dashboard from "../components/dashboard";
import Login from "../components/login";
import UserDashboard from "../components/User/userDashboard";

export default function AppRouter() {
    return (
        <Router>
            <div>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/changePassword" component={ChangePassword} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/userDashboard" component={UserDashboard} />
                    {/* <Route path="/webedit" component={s} /> */}


                </Switch>
            </div>
        </Router>
    );
}