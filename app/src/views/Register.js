import React from 'react';
import {auth} from '../sync';
import {Redirect} from "react-router-dom";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            redirect: false
        };

        this.registerUser = this.registerUser.bind(this);
    }


    registerUser(event) {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((resultingUserObject) => {
                resultingUserObject.user.updateProfile({
                    displayName: this.state.name
                })
                    .then(() => {

                    })
                    .catch(() => {

                    })
            })
            .catch(() => {

            });
        this.setState({redirect: true})
    }

    render() {
        if (JSON.parse(localStorage.getItem('user')) || this.state.redirect)
            return <Redirect to='/'/>;

        return <>
            <div className='authForm'>
                <h1 className="header-1">
                    Register
                </h1>
                <form onSubmit={this.registerUser}>
                    <input className="authInput" type='text' value={this.state.name} onChange={(event) => {
                        this.setState({name: event.target.value})
                    }} placeholder="Name: "/>
                    <br/>
                    <input className="authInput" type='text' value={this.state.email} onChange={(event) => {
                        this.setState({email: event.target.value})
                    }} placeholder="Email: "/>
                    <br/>
                    <input className="authInput" type='password' value={this.state.password} onChange={(event) => {
                        this.setState({password: event.target.value})
                    }} placeholder="Password: "/>
                    <input type="submit" className="authSubmit"/>
                </form>
            </div>
        </>
    }
}

export {Register}