import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign'
import {COLORS, FONTS} from "../constants";
import {useNavigation} from "@react-navigation/native";

const BookItem = ({ book, onDelete, onFavorite, fetchBooks }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('BookDetail', {book, fetchBooks})}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Image
                        source={{ uri: book.image }}
                        style={styles.image}
                        resizeMode="cover"
                        sharedTransitionTag={book.name}
                    />
                    <View style={styles.info}>
                        <Text style={styles.text}>
                            Название: <Text style={styles.subtext}>{book.name}</Text>
                        </Text>
                        <Text style={styles.text}>
                            Автор: <Text style={styles.subtext}>{book.author}</Text>
                        </Text>
                        <Text style={styles.text}>
                            Статус: <Text style={styles.subtext}>{book.status}</Text>
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <AntDesign
                    name={'delete'}
                    size={25}
                    color={'#807a7a'}
                    onPress={() => onDelete(book.id)}
                />
                <AntDesign
                    size={25}
                    name={book.isFavorite ? 'heart' : 'hearto'}
                    color={'#807a7a'}
                    onPress={() => onFavorite(book)}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      //  flexDirection: 'row',
        justifyContent: 'space-between',
      //  alignItems: 'center',
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 5,
        margin: 3,
       // width: '10%', // Оставляем небольшой отступ между элементами
    },
    card: {
        //height: 330,
    },
    cardContent: {
      //  alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        borderRadius: 15,
        width: '100%',
        aspectRatio: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end', // Выравнивание по нижнему краю
        marginTop: 5, // Добавляем отступ сверху для разделения кнопок от информации о книге
        marginBottom: 5, // Добавляем отступ сверху для разделения кнопок от информации о книге
    },
    text: {
        ...FONTS.bold,
        color: COLORS.background,
        paddingBottom: 5,
    },
    subtext: {
        ...FONTS.body3,
        color: COLORS.background,
    },
    info: {
       // maxHeight: '100%',
        flexDirection: 'column',
       // justifyContent: 'space-around',
        padding: 5,
    },
});

export default BookItem;
