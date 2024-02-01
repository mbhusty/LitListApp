import React, {useState} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import BookItem from './BookItem';
import EmptyList from "./EmptyList";

const BookList = ({ books, onDelete, onFavorite, fetchBooks }) => {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // Вызовите функцию fetchBooks для обновления данных
        await fetchBooks(); // Предположим, что fetchBooks - это функция, которая обновляет список книг
        setRefreshing(false);
    };
    const renderBooks = ({ item }) => <BookItem book={item} onDelete={onDelete} onFavorite={onFavorite} fetchBooks={fetchBooks}/>;

    return (
        <FlatList
            style={styles.container}
            data={books}
            numColumns={2}
            horizontal={false}
            renderItem={renderBooks}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={EmptyList}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    title="Потяни и отпусти для обновления" // Текст индикатора обновления для платформы iOS
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "91%",
       marginBottom: 10
    },
});

export default BookList;
