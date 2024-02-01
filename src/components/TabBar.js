import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS} from "../constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useNavigation} from "@react-navigation/native";

const TabBar = ({ goToRandomBook, goToFavorites, onBookAdded}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('AddBook', { onBookAdded: onBookAdded })}>
                <AntDesign name={"plus"} size={25} color={"#706f6f"}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('RandomBook')}>
                <AntDesign name={"retweet"} size={25} color={"#706f6f"}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={goToFavorites}>
                <AntDesign name={"staro"} size={25} color={"#706f6f"}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-around',
        paddingHorizontal: 10,
       // paddingTop: 15,
        //paddingBottom: 15,
        alignItems: 'center',
        //borderTopWidth: 1,
    },
    tabButton: {
        flexDirection: 'row',

        paddingHorizontal: 5,
    },
    tabText: {
        ...FONTS.body3,
        color: COLORS.background,
    },
});

export default TabBar;
