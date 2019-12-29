import React from 'react';
import './App.scss';
import './sabre/css/build.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Register} from "./views/Register";
import {Login} from "./views/Login";
import {Navbar} from "./components/Navbar";
import {Calendar} from "./views/Calendar";
import {EditCalendar} from "./views/EditCalendar";
import {Footer} from "./components/Footer";
import {Dashboard} from "./views/Dashboard";
import {Profile} from "./views/Profile";
import {TakeRegister} from "./views/TakeRegister";
import {Card} from "evergreen-ui";
import {AdminClubView} from "./views/club/AdminClubView";
import {ClubView} from "./views/club/ClubView";

function App() {
    return <>
        <Router>
            <div className='row-wrap'>
                <div className='col-25'>
                    <Card>
                        <Navbar/>
                    </Card>
                </div>
                <div className='col-75'>
                    <Switch>
                        <Route exact path='/'><Dashboard/></Route>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/register' component={Register}/>
                        <Route exact path='/profile' component={Profile}/>
                        <Route path='/calendar/:year/:month' render={(match) =>
                            <Calendar match={match}/>
                        }/>
                        <Route path='/edit/calendar/:year/:month' render={(match) =>
                            <EditCalendar match={match}/>
                        }/>
                        <Route path='/register/:id' render={(match) => <TakeRegister match={match}/>}/>
                        <Route exact path='/club' render={(match) => <ClubView/>}/>
                    </Switch>
                </div>
            </div>
            <Footer/>
        </Router>
    </>
}

export default App;

