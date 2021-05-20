import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import DeleteToDoListService from '../../services/DeleteToDoListService';

export default class ToDoList extends React.Component {

    handleDeleteToDoList = (toDoList) => {
        Alert.alert("Atenção",
        `Deseja realmente excluir a lista de tarefas "${toDoList.name}"?`,
        [
            {
                text: "Cancelar",
                style: "cancel",
                onPress: () => {}
            },
            {
                text: "Excluir",
                onPress: () => {
                    const deleteToDoListService = new DeleteToDoListService();
                    deleteToDoListService.execute(toDoList).then((isDeleted) => {
                        const {onGoBack} = this.props;
                        if (isDeleted) {
                            onGoBack();
                        }
                    }).catch((error) => {
                        Alert.alert("Erro", error.message);
                    });
                }
            }
        ]);
    }
    
    render() {
        const {navigation, toDoList, onGoBack} = this.props;
        const {name, color} = toDoList;
        const completedTasksCount = toDoList.todos.filter(todo => todo.completed).length;
        const remainingTasksCount = toDoList.todos.filter(todo => !todo.completed).length;

        return (
            <View>
                <TouchableOpacity onLongPress={() => this.handleDeleteToDoList(toDoList)} style={[styles.listContainer, {backgroundColor: color}]} onPress={() => navigation.navigate('ToDoScreen', {
                    toDoList,
                    onGoBack
                })}>
                    <Text style={styles.listTitle} numberOfLines={1}>{name}</Text>
        
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.count}>{remainingTasksCount}</Text>
                        <Text style={styles.subtitle}>{remainingTasksCount == 1 ? 'Restante' : 'Restantes'}</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.count}>{completedTasksCount}</Text>
                        <Text style={styles.subtitle}>{completedTasksCount == 1 ? 'Concluída' : 'Concluídas'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal:15,
        borderRadius: 10,
        marginHorizontal: 15,
        width: 250,
        alignItems: 'center'
    },
    listTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#FFFFFF",
        marginBottom: 20,
    },
    count: {
        fontSize: 50,
        fontWeight: "300",
        color: '#FFFFFF'
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "800",
        color: '#FFFFFF'
    }
});