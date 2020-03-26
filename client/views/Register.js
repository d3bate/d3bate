import React from "react";
import {Button, Text, TextInput, TouchableOpacity, View} from "react-native";
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
        if (this.props.auth.jwt)
            return <Redirect to="/"/>;
        return (
            <View>
                <Text style={{fontSize: 24, marginBottom: 5}}>Register</Text>
                <TextInput placeholder="Name" onTextChange={value => this.setState({name: value})} style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 3,
                    maxWidth: 300,
                    marginBottom: 5
                }}/>
                <TextInput placeholder="Username" onTextChange={value => this.setState({username: value})} style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 3,
                    maxWidth: 300,
                    marginBottom: 5
                }}/>
                <TextInput placeholder="Email" onTextChange={value => this.setState({email: value})} style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 3,
                    maxWidth: 300,
                    marginBottom: 5
                }}/>
                <TextInput placeholder="Password" onTextChange={value => this.setState({password: value})} style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 3,
                    maxWidth: 300,
                    marginBottom: 5
                }}/>
                <TextInput placeholder="Password confirmation"
                           onTextChange={value => this.setState({passwordConfirmation: value})} style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 3,
                    maxWidth: 300,
                    marginBottom: 5
                }}/>
                <TouchableOpacity style={{backgroundColor: "lightgrey", padding: 10, maxWidth: 75, borderRadius: 3}}
                                  onPress={this.register}>
                    <Text>Register</Text>
                </TouchableOpacity>
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
