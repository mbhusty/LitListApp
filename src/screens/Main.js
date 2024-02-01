import {
    View,
    Button,
    SafeAreaView,
    StyleSheet, Text, Image, TouchableOpacity
} from "react-native";
import React, {useEffect, useState} from "react";
import {getFirebaseApp} from "../../utils/firebaseHelper";
import {
    getDoc,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    query,
    where,
    updateDoc
} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import Loader from "../components/Loader";
import BookList from "../components/BookList";
import TabBar from "../components/TabBar";
import {COLORS, FONTS} from "../constants";
import {useSelector} from "react-redux";

const MainScreen = ({navigation}) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [greeting, setGreeting] = useState('Привет');
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector((state) => state.user.user);
    const fetchBooks = async () => {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const booksCollectionRef = collection(db, "books");
        const userBooksQuery = query(booksCollectionRef, where("userId", "==", user.uid));

        try {
            const querySnapshot = await getDocs(userBooksQuery);
            const bookList = [];
            querySnapshot.forEach((doc) => {
                bookList.push({id: doc.id, ...doc.data()});
            });
            setBooks(bookList);
        } catch (error) {
            console.log("Error fetching books:", error);
        }
    };

    const handleDeleteBook = async (bookId) => {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const bookRef = doc(db, "books", bookId);

        try {
            await deleteDoc(bookRef);
            const updatedBooks = books.filter((book) => book.id !== bookId); // Фильтруем книги, исключая удаленную
            setBooks(updatedBooks); // Обновляем состояние books
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };


    const handleFavBook = async (book) => {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const bookRef = doc(db, "books", book.id);

        try {
            // Обновляем значение isFavorite в Firebase
            await updateDoc(bookRef, {isFavorite: !book.isFavorite});

            // Получаем обновленные данные из Firebase
            const updatedBookSnapshot = await getDoc(bookRef);
            const updatedBookData = updatedBookSnapshot.data();

            // Обновляем состояние книг в списке
            const updatedBooks = books.map((bookData) => {
                // Если это обновленная книга, заменяем ее новыми данными
                if (bookData.id === book.id) {
                    return {
                        ...bookData,
                        isFavorite: updatedBookData.isFavorite // Обновляем значение isFavorite
                    };
                }
                return bookData; // Возвращаем остальные книги без изменений
            });

            setBooks(updatedBooks); // Обновляем состояние books
        } catch (error) {
            console.error("Error fav book:", error);
        }
    };

    useEffect(() => {
        const fetchBooksData = async () => {
            setLoading(true);
            try {
                await fetchBooks();
            } catch (error) {
                console.log("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksData();
    }, []);


    useEffect(() => {
        const getGreeting = async () => {
            if (new Date().getHours() < 12) {
                setGreeting('Доброе утро')
            } else if (new Date().getHours() >= 12 && new Date().getHours() < 18) {
                setGreeting('Добрый день')
            } else {
                setGreeting('Добрый вечер')
            }
        };

        getGreeting();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Loader/>
            ) : (
                <View style={styles.content}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={styles.userInfo}>
                        <Text style={styles.title}>{greeting}, {user.displayName.split(' ')[0]}</Text>
                        <Image
                            source={{ uri: user.photoURL }}
                            style={{ width: '10%', aspectRatio: 1, borderRadius: 50, marginRight: 5}}
                        />
                    </View>
                    </TouchableOpacity>
                    <BookList books={books} onDelete={handleDeleteBook} onFavorite={handleFavBook}
                              fetchBooks={fetchBooks}/>
                    <View style={styles.bottomButtons}>
                        <TabBar onBookAdded={fetchBooks}/>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    bottomButtons: {
        flexDirection: "row",
        justifyContent: 'center',
        // justifyContent: "space-between",
    },
    title: {
        textAlign: 'center',
        ...FONTS.h2,
        color: COLORS.background,
    },
    userInfo: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        margin: 10
    }
});

export default MainScreen;
