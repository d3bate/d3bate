import {StyleSheet} from "react-native";

const colours = {
    primary: "#ff7665",
    tertiary: "#71d383",
    secondary: "#e3e3e3"
};

export let baseStyles = StyleSheet.create({
    primary: {
        backgroundColor: colours.primary,
    },
    secondary: {
        backgroundColor: colours.secondary
    },
    tertiary: {
        backgroundColor: colours.tertiary
    },
    grid: {
        display: "flex",
        flexDirection: "row"
    },
    primaryHeader: {
        padding: 10,
        ...this.primary
    },
    secondaryHeader: {
        padding: 10,
        ...this.secondary
    },
    tertiaryHeader: {
        padding: 10,
        ...this.tertiary
    }
});
