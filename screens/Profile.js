import React, {useCallback} from "react";
import {View, Button, SafeAreaView, Text, Image} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {clearUser} from "../store/user/actions";
import {getFirebaseApp} from "../utils/firebaseHelper";
import {getAuth} from "firebase/auth";
import {useNavigation} from "@react-navigation/native";

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const signOut = useCallback(async () => {
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);

      dispatch(clearUser());
      navigation.navigate('MainScreen');
      await auth.signOut();

    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);


  return (
    <SafeAreaView>
      {user && (
        <>
          <Text>Profile - {user.displayName}</Text>
          <Text>{user.email}</Text>
          <Image
            source={{uri: user.photoURL}}
            style={{width: '50%', aspectRatio: 1, borderRadius: 50, marginRight: 5}}
          />
        </>
      )}
      <Button title={"Выйти"} onPress={() => signOut()}/>
    </SafeAreaView>
  );
};

export default ProfileScreen;
