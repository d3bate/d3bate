import React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {Redirect} from "../../routing/routing";
import {connect} from "react-redux";
import {sendJoinClub} from "../../state";
import CustomButton from "../../styles/CustomButton";

class JoinClub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinCode: ""
        };
        this.joinClub = this.joinClub.bind(this);
    }

    joinClub() {
        this.props.sendJoinClub(this.state.joinCode);
    }

    render() {
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
                <CustomButton title="Join club" onPress={this.joinClub}/>
            </View>
        );
    }
}

export default connect((state, ownProps) => {
    return ownProps
}, {sendJoinClub})(JoinClub);
