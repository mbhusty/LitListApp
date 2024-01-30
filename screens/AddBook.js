import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getFirebaseApp} from "../utils/firebaseHelper";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import axios from 'axios';
import {COLORS, FONTS, SIZES} from "../constants";
import Loader from "../components/Loader";
import {Picker} from "@react-native-picker/picker";
import {useSelector} from "react-redux";

const AddBook = ({route}) => {
    const {onBookAdded} = route.params;
    const user = useSelector((state) => state.user.user);

    const [name, setBookName] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Список результатов поиска
    const [selectedBook, setSelectedBook] = useState(null); // Выбранная книга для добавления
    const [selectedStatus, setSelectedStatus] = useState(''); // Выбранный статус книги
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Состояние модального окна

    const navigation = useNavigation();

    const handleSearchBook = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${name}`);

            if (response.data.items && response.data.items.length > 0) {
                setSearchResults(response.data.items.map(item => item.volumeInfo));
            } else {
                setSearchResults([]);
                alert('Book not found');
            }
        } catch (error) {
            console.error("Error searching book:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async () => {
        if (!selectedBook || !selectedStatus) {
            alert('Please select a book and status');
            return;
        }

        const app = getFirebaseApp();
        const db = getFirestore(app);
        const booksCollectionRef = collection(db, 'books');

        try {
            const bookData = {
                name: selectedBook.title || '',
                author: selectedBook.authors ? selectedBook.authors.join(', ') : '',
                userId: user.uid,
                image: selectedBook?.imageLinks?.thumbnail || `https://placehold.co/150x250.png?text=${selectedBook.title}`,
                isFavorite: false,
                status: selectedStatus,
                dateRead: selectedStatus === 'Прочитано' ? new Date().toISOString() : null,
                description: selectedBook.description || "Нет описания"
            };

            await addDoc(booksCollectionRef, bookData);

            if (onBookAdded) {
                onBookAdded();
            }
            navigation.goBack();
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <View style={styles.search}>
                    <TextInput
                        keyboardType={'web-search'}
                        style={styles.input}
                        placeholder="Введи название книги для поиска"
                        value={name}
                        clearButtonMode={'always'}
                        onChangeText={(text) => setBookName(text)}
                    />
                </View>

                <Button title="Поиск" onPress={handleSearchBook}/>
            </View>
            {loading ? (
                <Loader/>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.searchResultItem}
                            onPress={() => {
                                setSelectedBook(item);
                                setModalVisible(true);
                            }}
                        >
                            <View style={styles.itemContainer}>
                                <Image
                                    source={{uri: item?.imageLinks?.thumbnail ? item.imageLinks.thumbnail : `https://placehold.co/150x250.png?text=${item.title}`}}
                                    style={styles.image}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>
                                        Название: <Text style={styles.subtext}>{item.title}</Text>
                                    </Text>
                                    <Text style={styles.text}>
                                        Автор: <Text
                                        style={styles.subtext}>{item.authors ? item.authors.join(', ') : 'Нет информации об авторе'}</Text>
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Модальное окно для выбора статуса */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Выбранная книга:</Text>
                        <Text>{selectedBook?.title}</Text>
                        <Text>{selectedBook?.authors ? selectedBook.authors.join(', ') : 'Нет информации об авторе'}</Text>
                        <Picker
                            selectedValue={selectedStatus}
                            style={{width: 300}}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedStatus(itemValue)
                            }
                        >
                            <Picker.Item label="Выберите статус" value=""/>
                            <Picker.Item label="Хочу прочитать" value="Хочу прочитать"/>
                            <Picker.Item label="Читаю" value="Читаю"/>
                            <Picker.Item label="Прочитано" value="Прочитано"/>
                            <Picker.Item label="Не закончено" value="Не закончено"/>
                            <Picker.Item label="Отложено" value="Отложено"/>
                        </Picker>
                        <View style={{flexDirection: "row"}}>
                            <Button title="Добавить книгу" onPress={() => {
                                handleAddBook();
                                setModalVisible(false);
                            }}/>
                            <Button title="Отмена" onPress={() => setModalVisible(false)}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    top: {
        alignItems: 'center',
    },
    search: {
        width: '100%',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding2,
        borderRadius: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
        marginVertical: 16,
        flexDirection: 'row',
    },
    input: {
        color: COLORS.background,
        flex: 1,
        fontFamily: 'regular',
        paddingTop: 0,
        fontSize: 18
    },
    searchResultItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 80,
        height: 120,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        paddingTop: 10,
        ...FONTS.bold,
        color: COLORS.background,
    },
    subtext: {
        ...FONTS.body3,
        color: COLORS.background,
    },
    title: {
        ...FONTS.h2,
        color: COLORS.background,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
    },
    modalTitle: {
        ...FONTS.h3,
        marginBottom: 10,
        marginTop: 5,
    },
});

export default AddBook;
