import React from "react";
import {Button, Text, TextInput, View} from "react-native";
import axios from "axios";
import {backendURL} from "../constants";
import {connect} from "react-redux";
import {Redirect} from "../routing/routing";
import {validEmail} from "../helpers";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        };
        this.register = this.register.bind(this);
    }

    register() {
        if (!validEmail(this.state.email))
            this.props.addMessage("error", "That email isn't valid.", "Check your spelling and try again.");
        if (!(this.state.password === this.state.passwordConfirmation))
            this.props.addMessage("error", "Your passwords don't match", "Try re-entering them.");
        else
            axios.post(`${backendURL}/auth/register`, {
                name: this.state.name,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                redirect: null
            })
                .then(result => result.json)
                .then(json => {
                    if (json["type"] === "success") {
                        this.props.addMessage(json["type"], json["message"], json["suggestion"])
                    }
                })
    }

    render() {
        if (this.auth.jwt)
            return <Redirect to="/"/>;
        return (
            <View>
                <Text>Register</Text>
                <TextInput placeholder="Name" onTextChange={value => this.setState({name: value})}/>
                <TextInput placeholder="Username" onTextChange={value => this.setState({username: value})}/>
                <TextInput placeholder="Email" onTextChange={value => this.setState({email: value})}/>
                <TextInput placeholder="Password" onTextChange={value => this.setState({password: value})}/>
                <TextInput placeholder="Password confirmation"
                           onTextChange={value => this.setState({passwordConfirmation: value})}/>
                <Button title="Register" onPress={this.register}/>
            </View>
        );
    }

}

export default connect((state, ownProps) => {
    return {
        auth: state.auth,
        ...ownProps
    }
})(Register);
