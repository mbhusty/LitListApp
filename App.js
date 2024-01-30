if (__DEV__) {
    import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

import {useFonts} from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from "@react-navigation/native"
import {FONTS} from './constants/fonts';
import React, {useCallback, useEffect, useState} from 'react';
import {MainScreen, Welcome} from './screens';
import {Provider, useDispatch, useSelector} from 'react-redux'
import store from './store/store'
import {StatusBar} from "react-native";

import AddBook from "./screens/AddBook";
import ProfileScreen from "./screens/Profile";
import BookDetailScreen from "./screens/BookDetail";
import RandomBookScreen from "./screens/RandomBook";
import {clearUser, setUser} from "./store/user/actions";
import {getAuth} from "firebase/auth";
import {getFirebaseApp} from "./utils/firebaseHelper";

const Stack = createNativeStackNavigator();

const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [fontsLoaded] = useFonts(FONTS);
    const [navigation, setNavigation] = useState(null);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const onAuthStateChanged = (user) => {
        dispatch(setUser(user));
    };

    useEffect(() => {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        return auth.onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
    }, []);

/*    useEffect(() => {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Пользователь вошел в систему
                dispatch(setUser(user));
            } else {
                dispatch(clearUser());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);*/

    if (!fontsLoaded) {
        return null;
    }


/*
    const onAuthStateChanged = (user) => {
        dispatch(setUser(user));
    };

    useEffect(() => {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        return auth.onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
    }, []);*/

    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <NavigationContainer ref={(navigatorRef) => setNavigation(navigatorRef)}>
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
                    {user ? (
                    <Stack.Screen name="MainScreen" options={{headerShown: false, title: 'Главная',}}>
                        {(props) => <MainScreen {...props} navigation={navigation}/>}
                    </Stack.Screen>
                        ) : (
                    <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
                        )}
                    <Stack.Screen name="AddBook" options={{title: 'Добавить книгу'}}>
                        {(props) => <AddBook {...props} navigation={navigation}/>}
                    </Stack.Screen>
                    <Stack.Screen name="Profile" options={{title: 'Мой профиль'}}>
                        {(props) => <ProfileScreen {...props} navigation={navigation}/>}
                    </Stack.Screen>
                    <Stack.Screen name="BookDetail" options={{title: 'О книге'}}>
                        {(props) => <BookDetailScreen {...props} navigation={navigation}/>}
                    </Stack.Screen>
                    <Stack.Screen name="RandomBook"
                                  options={{title: 'Твоя случайная книга', presentation: 'modal'}}>
                        {(props) => <RandomBookScreen {...props} navigation={navigation}/>}
                    </Stack.Screen>
                </Stack.Navigator>
                <StatusBar style="auto"/>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const AppWrapper = () => {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
}
export default AppWrapper;
