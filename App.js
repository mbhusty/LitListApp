if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

import {useFonts} from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {NavigationContainer} from "@react-navigation/native"
import {FONTS} from './src/constants/fonts';
import React, {useCallback, useEffect, useState} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux'
import store from './store/store'
import {setUser} from "./store/user/actions";
import {getAuth} from "firebase/auth";
import {getFirebaseApp} from "./utils/firebaseHelper";
import {MainNavigator} from "./src/navigation/MainNavigator";

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


  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer ref={(navigatorRef) => setNavigation(navigatorRef)}>

        <MainNavigator user={user}/>

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
