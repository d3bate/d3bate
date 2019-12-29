import React from 'react';
import {auth} from '../sync';
import {Redirect} from "react-router-dom";
import {TextInput, minorScale, Card, Button} from "evergreen-ui";


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
                resultingUserObject.user.sendEmailVerification()
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
            <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)} margin={minorScale(3)}>
                <h5>
                    Register
                </h5>
                <form onSubmit={this.registerUser}>
                    <TextInput type='text' value={this.state.name} onChange={(event) => {
                        this.setState({name: event.target.value})
                    }} placeholder="Name: " margin={minorScale(3)} height={minorScale(10)}/>
                    <br/>
                    <TextInput type='text' value={this.state.email} onChange={(event) => {
                        this.setState({email: event.target.value})
                    }} placeholder="Email: " margin={minorScale(3)} height={minorScale(10)}/>
                    <br/>
                    <TextInput type='password' value={this.state.password} onChange={(event) => {
                        this.setState({password: event.target.value})
                    }} placeholder="Password: " margin={minorScale(3)} height={minorScale(10)}/>
                    <br/>
                    <Button height={minorScale(10)} margin={minorScale(3)} iconAfter="arrow-right">
                        Register
                    </Button>
                </form>
            </Card>
        </>
    }
}

export {Register}