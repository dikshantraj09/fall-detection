import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer, Gyroscope } from "expo-sensors";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import { input } from "./input";
export default function App() {
    const [dataArr, setData] = useState([]);
    const [dataArr2, setData2] = useState([]);
    const [aData, setAData] = useState({});
    const [gData, setGData] = useState({});
    const [outcome, setOutcome] = useState("");
    const [fallDetector, setFallDetector] = useState("");
    // const [f1, setF1] = useState(0);
    // const [f2, setF2] = useState(0);
    const valueCount = 952;

    function startGyro() {
        Gyroscope.setUpdateInterval(20);
        Gyroscope.addListener((gyroData) => {
            // arr.push([[accData.x], [accData.y], [accData.z]]);
            // setData(arr);
            setGData(gyroData);
            setData2((prevData) => [
                ...prevData,
                [[gyroData.x], [gyroData.y], [gyroData.z]],
            ]);
        });
    }

    useEffect(() => {
        async function loadModel() {
            try {
                const tfReady = await tf.ready();
                const modelJson = await require("./assets/model/model.json");
                const modelWeight = await require("./assets/model/weights.bin");
                const fallDetector = await tf.loadLayersModel(
                    bundleResourceIO(modelJson, modelWeight)
                );
                setFallDetector(fallDetector);
                // console.log(fallDetector);
                console.log("[+]Model Loaded");
            } catch (e) {
                console.log(e);
            }
        }
        loadModel();
    }, []);

    async function getResult(res) {
        let result = await fallDetector.predict(tf.tensor([res])).data();
        setOutcome(result[0] ? "Not Fall" : "Fall");
    }

    useEffect(() => {
        startGyro();
        // return () => {
        //     console.log("Stopped");
        //     Gyroscope.removeAllListeners();
        // };
    }, []);

    function startAccelerometer() {
        Accelerometer.setUpdateInterval(20);
        Accelerometer.addListener((accData) => {
            // arr.push([[accData.x], [accData.y], [accData.z]]);
            // setData(arr);
            setAData(accData);
            setData((prevData) => [
                ...prevData,
                [[accData.x], [accData.y], [accData.z]],
            ]);
        });
    }

    useEffect(() => {
        startAccelerometer();
        // return () => {
        //     console.log("Stopped");
        //     Accelerometer.removeAllListeners();
        // };
    }, []);

    useMemo(() => {
        if (dataArr.length === valueCount) {
            Accelerometer.removeAllListeners();
        }

        if (dataArr2.length === valueCount) {
            Gyroscope.removeAllListeners();
        }
        if (dataArr.length === valueCount && dataArr2.length === valueCount) {
            let res = [];
            for (let i = 0; i < valueCount; i++) {
                res.push([...dataArr[i], ...dataArr2[i]]);
            }
            getResult(res);
            // ans.push(res);
            console.log(res.length);
            // console.log(res);
        }
    }, [dataArr, dataArr2]);

    // async function getResult() {
    //     let result = await fallDetector.predict(input);
    //     console.log(result);
    // }

    return (
        <View style={styles.mcont}>
            <View style={styles.container}>
                <Text style={styles.text}>Accelerometer:</Text>
                <Text style={styles.text}>x: {aData.x}</Text>
                <Text style={styles.text}>y: {aData.y}</Text>
                <Text style={styles.text}>z: {aData.z}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Gyroscope:</Text>
                <Text style={styles.text}>x: {gData.x}</Text>
                <Text style={styles.text}>y: {gData.y}</Text>
                <Text style={styles.text}>z: {gData.z}</Text>
            </View>
            {outcome !== "" && (
                <View style={styles.container}>
                    <Text style={styles.text}>Outcome: {outcome}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mcont: {
        marginTop: 200,
    },

    container: {
        marginTop: 50,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    text: {
        textAlign: "center",
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
});
