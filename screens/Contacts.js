import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
  TextInput,
  LogBox,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CheckBox from '@react-native-community/checkbox';
import Contacts from 'react-native-contacts';

const ContactList = ({route, navigation}) => {
    LogBox.ignoreLogs([
    'Warning: Non-serializable values were found in the navigation state',
  ]);
  const [search, setsearch] = useState('');
  const [contacts, setContacts] = useState([]);
  const cont = async () => {
    let status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    console.log(status);
    if (status === 'denied' || status === 'never_ask_again') {
      throw Error('Permissions not granted to access Contacts');
    }
    Contacts.getAll()
      .then(item => {
        const stored = item.map((k, index) => {
          return {
            id: index,
            name: k.displayName,
            number: k?.phoneNumbers[0].number,
            selected: false,
          };
        });
        setContacts(stored);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    cont();
  }, []);

  const onSelected = item => {
    setContacts([
      ...contacts.slice(0, item.id),
      {...item, selected: !item.selected},
      ...contacts.slice(item.id + 1),
    ]);
  };

  const createGroup = () => {
    const selectedContacts = contacts.filter(k => k.selected);
    if (selectedContacts.length > 0) {
      route.params.contacts(selectedContacts);
      navigation.goBack();
      return;
    }
    console.log('No contacts selected');
  };

  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelected(item);
        }}
        style={styles.backgroundView}>
        <CheckBox
          value={item.selected}
          onValueChange={() => {
            onSelected(item);
          }}
          tintColors={{true: '#1375e8'}}
        />
        <View>
          <Image
            source={require('../assets/avatar.jpeg')}
            style={styles.avatar}
          />
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.number}>{item.number}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _emptyList = () => {
    return (
      <View style={styles.emptyListView}>
        <Text style={styles.emptyListText}>No Contacts</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainView}>
      <TextInput
        style={styles.searchBar}
        value={search}
        placeholder="Search Contacts"
        placeholderTextColor={'white'}
        onChangeText={text => {
          setsearch(text);
        }}
      />
      <FlatList
        data={contacts.filter(item => {
          return (
            item.name.toLowerCase().startsWith(search.toLowerCase().trim()) ||
            item.number.toLowerCase().startsWith(search.toLowerCase().trim())
          );
        })}
        keyExtractor={(_, index) => index}
        renderItem={_renderItem}
        ListEmptyComponent={_emptyList}
      />
      <TouchableOpacity style={styles.createGroup} onPress={createGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  backgroundView: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8f8f8f',
    marginTop: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  avatar: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    marginHorizontal: 10,
  },
  mainView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  createGroup: {
    margin: 10,
    marginBottom: 0,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#1b7ced',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#8f8f8f',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'white',
    marginBottom: 10,
  },
  emptyListText: {
    fontSize: 30,
    color: '#aaaaaa',
  },
  emptyListView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    color: 'white',
  },
});
