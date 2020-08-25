import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Button} from 'react-native-elements';

import {ToDoListSchema, TO_DO_LIST} from '../data/Schema';
import Realm from 'realm';

import moment from 'moment';

class UpdateScreen extends Component {
  constructor(props) {
    super(props);
    let item = this.props.route.params.item;
    this.state = {
      isDatePickerVisible: false,
      id: item.id,
      date: item.date,
      title: item.title,
      detail: item.detail,
      missTitle: false,
    };
  }

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  handleConfirm = (dateValue) => {
    this.setState({date: dateValue, dateSelect: true});
    this.hideDatePicker();
  };
  //Update to Realm DataBase
  addRealmData = () => {
    if (this.state.title === '') {
      this.setState({missTitle: true});
    } else {
      Realm.open({
        schema: [ToDoListSchema],
      }).then((realm) => {
        realm.write(() => {
          if (
            realm.objects(TO_DO_LIST).filtered('id =' + this.state.id).length >
            0
          ) {
            realm.create(
              TO_DO_LIST,
              {
                id: this.state.id,
                title: this.state.title,
                detail: this.state.detail,
                date: this.state.date,
              },
              'modified',
            );
          }
        });
      });
      this.props.navigation.navigate('Home');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <Text style={styles.text}>Title</Text>
          <TextInput
            style={
              this.state.missTitle
                ? [styles.textInput, {borderColor: 'red'}]
                : styles.textInput
            }
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
        </View>
        <View style={styles.boxContainer}>
          <Text style={styles.text}>Detail</Text>
          <TextInput
            style={styles.textInputBox}
            onChangeText={(text) => this.setState({detail: text})}
            multiline={true}
            value={this.state.detail}
          />
        </View>
        <View style={styles.boxContainer}>
          <TouchableOpacity style={styles.button} onPress={this.showDatePicker}>
            <Text style={[styles.text, {color: 'green'}]}>
              {moment(this.state.date).format('MMM Do YYYY')}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />
        </View>
        <Button
          title="Update"
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitle}
          onPress={() => this.addRealmData()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  boxContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
    paddingBottom: 10,
  },
  textDate: {
    color: 'red',
  },
  textInput: {
    textAlign: 'center',
    height: 50,
    width: '80%',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  textInputBox: {
    textAlign: 'center',
    height: 100,
    width: '80%',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  buttonStyle: {
    width: 150,
    borderRadius: 25,
  },
  buttonTitle: {
    fontSize: 25,
  },
});

export default UpdateScreen;
