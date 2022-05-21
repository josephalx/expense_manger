import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

const UpdateModal = ({initialExpense, visible, onClose, onSave}) => {
  const [expense, setexpense] = useState(initialExpense);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalStyle}>
        <View style={styles.updateWindow}>
          <Text style={styles.expenseTitle}>Add Expense</Text>
          <TextInput
            keyboardType={'number-pad'}
            value={expense.toString()}
            style={styles.TextInput}
            onChangeText={value => {
              setexpense(value);
            }}
          />
          <View style={styles.expenseButtons}>
            <TouchableOpacity
              onPress={() => {
                onClose(false);
              }}>
              <Text style={styles.expenseButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log(expense);
                onSave(expense);
                onClose(false);
              }}>
              <Text style={styles.expenseButton}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  updateWindow: {
    backgroundColor: 'grey',
    height: 180,
    width: 250,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  TextInput: {
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    color: 'white',
    width: '40%',
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontSize: 20,
    textAlign: 'center',
  },
  expenseTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  expenseButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  expenseButton: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
});
