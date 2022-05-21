import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ContactList from './Contacts';
import React from 'react';
import Home from './Home';
import CreateGroup from './CreateGroup';
import GroupPage from './GroupPage';

const stack = createNativeStackNavigator();
const navigator = () => {
  return (
    <NavigationContainer>
      <stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1375e8',
          },
          headerTintColor: 'white',
        }}>
        <stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Groups'}}
        />
        <stack.Screen name={'GroupPage'} component={GroupPage} />
        <stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{title: 'Create Contacts'}}
        />
        <stack.Screen
          name="contact"
          component={ContactList}
          options={{
            title: 'Contacts',
          }}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default navigator;
