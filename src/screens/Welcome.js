import {Alert, Image, StyleSheet, Text, View, Button} from 'react-native'
import React from 'react'
import {COLORS, FONTS, images, SIZES} from '../constants'
import {getFirebaseApp} from "../../utils/firebaseHelper";
import {getAuth, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";


const Welcome = ({ navigation }) => {
    const signInWithGoogle = async () => {
        try {
            const app = getFirebaseApp();
            const auth = getAuth(app);

            await GoogleSignin.configure({
                webClientId: '957571585066-uv8ogvg89odaipip044jpk80s6usg823.apps.googleusercontent.com', // Укажите ваш webClientId
                offlineAccess: true,
                forceCodeForRefreshToken: true,
            });

            const { idToken, user, serverAuthCode } = await GoogleSignin.signIn();

            const googleCredential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, googleCredential)
        } catch (error) {
            console.error(error);
            Alert.alert('Ошибка', 'Не удалось войти через Google');
        }
    };

    return (
        <View style={styles.background}>
            <Image
                source={images.logo}
                resizeMode='contain'
                style={styles.logo}
            />
            <Text style={styles.title}>Привет!</Text>
            <Text style={styles.subtitle}>Добро пожаловать в LitList</Text>
            <Text style={styles.subtitle}>Для начала необходимо авторизоваться ☺ </Text>

            <View style={{ marginTop: 72 }}>
                <Button title="Войти через Google" onPress={signInWithGoogle}/>
            </View>
        </View>
  )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAEAEA",
        paddingTop: 70
    },
    logo: {
        height: SIZES.width * .45,
        width:  SIZES.width * .45
    },
    title: {
        ...FONTS.h1,
        textTransform: "uppercase",
        color: COLORS.background,
        marginTop: 72,
        marginBottom: 10
    },
    subtitle: {
        ...FONTS.body3,
        color: COLORS.background,
        marginBottom: 10
    },
    btn: {
        width: SIZES.width - 44
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 12
    },
    tapBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

export default Welcome
