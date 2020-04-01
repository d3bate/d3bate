import React from "react";
import {Switch, Text, TouchableOpacity, View} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import {connect} from "react-redux";
import {addTrainingSession} from "../../state";

class AddTrainingSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date(),
            endTime: new Date(),
            livestream: false,
        }
    }

    addSession() {
        this.props.addTrainingSession(this.state.startTime, this.state.endTime, this.state.livestream, this.props.clubID)
    }

    render() {
        return (
            <View>
                <Text>Start time</Text>
                <DateTimePicker testID="start_time" mode="date" is24Hour={true} display="default"
                                onChange={(event, selectedDate) => {
                                    this.setState({startTime: selectedDate})
                                }}/>
                <Text>End time</Text>
                <DateTimePicker testID="start_time" mode="date" is24Hour={true} display="default"
                                onChange={(event, selectedDate) => {
                                    this.setState({endTime: selectedDate})
                                }}/>
                <Text>Includes a livestream?</Text>
                <Switch value={this.state.livestream} onValueChange={value => this.setState({livestream: value})}/>
                <TouchableOpacity style={{backgroundColord: "lightgrey", padding: 10, maxWidth: 60, borderRadius: 3}}
                                  onPress={this.login}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect((state, ownProps) => {
    return {...ownProps}
}, {addTrainingSession})(AddTrainingSession)
