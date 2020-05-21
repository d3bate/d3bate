import React from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { addTrainingSession } from "../../state";
import { colours } from "../../styles";
import DateInput from "../DateInput";
import TimePicker from "../TimePicker";

const currentTime = () => {
    return {
        year: new Date().getFullYear() + 1,
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes()
    }
}
class AddTrainingSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: currentTime(),
            endTime: currentTime(),
            livestream: false,
        };
        this.addSession = this.addSession.bind(this);
    }

    addSession() {
        let computeDate = (date) => {
            Math.round(new Date(date.startTime.year,
                date.startTime.month, date.startTime.day, date.startTime.hour, date.startTime.minute).valueOf() / 1000)
        }
        this.props.addTrainingSession(
            computeDate(this.state.startTime),
            computeDate(this.state.endTime), this.state.livestream, this.props.clubID);
    }

    render() {
        return (
            <View style={{ backgroundColor: colours.tertiary, padding: 10, borderRadius: 3, }}>
                <Text style={{ fontSize: 24 }}>Add a session.</Text>
                <TimePicker pickerTitle="Start time" timeMode="startTime" setParentState={this.setState} time={this.state.startTime} />
                <TimePicker pickerTitle="End time" timeMode="endTime" setParentState={this.setState} time={this.state.endTime} />
                <Text>Includes a livestream?</Text>
                <Switch value={this.state.livestream} onValueChange={value => this.setState({ livestream: value })} />
                <TouchableOpacity style={{ backgroundColor: "lightgrey", padding: 10, maxWidth: 60, borderRadius: 3 }}
                    onPress={this.addSession}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect((_, ownProps) => {
    return { ...ownProps }
}, { addTrainingSession })(AddTrainingSession)
