import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import React from 'react';

const DeleteModal = ({visible, title, message, Okay, Cancel}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.mainView}>
        <View style={styles.promptView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => {
                Cancel(false);
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={Okay}>
              <Text style={styles.buttonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  promptView: {
    width: 250,
    height: 175,
    backgroundColor: '#8f8f8f',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  buttonView: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: 'white',
  },
  message: {
    color: 'white',
    fontSize: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});
