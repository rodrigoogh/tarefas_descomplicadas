import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated, Alert } from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {Swipeable} from 'react-native-gesture-handler';
import UpdateToDoListService from '../../services/UpdateToDoListService';

export default class ToDoScreen extends React.Component {
    state = {
        newToDo: "",
        toDoList: {
            todos: []
        }
    }

    toggleToDoCompleted = index => {
        const {toDoList} = this.state;

        toDoList.todos[index].completed = !toDoList.todos[index].completed;
        this.handleUpdateToDoList(toDoList);
    }

    handleUpdateToDoList = (toDoList) => {
        const updateToDoListService = new UpdateToDoListService();
        updateToDoListService.execute(toDoList).then(() => {
            this.setState({toDoList});
        }).catch((error) => {
            Alert.alert("Erro", error.message);
        });
    }

    handleAddToDo = () => {
        
        const {toDoList} = this.state;

        if (this.state.newToDo && !toDoList.todos.some(todo => todo.title === this.state.newToDo)) {

            toDoList.todos.push({
                title: this.state.newToDo,
                completed: false
            });

            this.handleUpdateToDoList(toDoList);
            this.setState({
                newToDo: ""
            });
        }

        Keyboard.dismiss();
    }

    handleDeleteButton = (index) => {
        let {toDoList} = this.state;
        Alert.alert("Atenção", 
        `Deseja realmente excluir a tarefa "${toDoList.todos[index].title}"?`,
        [
            {
                text: "Cancelar",
                style: "cancel",
                onPress: () => {
                    this.close();
                }
            },
            {
                text: "Excluir",
                onPress: () => {

                    toDoList.todos.splice(index, 1);
                    this.handleUpdateToDoList(toDoList);
                }
            }
        ]);
    }

    rightActions = (_, dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: "clamp"
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        });

        const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

        return (
            <TouchableOpacity onPress={() => this.handleDeleteButton(index)} >
                <Animated.View style={[styles.deleteButton, {opacity}]} >
                    <AnimatedIcon name="delete" size={25} color="#FFFFFF" style={[{transform: [{scale}]}]} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    renderToDo = (toDo, index) => {
        const {title, completed} = toDo;
        return (
            <Swipeable 
            ref={this.updateReference}
            friction={5}
            renderRightActions={(progress, dragX) => this.rightActions(progress, dragX, index)} >
                <View style={styles.toDoItemContainer}>
                    <TouchableOpacity onPress={() => this.toggleToDoCompleted(index)}>
                        <Ionicons name={completed ? "ios-square" : "ios-square-outline"} size={30} color={"#D3D3D3"} style={{width: 35}} />
                    </TouchableOpacity>
                    <Text style={[styles.toDoItemText, {color: completed ? "#D3D3D3" : "#000000", textDecorationLine: completed ? "line-through" : "none"}]}>{title}</Text>
                </View>
            </Swipeable>
        );
    }

    handleGoBack = () => {
        const {navigation, route} = this.props;
        navigation.goBack();
        route.params.onGoBack();
    }

    componentDidMount() {
        const {toDoList} = this.props.route.params;
        this.setState({toDoList});
    }

    updateReference = reference => {
        this._swipeableRow = reference;
    };

    close = () => {
        this._swipeableRow.close();
    };

    render() {
        const {route} = this.props;
        const {toDoList} = this.state.toDoList.length > 0 ? this.state : route.params;
        const taskCount = toDoList.todos.length;
        const completedTasksCount = toDoList.todos.filter(todo => todo.completed).length;

        return (
                <KeyboardAvoidingView style={{flex: 1}} behavior="scroll">
                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity style={{position: 'absolute', top: 80, right: 35, zIndex: 10}} onPress={this.handleGoBack}>
                            <AntDesign name="close" size={25} color={"#000000"} />
                        </TouchableOpacity>

                        <View style={[styles.section, styles.header, {borderBottomColor: toDoList.color}]}>
                            <View>
                                <Text style={styles.title}>{toDoList.name}</Text>
                                <Text style={styles.taskCount}>
                                    {completedTasksCount == 1 ? `${completedTasksCount} tarefa` : `${completedTasksCount} tarefas`} de 
                                    {taskCount == 1 ? ` ${taskCount} concluída` : ` ${taskCount} concluídas`}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.section, {flex: 3, marginVertical: 20}]}>
                            <FlatList 
                                data={toDoList.todos} 
                                renderItem={({item, index}) => this.renderToDo(item, index)} 
                                keyExtractor={(item, index) => index.toString()+item.title}
                                horizontal={false}
                                showsVerticalScrollIndicator={false} />
                        </View>

                        <View style={[styles.section, styles.footer]}>
                            <TextInput style={[styles.textInput, {borderColor: toDoList.color}]} onChangeText={text => this.setState({newToDo: text})} value={this.state.newToDo} />
                            <TouchableOpacity style={[styles.addToDoButton, {backgroundColor: toDoList.color}]} onPress={this.handleAddToDo}>
                                <AntDesign name="plus" size={20} color={"#FFFFFF"}/>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        alignSelf: 'stretch',
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 65,
        borderBottomWidth: 3,
        paddingTop: 125
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#000000"
    },
    taskCount: {
        marginTop: 5,
        marginBottom: 15,
        color: "#A3A3A3",
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15
    },
    textInput: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        marginRight: 10,
        paddingHorizontal: 10,
        fontSize: 18
    },
    addToDoButton: {
        borderRadius: 50,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toDoItemContainer: {
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30
    },
    toDoItemText: {
        fontSize: 18,
        color: "#000000",
        fontWeight: "700",
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#AD1138",
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontWeight: "800"
    }

});