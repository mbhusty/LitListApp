import React, {useEffect, useState} from "react";
import {
    View,
    SafeAreaView,
    StyleSheet, Text, Image, ScrollView, Button
} from "react-native";
import {COLORS, FONTS} from "../constants";
import {getFirebaseApp} from "../utils/firebaseHelper";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {Picker} from "@react-native-picker/picker";
const BookDetailScreen = ({route}) => {
    const {book, fetchBooks} = route.params;

    const [status, setStatus] = useState(book.status);

    const updateBookStatus = async (newStatus) => {
        const app = getFirebaseApp();
        const db = getFirestore(app);

        try {
            // Получение ссылки на запись книги в базе данных Firebase
            //const bookRef = firebase.database().ref(`/books/${book.id}`);
            const bookRef = doc(db, "books", book.id);
            // Обновление статуса книги в базе данных
            await updateDoc(bookRef, { status: newStatus });

            // Обновление статуса в состоянии компонента
            setStatus(newStatus);
        } catch (error) {
            console.error("Ошибка при обновлении статуса книги:", error);
        }
    };


    useEffect(() => {
        fetchBooks()
    }, [status, route.params]);


    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{uri: book.image}}
                            resizeMode="contain"
                            style={styles.image}
                            sharedTransitionTag={book.name}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.text}>{book.name}</Text>
                        <Text style={styles.text}>{book.author}</Text>
                    </View>
                    <View>
                        <Text style={styles.desc}>Описание:</Text>
                        <Text style={styles.subtext}>{book.description}</Text>
                    </View>
                </View>
            </ScrollView>
            <View>
                <Picker
                style={styles.picker}
                selectedValue={status}
                onValueChange={(itemValue) => {
                    updateBookStatus(itemValue);
                }}
            >
                <Picker.Item label="Хочу прочитать" value="Хочу прочитать" />
                <Picker.Item label="Читаю" value="Читаю" />
                <Picker.Item label="Прочитано" value="Прочитано" />
                <Picker.Item label="Не закончено" value="Не закончено" />
                <Picker.Item label="Отложено" value="Отложено" />
            </Picker>

            </View>
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        marginVertical: 5,
        padding: 10,
    },
    imageContainer: {
        backgroundColor: "#EAEAEA",
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    image: {
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
    statusContainer: {

    },
    text: {
        ...FONTS.h2,
        color: COLORS.background,
        paddingBottom: 5,
    },
    subtext: {
        ...FONTS.body2,
        color: COLORS.background,
        paddingBottom: 5,
    },
    desc: {
        ...FONTS.h3,
        color: COLORS.background,
        paddingBottom: 2,
    },
    info: {
        alignItems: "center",
        flexDirection: 'column',
        padding: 5,
    },
    picker: {
        height: "40%",
    }
});
export default BookDetailScreen;
