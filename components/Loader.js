import {StyleSheet, Text, View, Modal, ActivityIndicator} from 'react-native';
import React from 'react';

const Loader = ({visble}) => {
  return (
    <Modal transparent visible={visble}>
      <View style={styles.mainView}>
        <View style={styles.loaderView}>
          <ActivityIndicator color={'white'} size={30} />
          <Text style={styles.LoaderText}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  loaderView: {
    width: 150,
    height: 150,
    backgroundColor: '#8f8f8f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  LoaderText: {
    color: 'white',
    fontSize: 25,
    marginTop: 10,
  },
});
