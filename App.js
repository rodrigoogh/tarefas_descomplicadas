import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import ToDoScreen from './screens/ToDoScreen/ToDoScreen';
import AddToDoListScreen from './screens/AddToDoListScreen/AddToDoListScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ToDoScreen" component={ToDoScreen} />
        <Stack.Screen name="AddToDoListScreen" component={AddToDoListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;