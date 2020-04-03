import React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";

class ViewTrainingSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,

        }
    }

    render() {
        return this.state.edit ?
            <View>
                <Text>Start time: {new Date(this.props.trainingSession.start_time).toString()}</Text>
                <Text>End time: {new Date(this.props.trainingSession.end_time).toString()}</Text>
                {this.props.club.role === "owner" || this.props.club.role === "admin" ?
                    <TouchableOpacity style={{backgroundColor: "lightgrey", padding: 10, maxWidth: 60, borderRadius: 3}}
                                      onPress={() => this.setState({edit: true})}>
                        <Text>Edit</Text>
                    </TouchableOpacity> : null}
            </View> :
            <View>
                <TextInput autoCompleteType={"cc-number"} placeholder="Year: "
                           value={this.state.startTime.year.toString()}
                           onChangeText={text => this.setState((prevState, props) => {
                               let newState = prevState;
                               newState.startTime.year = text;
                               return newState
                           })}/>
            </View>
    }

}

export default connect((state, ownProps) => {
    return {
        ...ownProps
    }
})(ViewTrainingSession);
