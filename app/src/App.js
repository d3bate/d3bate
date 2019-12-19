import React from 'react';
import './App.scss';

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


function App() {
    return <>
        <Router>
            <div className='columns'>
                <div className='col-4'>
                    <Navbar/>
                </div>
                <div className='col-8'>
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
                    </Switch>
                </div>
            </div>
            <Footer/>
        </Router>
    </>
}

export default App;

