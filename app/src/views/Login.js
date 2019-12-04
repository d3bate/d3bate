import React from 'react';
import {Redirect} from "react-router-dom";
import {auth} from "../sync";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirect: false
        };
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser(event) {
        event.preventDefault();
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((newUser) => {
                this.setState({redirect: true})
            });
    }

    render() {
        if (JSON.parse(localStorage.getItem('user')) || this.state.redirect) {
            return <Redirect to='/'/>
        }
        return <>
            <div className='authForm'>
                <h1>Login</h1>
                <form onSubmit={this.loginUser}>
                    <input className="authInput" type='text' value={this.state.email} onChange={(event) => {
                        this.setState({email: event.target.value})
                    }} placeholder="Email: "/>
                    <br/>
                    <input className="authInput" type='password' value={this.state.password} onChange={(event) => {
                        this.setState({password: event.target.value})
                    }} placeholder="Password: "/>
                    <br/>
                    <input type="submit" className="authSubmit"/>
                </form>
            </div>
        </>
    }
}

export {Login}
