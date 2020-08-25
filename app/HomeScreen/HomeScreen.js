import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Transitioning, Transition} from 'react-native-reanimated';
import {Icon, Tooltip} from 'react-native-elements';

import {ToDoListSchema, TO_DO_LIST} from '../data/Schema';
import Realm from 'realm';

import moment from 'moment';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {realm: null, items: [], itemsDone: []};
  }

  componentDidMount() {
    this.getRealmData();
    this.props.navigation.addListener('focus', () => {
      this.getRealmData();
    });
  }
  // Retrieve All Data in Realm DataBase
  getRealmData = () => {
    this.myRef.current.animateNextTransition();
    Realm.open({
      schema: [ToDoListSchema],
    }).then((realm) => {
      let realmData = realm.objects(TO_DO_LIST);
      let arrayOpen = [];
      let arrayDone = [];
      for (let events of realmData) {
        if (JSON.parse(JSON.stringify(events)).done) {
          arrayDone.push(JSON.parse(JSON.stringify(events)));
        } else {
          arrayOpen.push(JSON.parse(JSON.stringify(events)));
        }
      }
      this.setState({
        realm: realmData,
        items: arrayOpen,
        itemsDone: arrayDone,
      });
      realm.close();
    });
  };

  //Remove Task for data with ID
  removeRealmData = (id) => {
    Realm.open({schema: [ToDoListSchema]}).then((realm) => {
      realm.write(() => {
        if (realm.objects(TO_DO_LIST).filtered('id =' + id).length > 0) {
          realm.delete(realm.objects(TO_DO_LIST).filtered('id =' + id));
        }
      });
    });
    this.getRealmData();
  };

  //Update Task for data with ID Done became True
  updateRealmData = (id) => {
    Realm.open({schema: [ToDoListSchema]}).then((realm) => {
      realm.write(() => {
        if (realm.objects(TO_DO_LIST).filtered('id =' + id).length > 0) {
          realm.create(TO_DO_LIST, {id: id, done: true}, 'modified');
        }
      });
    });
    this.getRealmData();
  };

  //Update Task for data with ID Done became False
  updateRealmRestore = (id) => {
    Realm.open({schema: [ToDoListSchema]}).then((realm) => {
      realm.write(() => {
        if (realm.objects(TO_DO_LIST).filtered('id =' + id).length > 0) {
          realm.create(TO_DO_LIST, {id: id, done: false}, 'modified');
        }
      });
    });
    this.getRealmData();
  };

  //Remove All Done true
  removeAllDone = () => {
    Realm.open({schema: [ToDoListSchema]}).then((realm) => {
      realm.write(() => {
        if (realm.objects(TO_DO_LIST).filtered('done =' + true).length > 0) {
          realm.delete(realm.objects(TO_DO_LIST).filtered('done =' + true));
        }
      });
    });
    this.getRealmData();
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Transitioning.View
            ref={this.myRef}
            transition={
              <Transition.Sequence>
                <Transition.Out type="scale" />
                <Transition.Change interpolation="easeInOut" />
                <Transition.In type="fade" />
              </Transition.Sequence>
            }
            style={styles.centerAll}>
            {this.state.items.map((item) => {
              return (
                <View key={item.id} style={styles.boxStyle}>
                  <View style={{paddingLeft: 20, flexDirection: 'column'}}>
                    <Text style={styles.text}>{item.title}</Text>
                    <Text>{moment(item.date).format('MMM Do YYYY')}</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 20,
                      flexDirection: 'row',
                    }}>
                    <Tooltip
                      height={150}
                      width={200}
                      backgroundColor="#f9f9f9"
                      popover={
                        <Text style={{fontSize: 15}}>
                          {item.detail === '' ? 'No Detail' : item.detail}
                        </Text>
                      }>
                      <Icon
                        name="info-circle"
                        type="font-awesome"
                        size={30}
                        style={{paddingRight: 10}}
                      />
                    </Tooltip>
                    <TouchableOpacity
                      onPress={() => this.removeRealmData(item.id)}>
                      <Icon
                        name="trash"
                        type="font-awesome"
                        color="#f50"
                        size={30}
                        style={{paddingRight: 10}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.updateRealmData(item.id)}>
                      <Icon
                        name="check-circle"
                        type="font-awesome"
                        color="#E59400"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.boxButton}
              onPress={() => this.props.navigation.navigate('Details')}>
              <Text style={styles.text}>Add </Text>
            </TouchableOpacity>
            <View style={styles.boxStyleDone}>
              <Text style={[styles.text, {paddingLeft: 20}]}>Done</Text>
              <TouchableOpacity onPress={() => this.removeAllDone()}>
                <Text
                  style={[styles.text, {paddingRight: 20, color: '#D63232'}]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.itemsDone.map((item) => {
              return (
                <View key={item.id} style={styles.boxDoneItems}>
                  <View style={{paddingLeft: 20, flexDirection: 'column'}}>
                    <Text style={styles.text}>{item.title}</Text>
                    <Text>{moment(item.date).format('MMM Do YYYY')}</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 20,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.removeRealmData(item.id)}>
                      <Icon
                        name="trash"
                        type="font-awesome"
                        size={30}
                        style={{paddingRight: 10}}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.updateRealmRestore(item.id)}>
                      <Icon name="undo" type="font-awesome" size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </Transitioning.View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {},
  text: {
    fontSize: 20,
  },
  boxStyle: {
    backgroundColor: '#ADD8E6',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: 'black',
    alignItems: 'center',
  },
  boxStyleDone: {
    backgroundColor: '#3F3F3F',
    width: '100%',
    height: 30,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: 'black',
    alignItems: 'center',
  },
  boxDoneItems: {
    backgroundColor: '#a9a9a9',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: 'black',
    alignItems: 'center',
  },
  boxButton: {
    backgroundColor: 'green',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'black',
  },
});

export default HomeScreen;
