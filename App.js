import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './app/HomeScreen/HomeScreen';
import DetailsScreen from './app/DetailsScreen/DetailsScreen';

const Stack = createStackNavigator();
//Main App Navigator Initiate
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{title: 'ADD'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
