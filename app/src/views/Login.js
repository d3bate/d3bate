import React from 'react';
import {Redirect} from "react-router-dom";
import {auth} from "../sync";
import {TextInput, minorScale, Card, Button} from "evergreen-ui";
import {PasswordReset} from "../components/PasswordReset";

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
            })
            .catch(error => {
                alert(error);
                alert(this.state.email);
            });
    }

    render() {
        if (JSON.parse(localStorage.getItem('user')) || this.state.redirect) {
            return <Redirect to='/'/>
        }
        return <>
            <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)} margin={minorScale(3)}>
                <h5>Login</h5>
                <form onSubmit={this.loginUser}>
                    <TextInput type='text' value={this.state.email} onChange={(event) => {
                        this.setState({email: event.target.value})
                    }} placeholder="Email: " margin={minorScale(3)} height={minorScale(10)}/>
                    <br/>
                    <TextInput type='password' value={this.state.password} onChange={(event) => {
                        this.setState({password: event.target.value})
                    }} placeholder="Password: " margin={minorScale(3)} height={minorScale(10)}/>
                    <br/>
                    <Button height={minorScale(10)} margin={minorScale(3)} iconAfter="arrow-right">
                        Login
                    </Button>
                </form>

            </Card>
            <PasswordReset/>
        </>
    }
}

export {Login}
