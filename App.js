import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import Gyroscope from "./Gyroscope";
import Accelerometer from "./Accelerometer";
const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: "Welcome" }}
                />
                <Stack.Screen name="Call Screen" component={Gyroscope} />
                <Stack.Screen name="Detect Fall" component={Accelerometer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
