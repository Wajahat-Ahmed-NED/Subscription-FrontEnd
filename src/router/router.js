import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ChangePassword from "../components/admin/changePassword";
import Dashboard from "../components/admin/dashboard";
import User from "../components/admin/user";
import Package from "../components/admin/package";
import Customer from "../components/admin/customer";
import Subscription from "../components/admin/subscription";
import Login from "../components/admin/login";
import UserDashboard from "../components/User/userDashboard";
import UserUpdateProfile from "../components/User/UserUpdateProfile";
import UserChangePassword from "../components/User/UserChangePassword";
import UpdateProfile from "../components/admin/updateProfile";
import ContactUs from "../components/admin/ContactUs";
import NotFound404 from "../components/admin/404";
import customer from '../components/User/customer'

export default function AppRouter() {
    return (
        <Router>
            <div>

                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/contact" component={ContactUs} />
                    <Route exact path="/changePassword" component={ChangePassword} />
                    <Route exact path="/userChangePassword" component={UserChangePassword} />
                    <Route exact path="/userUpdateProfile" component={UserUpdateProfile} />
                    <Route exact path="/updateProfile" component={UpdateProfile} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route exact path='/dashboard/user' component={Dashboard}></Route>
                    <Route exact path='/dashboard/package' component={Dashboard}></Route>
                    <Route exact path='/dashboard/subscription' component={Dashboard}></Route>
                    <Route exact path='/dashboard/customer' component={Dashboard}></Route>
                    <Route path="/userDashboard" component={UserDashboard} />
                    <Route exact path="/customer" component={UserDashboard} />
                    <Route path='/package' component={UserDashboard}></Route>
                    <Route path='/subscription' component={UserDashboard}></Route>
                    <Route path='/billing' component={UserDashboard}></Route>
                    <Route path="*" component={NotFound404} />

                </Switch>
            </div>
        </Router>
    );
}