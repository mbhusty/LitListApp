import {MainScreen, Welcome} from "../screens";
import AddBook from "../screens/AddBook";
import ProfileScreen from "../screens/Profile";
import BookDetailScreen from "../screens/BookDetail";
import RandomBookScreen from "../screens/RandomBook";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const MainNavigator = (user) => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#eaeaea',
      },
      headerTitleStyle: {
        fontFamily: "regular"
      },
    }}
                     initialRouteName='Welcome'>
      {user.user ? (
        <Stack.Screen name="MainScreen" options={{headerShown: false, title: 'Главная',}}>
          {(props) => <MainScreen {...props}/>}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
      )}
      <Stack.Screen name="AddBook" options={{title: 'Добавить книгу'}}>
        {(props) => <AddBook {...props}/>}
      </Stack.Screen>
      <Stack.Screen name="Profile" options={{title: 'Мой профиль'}}>
        {(props) => <ProfileScreen {...props}/>}
      </Stack.Screen>
      <Stack.Screen name="BookDetail" options={{title: 'О книге'}}>
        {(props) => <BookDetailScreen {...props}/>}
      </Stack.Screen>
      <Stack.Screen name="RandomBook"
                    options={{title: 'Твоя случайная книга', presentation: 'modal'}}>
        {(props) => <RandomBookScreen {...props}/>}
      </Stack.Screen>
    </Stack.Navigator>
  )
}



