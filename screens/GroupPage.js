import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import ExpenseModal from '../components/ExpenseModal';

const GroupPage = ({navigation, route}) => {
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const subscribe = firestore()
      .collection('Test User')
      .doc(route.params.id)
      .onSnapshot(documentSnapshot => {
        setdata(documentSnapshot.data());
        setloading(false);
        console.log(documentSnapshot.data());
      });

    return () => subscribe();
  }, [route.params.id]);

  const Header = () => {
    const type = data.type;
    return (
      <View style={styles.headerView}>
        <View style={styles.headerLogo}>
          {type === 'home' ? (
            <Entypo name={'home'} size={50} color={'white'} />
          ) : null}
          {type === 'work' ? (
            <Entypo name={'briefcase'} size={50} color={'white'} />
          ) : null}
          {type === 'trip' ? (
            <Entypo name={'drink'} size={50} color={'white'} />
          ) : null}
          {type === 'others' ? (
            <Entypo name={'shopping-cart'} size={24} color={'white'} />
          ) : null}
          <Text style={[styles.textStyle, styles.typeText]}>{data.type}</Text>
        </View>
        <Text style={[styles.textStyle, styles.header]}>{data.name}</Text>
      </View>
    );
  };

  const updater = (value, index) => {
    let update = data.members;
    update = [
      ...update.slice(0, index),
      {...update[index], expense: value},
      ...update.slice(index + 1),
    ];
    console.log(update);
    setloading(true);
    firestore()
      .collection('Test User')
      .doc(route.params.id)
      .update({members: update})
      .then(() => {
        console.log('Expense Updated');
        ToastAndroid.show('Expense Updated', ToastAndroid.SHORT);
        setloading(false);
      });
  };

  const RenderItem = ({item, index}) => {
    const [open, setopen] = useState(false);

    const updateExpense = value => {
      console.log(value);
      if (value === '') {
        return;
      }
      updater(value, index);
    };
    return (
      <>
        <TouchableOpacity
          style={styles.expenseCard}
          onPress={() => {
            setopen(true);
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
          onSave={updateExpense}
        />
      </>
    );
  };

  const Total = () => {
    let total = 0;
    if (!loading) {
      data.members.forEach(k => {
        total += parseInt(k.expense, 10);
      });
    }
    return (
      <View style={styles.totalView}>
        <Text style={[styles.textStyle, styles.totalTitle]}>Total</Text>
        <Text style={[styles.textStyle, styles.totalTitle]}>{total}</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainView}>
      <ScrollView style={styles.ScrollView}>
        <Header />
        <Text style={[styles.textStyle, styles.expenseTitle]}>Expenses</Text>
        {loading === false &&
          data.members.map((k, index) => {
            return <RenderItem item={k} key={index} index={index} />;
          })}
      </ScrollView>
      <Total />
      <Loader visble={loading} />
    </View>
  );
};

export default GroupPage;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
  },
  ScrollView: {
    width: '100%',
    padding: 15,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  headerLogo: {
    height: 80,
    width: 80,
    backgroundColor: '#8f8f8f',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    marginRight: 20,
  },
  typeText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
  memberName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  memberPhone: {color: 'white'},
  expenseUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expense: {
    color: 'white',
    fontSize: 25,
    paddingHorizontal: 5,
  },
  expenseTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalView: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1375e8',
    borderRadius: 10,
    marginBottom: 5,
  },
  totalTitle: {
    fontSize: 25,
  },
});
