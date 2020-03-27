import React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {addMessage, createClub} from "../../state";

class CreateClub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clubName: "",
            schoolWebsite: ""
        };
        this.createClub = this.createClub.bind(this);
    }

    createClub() {
        if (this.state.schoolWebsite !== "" && this.state.clubName !== "") {
            this.props.createClub(this.state.clubName, this.state.schoolWebsite)
        } else {
            this.props.addMessage("error", "You have some blank fields.", "Please fill them in!")
        }
    }

    render() {
        return (
            <View>
                <Text style={{fontSize: 24}}>Create a club</Text>
                <TextInput onChangeText={text => this.setState({clubName: text})} textContentType="none"
                           placeholder="Club name"
                           style={{
                               padding: 10,
                               borderWidth: 1,
                               borderColor: "grey",
                               borderRadius: 3,
                               maxWidth: 300,
                               marginBottom: 5
                           }}/>
                <TextInput onChangeText={text => this.setState({schoolWebsite: text})} textContentType="URL"
                           placeholder="Affiliated website (this will be verified)"
                           style={{
                               padding: 10,
                               borderWidth: 1,
                               borderColor: "grey",
                               borderRadius: 3,
                               maxWidth: 300,
                               marginBottom: 5
                           }}/>
                <TouchableOpacity style={{backgroundColor: "lightgrey", padding: 10, maxWidth: 100, borderRadius: 3}}
                                  onPress={this.createClub}>
                    <Text>Create club</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect((state, ownProps) => {
    return {...ownProps}
}, {createClub, addMessage})(CreateClub);
