import React from "react";
import {Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {addTrainingSession} from "../../state";
import {colours} from "../../styles";

class AddTrainingSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: {
                year: new Date().getFullYear() + 1,
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes()
            },
            endTime: {
                year: new Date().getFullYear() + 1,
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes()
            },
            livestream: false,
        };
        this.addSession = this.addSession.bind(this);
    }

    addSession() {
        this.props.addTrainingSession(
            Math.round(new Date(this.state.startTime.year,
                this.state.startTime.month, this.state.startTime.day, this.state.startTime.hour, this.state.startTime.minute).valueOf() / 1000),
            Math.round(new Date(this.state.endTime.year, this.state.endTime.month, this.state.endTime.day,
                this.state.endTime.hour, this.state.endTime.minute).valueOf() / 1000), this.state.livestream, this.props.clubID);
    }

    render() {
        return (
            <View style={{backgroundColor: colours.tertiary, padding: 10, borderRadius: 3,}}>
                <Text style={{fontSize: 24}}>Add a session.</Text>
                <Text>Start time</Text>
                <View style={{display: "flex", flexDirection: "row", borderColor: "black"}}>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Year: "
                               value={this.state.startTime.year.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.startTime.year = text;
                                   return newState
                               })}/>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Month: "
                               value={this.state.startTime.month.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.startTime.month = text;
                                   return newState
                               })}/>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Day: "
                               value={this.state.startTime.day.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.startTime.day = text;
                                   return newState
                               })}/>
                    <TextInput placeholder="Hour: " value={this.state.startTime.hour.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.startTime.hour = text;
                                   return newState
                               })}/>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Minute: "
                               value={this.state.startTime.minute.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.startTime.minute = text;
                                   return newState
                               })}/>
                </View>
                <Text>End time</Text>
                <View style={{display: "flex", flexDirection: "row", borderColor: "black"}}>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Year: "
                               value={this.state.endTime.year.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.endTime.year = text;
                                   return newState
                               })}/>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Month: "
                               value={this.state.endTime.month.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.endTime.month = text;
                                   return newState
                               })}/>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Day: "
                               value={this.state.endTime.day.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.endTime.day = text;
                                   return newState
                               })}/>
                    <TextInput placeholder="Hour: " value={this.state.endTime.hour.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.endTime.hour = text;
                                   return newState
                               })}/>
                    <TextInput autoCompleteType={"cc-number"} placeholder="Minute: "
                               value={this.state.endTime.minute.toString()}
                               onChangeText={text => this.setState((prevState, props) => {
                                   let newState = prevState;
                                   newState.endTime.minute = text;
                                   return newState
                               })}/>
                </View>
                <Text>Includes a livestream?</Text>
                <Switch value={this.state.livestream} onValueChange={value => this.setState({livestream: value})}/>
                <TouchableOpacity style={{backgroundColor: "lightgrey", padding: 10, maxWidth: 60, borderRadius: 3}}
                                  onPress={this.addSession}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect((state, ownProps) => {
    return {...ownProps}
}, {addTrainingSession})(AddTrainingSession)
