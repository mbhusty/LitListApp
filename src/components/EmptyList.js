import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {COLORS, FONTS} from "../constants"; // Добавление Dimensions

const { height } = Dimensions.get('window'); // Получение высоты экрана

const EmptyList = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Пока тут пусто...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: height - 100, // Установка высоты контейнера равной высоте экрана
    },
    subtitle: {
        ...FONTS.body1,
        color: COLORS.background,
        textAlign: 'center',
    },
});

export default EmptyList;
