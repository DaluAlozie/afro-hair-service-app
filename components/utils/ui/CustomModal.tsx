import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme, UseThemeResult } from '@tamagui/core';

interface ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const CustomModal = ({ visible, onRequestClose, children }: ModalProps) => {
    const [modalVisible, setModalVisible] = useState(visible);
    const opacity = useSharedValue(0);
    const theme = useTheme();
    const styles = makeStyles(theme);

    useEffect(() => {
        if (visible) {
        setModalVisible(true);
        opacity.value = withTiming(1, { duration: 300 });
        } else {
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
            if (finished) {
            runOnJS(setModalVisible)(false);
            }
        });
        }
    }, [visible, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (!modalVisible) return null;

    return (
        <TouchableWithoutFeedback onPress={onRequestClose}>
        <Animated.View style={[styles.backdrop, animatedStyle]}>
            <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
                {children}
            </View>
            </TouchableWithoutFeedback>
        </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.background.val+'90',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the modal overlays other content
  },
  modalContent: {
    borderRadius: 10,
    alignSelf: 'center',
    // Customize further as needed
  },
});

export default CustomModal;
