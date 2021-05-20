import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ToDoList from '../../components/ToDoList/ToDoList';
import GetToDoListService from '../../services/GetToDoListService';

export default class HomeScreen extends React.Component {

  state = {
    isModalVisible: false,
    toDoLists: [],
    user: {},
    isLoading: true
  };

  handleGetToDoList = async () => {
    const getToDoListService = new GetToDoListService();
    await getToDoListService.execute().then(toDoLists => {
      this.setState({toDoLists, isLoading: false});
    }).catch((error) => {
      Alert.alert("Erro", error.message);
    });
  }

  renderToDoList = ({item}) => (
    <ToDoList toDoList={item} navigation={this.props.navigation} onGoBack={this.handleGetToDoList} />
  );

  async componentDidMount() {
    await this.handleGetToDoList();
  }

  render() {

    const {navigation} = this.props;

    if (this.state.isLoading) {
      return (
          <View style={styles.container}>
            <ActivityIndicator size={"large"} color={"#00e88f"} />
          </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>Tarefas <Text style={styles.subtitle}>Descomplicadas</Text></Text>
        </View>
        <View style={{marginVertical: 50}}>
          <TouchableOpacity style={styles.addTaskButton} onPress={() => navigation.navigate('AddToDoListScreen', {
            onGoBack: this.handleGetToDoList
          })}>
            <AntDesign name="plus" size={20} color={'#00e88f'} />
          </TouchableOpacity>
          <Text style={styles.addTaskButtonTitle}>Nova lista de tarefas</Text>
        </View>
        <SafeAreaView style={{height: 300, paddingLeft: 35}}>
          <FlatList 
            data={this.state.toDoLists} 
            keyExtractor={item => item.id.toString()} 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            renderItem={this.renderToDoList}
            keyboardShouldPersistTaps="always" />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    flexDirection: 'row'
  },
  title: {
    color: '#000000',
    fontSize: 25,
    fontWeight: "bold"
  },
  subtitle: {
    fontWeight: "500",
    color: '#00e88f'
  },
  addTaskButton: {
    borderWidth: 1.5,
    borderColor: '#00e88f',
    borderRadius: 50,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center'
  },
  addTaskButtonTitle: {
    color: '#00e88f',
    fontWeight: "500",
    fontSize: 15,
    marginTop: 20
  }

});
