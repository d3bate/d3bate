import {StyleSheet} from "react-native";

const colours = {
    primary: "#ff7665",
    tertiary: "#71d383",
    secondary: "#e3e3e3",
    danger: "#ff5800"
};

const baseStyles = StyleSheet.create({
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
});

const headerStyles = StyleSheet.create({
    primaryHeader: {
        padding: 10,
        ...baseStyles.primary
    },
    secondaryHeader: {
        padding: 10,
        ...baseStyles.secondary
    },
    tertiaryHeader: {
        padding: 10,
        ...baseStyles.tertiary
    }
});

export {baseStyles, headerStyles, colours};
