import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Register} from "./views/Register";
import {Login} from "./views/Login";
import {Navbar} from "./components/Navbar";
import {Calendar, EditCalendar} from "./views/Calendar";


function App() {
    return <>
        <Router>
            <div className='columns'>
                <div className='navbar-column'>
                    <Navbar/>
                </div>
                <div className='content-column'>
                    <Switch>
                        <Route exact path='/'><h1>Hello!</h1></Route>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/register' component={Register}/>
                        <Route path='/calendar/:year/:month' render={(match) =>
                            <Calendar match={match}/>
                        }/>
                        <Route path='/edit/calendar/:year/:month' render={(match) =>
                            <EditCalendar match={match}/>
                        }/>
                    </Switch>
                </div>
            </div>

        </Router>
    </>
}

export default App;

