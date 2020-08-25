import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './app/HomeScreen/HomeScreen';
import AddScreen from './app/AddScreen/AddScreen';
import UpdateScreen from './app/UpdateScreen/UpdateScreen';

const Stack = createStackNavigator();
//Main App Navigator Initiate
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{title: 'ADD'}}
        />
        <Stack.Screen
          name="Update"
          component={UpdateScreen}
          options={{title: 'Update'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
