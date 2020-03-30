import React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {Redirect} from "../../routing/routing";
import {connect} from "react-redux";
import {sendJoinClub} from "../../state";

class JoinClub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinCode: ""
        };
        this.joinClub = this.joinClub.bind(this);
    }

    joinClub() {
        this.props.sendJoinClub(this.state.joinCode)
    }

    render() {
        if (!this.props.auth.jwt)
            return <Redirect to="/login"/>;
        return (
            <View>
                <Text style={{fontSize: 24, marginBottom: 5}}>Join a club</Text>
                <TextInput onChangeText={text => this.setState({joinCode: text})} textContentType="none"
                           placeholder="Join code: "
                           style={{
                               padding: 10,
                               borderWidth: 1,
                               borderColor: "grey",
                               borderRadius: 3,
                               maxWidth: 300,
                               marginBottom: 5
                           }}/>
                <TouchableOpacity style={{backgroundColor: "lightgrey", padding: 10, maxWidth: 60, borderRadius: 3}}
                                  onPress={this.joinClub}>
                    <Text>Join club</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect((state, ownProps) => {
    return ownProps
}, {sendJoinClub})(JoinClub);
