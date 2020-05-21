import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { receiveJWT } from "../state/";
import axios from "axios";
import { backendURL } from "../constants";
import { addCredentials, addMessage } from "../state";
import { Redirect } from "../routing/routing"

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
        axios.post(`${backendURL}/auth/login`, { identifier: this.state.identifier, password: this.state.password })
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "data") {
                    this.props.receiveJWT(json["data"]["token"]);
                    this.props.addCredentials(this.state.identifier, this.state.password);
                    this.setState({
                        redirect: "/"
                    })
                }
                else {
                    this.props.addMessage(json["type"], json["message"], json["suggestion"])
                }

            })
            .catch((e) => {
                this.props.addMessage("Error", "We encountered an unexpected error.", `${e}`)
            })
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />;
        return (
            <View>
                <Text style={{ fontSize: 24, marginBottom: 5 }}>Login</Text>
                <TextInput onChangeText={text => this.setState({ identifier: text })} textContentType="username"
                    placeholder="Username: "
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "grey",
                        borderRadius: 3,
                        maxWidth: 300,
                        marginBottom: 5
                    }} />
                <TextInput onChangeText={text => this.setState({ password: text })} secureTextEntry={true}
                    textContentType="password" placeholder="Password: "
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "grey",
                        borderRadius: 3,
                        maxWidth: 300,
                        marginBottom: 5
                    }} />
                <TouchableOpacity style={{ backgroundColor: "lightgrey", padding: 10, maxWidth: 60, borderRadius: 3 }}
                    onPress={this.login}>
                    <Text>Login</Text>
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
}, { receiveJWT, addCredentials, addMessage })(Login)
