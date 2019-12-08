import React from 'react';
import {Link} from "react-router-dom";
import {auth} from "../sync";
import {appState} from "../sync/models";
import {observer} from "mobx-react";


const AuthComponent = observer(class AuthComponent extends React.Component {
    constructor(props) {
        super(props);
        console.log(appState)
    }

    render() {
        if (appState.user) {
            return <>
                <div className='navbar-item'>
                    <Link to='/'>Profile (dead link)</Link>
                </div>
                <div className='navbar-item'>
                    <a href='#' onClick={(event) => {
                        event.preventDefault();
                        auth.signOut()
                            .then();
                    }}>Logout</a>
                </div>
            </>

        }
        else {
            return <>
                <div className='navbar-item'>
                    <Link to='/login'>Login</Link>
                </div>
                <div className='navbar-item'>
                    <Link to='/register'>Register</Link>
                </div>
            </>
        }
    }
});

class Navbar extends React.Component {
    render() {
        let currentDate = new Date();
        return <>
            <nav className="navbar">
                <div className="navbar-item">
                    <Link to='/'>Home</Link>
                </div>
                <div className="navbar-item">
                    <Link to={'/calendar/' + currentDate.getFullYear() + '/' + (currentDate.getMonth()+1)}>Calendar</Link>
                </div>
                <AuthComponent/>
            </nav>
        </>

    }
}

export {Navbar}
