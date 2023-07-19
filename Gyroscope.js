import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import axios from "axios";
import call from "react-native-phone-call";
import * as Location from "expo-location";

export default function App({ navigation }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isContacted, setIsContacted] = useState(false);
    const [mailMsg, setMailMsg] = useState("");
    const [isTimerStart, setIsTimerStart] = useState(true);

    const [timerCount, setTimer] = useState(20);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            // console.log(
            //     "Longitude: ",
            //     location.coords.longitude,
            //     "Latitude: ",
            //     location.coords.latitude
            // );
            setLocation(location);
        })();
    }, []);

    // let text = "Waiting..";
    // if (errorMsg) {
    //     text = errorMsg;
    // } else if (location) {
    //     console.log(location);
    //     text = JSON.stringify(location);
    // }

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                if (lastTimerCount <= 1) {
                    clearInterval(interval);
                    sendMail();
                }
                return lastTimerCount - 1;
            });
        }, 1000); //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval);
    }, []);

    const createTwoButtonAlert = (maill) =>
        Alert.alert(
            "Emergency Services Contacted",
            "Help is on the way from " + maill
        );

    const sendMail = () => {
        console.log(location);
        axios
            .post("http://192.168.0.107:5000/hospitals/invoke", {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                name: "Dhruv Kumar",
                age: "22",
                mobile: "+919818006088",
                bloodGroup: "B+",
                gender: "Male",
            })
            .then((res) => {
                console.log(res.data);
                createTwoButtonAlert(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
                <TouchableOpacity
                    style={styles.no}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.wt}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        sendMail();
                    }}
                    style={styles.hospi}
                >
                    <Text style={styles.wt}>Contact Nearby Hospital </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionStyle}>
                <Text style={styles.countdown}>{timerCount}</Text>
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
    countdown: {
        fontSize: 70,
        fontWeight: "bold",
        paddingTop: 40,
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
    hospi: {
        alignItems: "center",
        backgroundColor: "red",
        padding: 10,
        margin: 10,
        fontSize: 10,
    },

    yes: {
        alignItems: "center",
        backgroundColor: "black",
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
