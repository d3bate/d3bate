import React, { useState, FunctionComponent } from "react";
import { TextInput } from "react-native";

interface DateInputProps {
    update: (text: string) => void,
    placeholder: string,
    startValue: string
}

const DateInput: FunctionComponent<DateInputProps> = ({ update, placeholder, startValue }) => {
    return <TextInput autoCompleteType={"cc-number"} placeholder={placeholder}
        value={startValue}
        onChangeText={text => update(text)} />
}

export default DateInput;