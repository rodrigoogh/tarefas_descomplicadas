import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import CreateToDoListService from '../../services/CreateToDoListService';

export default class AddToDoListScreen extends React.Component {
    
    colors = ["#00E88F", "#1299B5", "#347582", "#EB3F3B", "#B51255"];
    state = {
        name: '',
        color: this.colors[0]
    }

    createToDoList = () => {
        const {navigation, route} = this.props;
        const {name, color} = this.state;
        const todos = [];
        const toDoList = {name, color, todos};

        if (name) {
            const createToDoListService = new CreateToDoListService();
            createToDoListService.execute(toDoList).then(() => {
                this.setState({name: ''});
                Keyboard.dismiss();
                navigation.goBack();
                route.params.onGoBack();
            }).catch((error) => {
                Alert.alert("Erro", error.message);
                navigation.goBack();
            });
        }
    }

    renderColorPicker() {
        return this.colors.map((color) => {
            return (
                <TouchableOpacity 
                    style={[styles.colorPicker, {backgroundColor: color}]} 
                    key={color} 
                    onPress={() => this.setState({color})}
                 />
            )
        });
    }

    render() {
        const {navigation} = this.props;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="scroll">
                <TouchableOpacity style={{position: 'absolute', top: 80, right: 35}} onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={25} color={"#000000"} />
                </TouchableOpacity>
                <View style={{alignSelf: 'stretch', marginHorizontal: 35}}>
                    <Text style={styles.title}>Nova lista de tarefas</Text>
                    <TextInput style={styles.textInput} placeholder="Tarefas do dia..." value={this.state.name} onChangeText={(text) => this.setState({name: text})}/>
                    <View style={styles.colorPickerContainer}>{this.renderColorPicker()}</View>
                    <TouchableOpacity style={[styles.addToDoListButton, {backgroundColor: this.state.color}]} onPress={this.createToDoList}>
                        <Text style={{color: "#FFFFFF", fontWeight: "500"}}>Adicionar lista</Text>
                    </TouchableOpacity>
                 </View>
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
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#000000",
        alignItems: 'center',
        marginBottom: 15
    },
    textInput: {
        fontSize: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#D3D3D3",
        borderRadius: 10,
        height: 50,
        marginTop: 10,
        paddingHorizontal: 15
    },
    addToDoListButton: {
        marginTop: 25,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorPicker: {
        width: 50,
        height: 50,
        borderColor: "#D3D3D3",
        borderRadius: 10,
    },
    colorPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 50
    }
});