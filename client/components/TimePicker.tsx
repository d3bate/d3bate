import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import DateInput from "./DateInput";

interface TimePickerProps {
    pickerTitle: string,
    // TODO: add type annotations for this
    time: any,
    // TODO: add type annotations for this
    setParentState: any,
    timeMode: string
}

const TimePicker: FunctionComponent<TimePickerProps> = ({ pickerTitle, time, setParentState , timeMode}) => {
    return <View>
        <Text>{pickerTitle}</Text>
        <View style={{ display: "flex", flexDirection: "row", borderColor: "black" }}>
            <DateInput placeholder="Year: " startValue={time.year.toString()} update={text => setParentState((prevState, _) => {
                let newState = prevState;
                newState[timeMode].year = text;
                return newState
            })} />
            <DateInput placeholder="Month: " startValue={time.month.toString()} update={text => setParentState((prevState, _) => {
                let newState = prevState;
                newState[timeMode].month = text;
                return newState
            })} />
            <DateInput placeholder="Day: " startValue={time.day.toString()} update={text => setParentState((prevState, _) => {
                let newState = prevState;
                newState[timeMode].day = text;
                return newState
            })} />
            <DateInput placeholder="Hour: " startValue={time.hour.toString()} update={text => setParentState((prevState, _) => {
                let newState = prevState;
                newState[timeMode].hour = text;
                return newState
            })} />
            <DateInput placeholder="Minute: " startValue={time.minute.toString()} update={text => setParentState((prevState, _) => {
                let newState = prevState;
                newState[timeMode].minute = text;
                return newState
            })} />
        </View>
    </View>
}

export default TimePicker;