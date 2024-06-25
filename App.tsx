import { View,Text,StyleSheet } from "react-native";
import HomeScreen from "./components/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const navigation = createNativeStackNavigator();
const App = () => {
  return (
   <NavigationContainer>
    <navigation.Navigator initialRouteName="homescreen">
    <navigation.Screen name="homescreen" component={HomeScreen}/>
    </navigation.Navigator>
   </NavigationContainer>
  );
}
export default App;