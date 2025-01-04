import { Alert } from 'react-native';

function notify( title: string, message: string, buttonText = 'OK') {
    Alert.alert(
        title,
        message,
        [
            {
                text: buttonText,
            },
        ],
        { cancelable: true }
    );
};

export default notify;