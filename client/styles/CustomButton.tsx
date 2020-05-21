import React, {FunctionComponent} from "react";
import { TouchableOpacity, Text } from "react-native";

interface CustomButtonProps {
    title: string,
    onPress: () => void
}

const CustomButton: FunctionComponent<CustomButtonProps> = ({title, onPress}) => {
    return <TouchableOpacity onPress={onPress} style={{ backgroundColor: "lightgrey", padding: 10, maxWidth: 75, borderRadius: 3 }}>
            <Text>{title}</Text>
        </TouchableOpacity>
}

export default CustomButton;