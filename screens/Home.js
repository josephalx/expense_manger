import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import DeleteModal from '../components/DeleteModal';
import {useIsFocused} from '@react-navigation/native';

const Home = ({navigation}) => {
  const [groups, setgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const focus = useIsFocused();
  useEffect(() => {
    setLoading(true);
    firestore()
      .collection('Test User')
      .get()
      .then(querySnapshot => {
        setgroups(
          querySnapshot.docs.map(k => {
            return {...k._data, id: k.id};
          }),
        );
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  }, [focus]);

  const FAB = () => {
    return (
      <TouchableOpacity
        style={styles.FABbackground}
        onPress={() => {
          navigation.push('CreateGroup');
        }}>
        <Text style={styles.FABText}>Create Group</Text>
      </TouchableOpacity>
    );
  };

  const deleteGroup = index => {
    setLoading(true);
    firestore()
      .collection('Test User')
      .doc(groups[index].id)
      .delete()
      .then(() => {
        setLoading(false);
        ToastAndroid.show('Group Deleted', ToastAndroid.SHORT);
        setgroups([...groups.slice(0, index), ...groups.slice(index + 1)]);
      });
  };

  const ExpenseGroup = ({item, index}) => {
    const [open, setopen] = useState(false);
    return (
      <>
        <TouchableOpacity
          style={styles.groupCard}
          onPress={() => {
            navigation.push('GroupPage', {id: item.id});
          }}
          onLongPress={() => {
            setopen(true);
          }}>
          <View style={styles.icon}>
            {item.type === 'home' ? (
              <Entypo name={'home'} size={24} color={'white'} />
            ) : null}
            {item.type === 'work' ? (
              <Entypo name={'briefcase'} size={24} color={'white'} />
            ) : null}
            {item.type === 'trip' ? (
              <Entypo name={'drink'} size={24} color={'white'} />
            ) : null}
            {item.type === 'others' ? (
              <Entypo name={'shopping-cart'} size={24} color={'white'} />
            ) : null}
          </View>
          <View>
            <Text style={styles.groupTitle}>{item.name}</Text>
            <Text
              style={styles.subTitle}>{`${item.members.length} Members`}</Text>
          </View>
        </TouchableOpacity>
        <DeleteModal
          visible={open}
          Cancel={setopen}
          title={'Delete Group'}
          message={'This group will be deleted'}
          Okay={() => {
            setopen(false);
            deleteGroup(index);
          }}
        />
      </>
    );
  };

  const _renderItem = ({item, index}) => {
    return <ExpenseGroup item={item} index={index} />;
  };

  const ListEmptyComponent = () => {
    return (
      <View style={styles.ListEmptyComponent}>
        <Entypo name="magnifying-glass" size={100} color={'#aaaaaa'} />
        <Text style={styles.emptyText}>No Groups</Text>
      </View>
    );
  };
  return (
    <View style={styles.mainView}>
      <FlatList
        data={groups}
        keyExtractor={(_, index) => index}
        renderItem={_renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      <FAB />
      <Loader visble={loading} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black',
  },
  FABText: {
    color: 'white',
    fontSize: 18,
  },
  FABbackground: {
    backgroundColor: '#027DFF',
    position: 'absolute',
    bottom: 30,
    right: 20,
    padding: 10,
    borderRadius: 10,
  },
  groupCard: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#aaaaaa',
    paddingHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  groupTitle: {
    fontSize: 25,
    color: 'white',
  },
  subTitle: {
    color: 'white',
  },
  emptyText: {
    color: '#aaaaaa',
    fontSize: 40,
  },
  ListEmptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});
