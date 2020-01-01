import React from 'react';
import './App.scss';
import './build.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Register} from "./views/Register";
import {Login} from "./views/Login";
import {Navbar} from "./components/Navbar";
import {Calendar} from "./views/Calendar";
import {EditCalendar} from "./views/EditCalendar";
import {Footer} from "./components/Footer";
import {Dashboard} from "./views/Dashboard";
import {Profile} from "./views/Profile";
import {ClubView} from "./views/club/ClubView";
import {MessageBoard} from "./components/MessageBoard";

function App() {
    return <>
        <Router>
            <div className='row-wrap'>
                <div className='col-25'>
                    <Navbar/>
                </div>
                <div className='col-75'>
                    <MessageBoard/>
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
                        <Route exact path='/club' render={(match) => <ClubView/>}/>
                    </Switch>
                </div>
            </div>
            <Footer/>
        </Router>
    </>
}

export default App;

