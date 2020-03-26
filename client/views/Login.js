import React from "react";
import {Button, Text, TextInput, View} from "react-native";
import {connect} from "react-redux";
import {receiveJWT} from "../state/";
import axios from "axios";
import {backendURL} from "../constants";
import {addCredentials, addMessage} from "../state";
import {Redirect} from "../routing/routing"

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identifier: "",
            password: "",
            redirect: null
        };
        this.login = this.login.bind(this);
    }

    login() {
        axios.post(`${backendURL}/auth/login`, {identifier: this.state.identifier, password: this.state.password})
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "data") {
                    this.receiveJWT(json["data"]["token"]);
                    this.addCredentials(this.state.identifier, this.state.password)
                }
                else {
                    this.addMessage(json["type"], json["message"], json["suggestion"])
                }

            })
            .catch(() => {
                this.addMessage("Error", "We encountered an unexpected error.", "This error has been logged.")
            })
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect}/>;
        return (
            <View>
                <Text>Login</Text>
                <TextInput onChangeText={text => this.setState({identifier: text})} textContentType="username"
                           placeholder="Username: "/>
                <TextInput onChangeText={text => this.setState({password: text})} secureTextEntry={true}
                           textContentType="password" placeholder="Password: "/>
                <Button title="Login" onPress={this.login}/>
            </View>
        );
    }
}

export default connect((state, ownProps) => {
    return {
        auth: state.auth,
        ...ownProps
    }
}, {receiveJWT, addCredentials, addMessage})(Login)
