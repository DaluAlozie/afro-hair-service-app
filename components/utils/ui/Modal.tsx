import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from 'tamagui';
import { UseThemeResult } from '@tamagui/core';
import CustomModal from './CustomModal';

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
  onclose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, open, setOpen, onclose = () =>{} }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <>
    { Platform.OS === "android" ?
    <CustomModal visible={open} onRequestClose={() => setOpen(false) }>
      {children}
    </CustomModal>
    :
    <RNModal
      transparent={true}
      visible={open}
      animationType="fade"
      onRequestClose={() => { onclose(); setOpen(false);  }}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "auto",
        height: "100%",
        width: "100%",
        padding: 100,
      }}
    >
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={styles.alertBox}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
    }
    </>
  );
};

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.gray1Dark.val,
      opacity: 0.95,
    },
    alertBox: {
      width: "100%",
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      opacity: 1,
      position: 'relative',
    },
  });
