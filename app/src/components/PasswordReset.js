import React from 'react';
import {Button, TextInput, Label, Card, minorScale} from "evergreen-ui";
import {firebase} from "../sync";

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputDetails: false,
            email: '',
            thankYou: false
        }
    }

    render() {
        if (this.state.thankYou)
            return <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)}><p>
                Your password reset email has been sent. Please make sure you are logging in using your email address
                (not your name).
            </p>
            </Card>;


        if (this.state.inputDetails)
            return <>
                <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)}
                      margin={minorScale(3)}>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        firebase.auth().sendPasswordResetEmail(this.state.email);
                        this.setState({
                            thankYou: true
                        })
                    }}>
                        <Label>Email: </Label>
                        <TextInput type="email" value={this.state.email} onChange={event => {
                            this.setState({
                                email: event.target.value,
                            })
                        }}/>
                        <br/>
                        <Button marginTop={minorScale(3)} intent="success">Send password reset email.</Button>
                    </form>
                </Card>
            </>;
        else
            return <>
                <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)}
                      margin={minorScale(3)}>
                    <Button onClick={(event) => {
                        event.preventDefault();
                        this.setState({
                            inputDetails: true
                        })
                    }
                    }>Forgot password?</Button>
                </Card>
            </>
    }
}

export {PasswordReset}