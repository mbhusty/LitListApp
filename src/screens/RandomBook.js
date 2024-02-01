import React, {useEffect, useState} from "react";
import {
    Button, Dimensions, Image,
    SafeAreaView, ScrollView, StyleSheet,
    Text, View
} from "react-native";
import {getFirebaseApp} from "../../utils/firebaseHelper";
import {collection, doc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import Loader from "../components/Loader";
import {COLORS, FONTS} from "../constants";
import {useSelector} from "react-redux";
const {height} = Dimensions.get('screen');
const RandomBookScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const user = useSelector((state) => state.user.user);
    const fetchRandomBook = async () => {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const booksCollectionRef = collection(db, "books");
        const userBooksQuery = query(booksCollectionRef, where("userId", "==", user.uid), where("status", "==", "Хочу прочитать"));

        try {
            const querySnapshot = await getDocs(userBooksQuery);
            const bookList = [];
            querySnapshot.forEach((doc) => {
                bookList.push({id: doc.id, ...doc.data()});
            });
            const randomIndex = Math.floor(Math.random() * bookList.length);
            const randomBook = bookList[randomIndex];
            setSelectedBook(randomBook);
            setLoading(false);
        } catch (error) {
            console.log("Error fetching books:", error);
            setLoading(false);
        } finally {
           // setLoading(false);
        }
    };

    const updateStatusToReading = async () => {
        if (selectedBook) {
            const app = getFirebaseApp();
            const db = getFirestore(app);
            const bookDocRef = doc(db, "books", selectedBook.id);

            try {
                await updateDoc(bookDocRef, {status: "Читаю"});
                // Обновляем статус в локальном состоянии после успешного обновления в базе данных
                setSelectedBook({...selectedBook, status: "Читаю"});
                navigation.goBack()
            } catch (error) {
                console.log("Error updating status:", error);
            }
        }
    };

    useEffect(() => {
        fetchRandomBook();
    }, []);

    return (
        <SafeAreaView>
            {loading ? (
                <Loader/>
            ) : selectedBook ? (
                <View>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{uri: selectedBook.image}}
                                resizeMode="contain"
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.text}>{selectedBook.name}</Text>
                            <Text style={styles.text}>{selectedBook.author}</Text>
                        </View>
                        <View>
                            <Text style={styles.desc}>Описание:</Text>
                            <Text style={styles.subtext}>{selectedBook.description}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title="Начать читать" onPress={updateStatusToReading} />
                </View>
                </View>
            ) : (
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Text>Нет доступных книг</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        marginVertical: 5,
        padding: 10,

    },
    scrollContainer: {
        flexGrow: 1,

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
        position: 'absolute',
        bottom: 0, // Измените значение, если нужно поднять кнопку выше или опустить ниже
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: "#f2f2f2",
    },
    noBooksContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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

});


export default RandomBookScreen;
