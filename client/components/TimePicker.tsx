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

const constructDatePicker = (subCategory, placeholder: string, timeMode, time, setParentState) => {
    return <DateInput placeholder={placeholder} startValue={time[subCategory].toString()} update={text => setParentState((prevState, _) => {
        let newState = prevState;
        newState[timeMode].year = text;
        return newState
    })} />
}

const TimePicker: FunctionComponent<TimePickerProps> = ({ pickerTitle, time, setParentState, timeMode }) => {
    return <View>
        <Text>{pickerTitle}</Text>
        <View style={{ display: "flex", flexDirection: "row", borderColor: "black" }}>
            {constructDatePicker("year", "Year:", timeMode, time, setParentState)}
            {constructDatePicker("month", "Month:", timeMode, time, setParentState)}
            {constructDatePicker("day", "Day:", timeMode, time, setParentState)}
            {constructDatePicker("hour", "Hour:", timeMode, time, setParentState)}
            {constructDatePicker("minute", "Minute:", timeMode, time, setParentState)}
        </View>
    </View>
}

export default TimePicker;