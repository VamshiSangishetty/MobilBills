import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from '../Screens/ShopScreen';
import CreateBill from '../Screens/CreateBill';
import Customers from '../Screens/Customers';
import BillScreen from '../Screens/BillScreen';

function Navigation(props) {
    const Stack=createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={ShopScreen} />
            <Stack.Screen name="Customers" component={Customers} />
            <Stack.Screen name="CreateBill" component={CreateBill} />
            <Stack.Screen name="BillScreen" component={BillScreen} />
        </Stack.Navigator>
    );
}

export default Navigation;