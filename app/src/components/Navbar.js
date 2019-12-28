import React from 'react';
import {Link} from "react-router-dom";
import {auth} from "../sync";
import {appState} from "../sync/models";
import {observer} from "mobx-react";
import {Pane} from "evergreen-ui";


const AuthComponent = observer(class AuthComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (appState.user) {
            return <>
                <div className='navbar-item'>
                    <Link to='/profile'>Profile</Link>
                </div>
                <div className='navbar-item'>
                    <a href='#' onClick={(event) => {
                        event.preventDefault();
                        auth.signOut()
                            .then();
                    }}>Logout</a>
                </div>
            </>

        } else {
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
            <Pane background="#234361" margin='10px' padding='10px'>
                <div className="navbar-item">
                    <Link to='/'>Home</Link>
                </div>
                <div className="navbar-item">
                    <Link
                        to={'/calendar/' + currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1)}>Calendar</Link>
                </div>
                <AuthComponent/>
            </Pane>
        </>

    }
}

export {Navbar}
