import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CountDown from "react-native-countdown-component";
// import { Gyroscope } from "expo-sensors";
// import * as tf from "@tensorflow/tfjs";
// import { input } from "./input";

import call from "react-native-phone-call";

export default function App() {
    const [isTimerStart, setIsTimerStart] = useState(true);
    const [timerDuration, setTimerDuration] = useState(20);
    const makeCall = () => {
        const args = {
            number: "9654431735", // String value with the number to call
            prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
            skipCanOpen: true, // Skip the canOpenURL check
        };

        call(args).catch(console.error);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                The application has detected that a fall has occurred,{"\n"}
            </Text>
            <Text style={styles.text}>
                Do You Want to call the Emergency Contact!! {"\n"}
            </Text>
            <View>
                <TouchableOpacity onPress={makeCall} style={styles.yes}>
                    <Text style={styles.wt}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.no}>
                    <Text style={styles.wt}>No</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionStyle}>
                <CountDown
                    until={20}
                    timeToShow={["S"]}
                    digitTxtStyle={{ color: "#fff" }}
                    onFinish={makeCall}
                    size={50}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    wt: {
        color: "white",
        fontSize: 20,
    },
    text: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    prompt: {
        textAlign: "center",
        fontSize: 190,
    },
    yes: {
        alignItems: "center",
        backgroundColor: "red",
        padding: 10,
        margin: 10,
        fontSize: 10,
    },

    no: {
        alignItems: "center",
        backgroundColor: "green",
        padding: 10,
        margin: 10,
        fontSize: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        marginTop: 15,
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 10,
    },
    middleButton: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#ccc",
    },
    sectionStyle: {
        // flex: 1,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
    },
});

const options = {
    container: {
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 5,
        width: 200,
        alignItems: "center",
    },
    text: {
        fontSize: 25,
        color: "#00000",
        marginLeft: 7,
    },
};
