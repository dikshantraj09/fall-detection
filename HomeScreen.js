import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Accelerometer")}
                style={styles.button}
            >
                <Text>View Accelerometer Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate("Gyroscope")}
                style={styles.button}
            >
                <Text> View Gyroscope Data </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    button: {
        padding: 10,
        margin: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
        width: 200,
    },
});

export default HomeScreen;
