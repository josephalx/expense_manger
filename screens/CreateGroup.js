import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import DeleteModal from '../components/DeleteModal';
import ExpenseModal from '../components/ExpenseModal';
const CreateGroup = ({route, navigation}) => {
  const [group, setgroup] = useState({name: '', type: ''});
  const [members, setmembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateContact = value => {
    if (value.length > 0) {
      ToastAndroid.show(
        'Kindly Press the expense card to add expense and Long Press to delete',
        ToastAndroid.LONG,
      );
    }
    const update = value.map(item => {
      return {name: item.name, number: item.number, expense: 0};
    });
    console.log(update);
    setmembers(update);
  };

  const Button = ({type}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (type === group.type) {
            setgroup({...group, type: ''});
            return;
          }
          setgroup({...group, type: type});
        }}
        style={[
          styles.typeButton,
          // eslint-disable-next-line react-native/no-inline-styles
          {backgroundColor: type === group.type ? '#1375e8' : '#8f8f8f'},
        ]}>
        {type === 'home' ? (
          <Entypo name={'home'} size={24} color={'white'} />
        ) : null}
        {type === 'work' ? (
          <Entypo name={'briefcase'} size={24} color={'white'} />
        ) : null}
        {type === 'trip' ? (
          <Entypo name={'drink'} size={24} color={'white'} />
        ) : null}
        {type === 'others' ? (
          <Entypo name={'shopping-cart'} size={24} color={'white'} />
        ) : null}
        <Text style={styles.typeText}>{type}</Text>
      </TouchableOpacity>
    );
  };

  const updater = (index, value) => {
    if (value === '') {
      ToastAndroid.show('Enter a valid Number', ToastAndroid.SHORT);
      return;
    }
    setmembers([
      ...members.slice(0, index),
      {...members[index], expense: value},
      ...members.slice(index + 1),
    ]);
  };

  const deleter = index => {
    setmembers([...members.slice(0, index), ...members.slice(index + 1)]);
  };

  const ExpenseUpdate = ({item, index}) => {
    const [open, setopen] = useState(false);
    const [warning, setWarning] = useState(false);

    const onSaveExpense = value => {
      updater(index, value);
    };

    return (
      <>
        <TouchableOpacity
          style={styles.expenseCard}
          onPress={() => {
            setopen(true);
          }}
          onLongPress={() => {
            setWarning(true);
          }}>
          <View>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberPhone}>{item.number}</Text>
          </View>
          <View style={styles.expenseUpdate}>
            <Text style={styles.expense}>{item.expense}</Text>
          </View>
        </TouchableOpacity>
        <ExpenseModal
          visible={open}
          onClose={setopen}
          initialExpense={item.expense}
          onSave={onSaveExpense}
        />
        <DeleteModal
          visible={warning}
          title={'Delete Contact'}
          message={'This member will be deleted from the group'}
          Okay={() => {
            deleter(index);
          }}
          Cancel={setWarning}
        />
      </>
    );
  };

  const ExpenseTracker = () => {
    return (
      <>
        <Text style={styles.memberTitle}>Members</Text>
        <Text style={styles.infolabel}>
          (Add - sign for expense to be given)
        </Text>
        {members.map((k, index) => (
          <ExpenseUpdate key={index} item={k} index={index} />
        ))}
      </>
    );
  };

  const expensePush = () => {
    if (group.name === '' || group.type === '') {
      ToastAndroid.show('Kindly add a Group Name and Type', ToastAndroid.SHORT);
      return;
    }
    if (members.length === 0) {
      ToastAndroid.show('Kindly add members to Group', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    firestore()
      .collection('Test User')
      .add({
        name: group.name,
        type: group.type,
        members,
      })
      .then(() => {
        console.log('Expense added!');
        setLoading(false);
        navigation.goBack();
      });
  };

  return (
    <View style={styles.mainView}>
      <ScrollView style={styles.scroll}>
        <View style={styles.subView}>
          <Text style={styles.title}>Create Group</Text>
          <View style={styles.types}>
            <Button type="home" />
            <Button type="work" />
            <Button type="trip" />
            <Button type="others" />
          </View>
          <TextInput
            value={group.name}
            placeholder="Group Name"
            placeholderTextColor={'white'}
            style={styles.groupName}
            onChangeText={value => {
              setgroup({...group, name: value});
            }}
          />
        </View>
        {members.length === 0 ? (
          <TouchableOpacity
            style={styles.addContact}
            onPress={() => {
              navigation.push('contact', {contacts: updateContact});
            }}>
            <AntDesign name="pluscircle" size={70} color={'#1375e8'} />
            <Text style={styles.addContacts}>Add Contacts</Text>
          </TouchableOpacity>
        ) : (
          <ExpenseTracker />
        )}
      </ScrollView>
      <TouchableOpacity style={styles.CreateGroup} onPress={expensePush}>
        <Text style={styles.CreateGroupText}>Create Group</Text>
      </TouchableOpacity>
      <Loader visble={loading} />
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subView: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: 'white',
    fontSize: 35,
    marginBottom: 10,
  },
  groupName: {
    borderWidth: 3,
    borderColor: '#aaaaaa',
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 20,
    marginBottom: 25,
  },
  addContacts: {
    color: '#1375e8',
    fontSize: 20,
    marginTop: 10,
  },
  typeText: {
    color: 'white',
    fontSize: 22,
  },
  typeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 15,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 25,
  },
  memberName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  memberPhone: {color: 'white'},
  memberTitle: {
    color: 'white',
    fontSize: 30,
    marginBottom: 2,
  },
  expenseCard: {
    backgroundColor: '#8f8f8f',
    marginVertical: 5,
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scroll: {width: '100%'},
  expenseUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expense: {
    color: 'white',
    fontSize: 25,
    paddingHorizontal: 5,
  },
  CreateGroup: {
    backgroundColor: '#1375e8',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  CreateGroupText: {
    color: 'white',
    fontSize: 20,
  },
  addContact: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infolabel: {
    color: '#1375e8',
    fontSize: 15,
    marginBottom: 5,
  },
});
