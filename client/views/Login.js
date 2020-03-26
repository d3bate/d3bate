import React from "react";
import {Button, Text, TextInput, View} from "react-native";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identifier: "",
            password: ""
        };
        this.login = this.login.bind(this);
    }

    login() {

    }

    render() {
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
