import { Alert } from "react-native";

export default async function confirm(
  yes: () => void | Promise<unknown>,
  title: string,
  message: string,
  yesText = "Yes",
  noText = "Cancel",
  yesStyle: "default" | "cancel" | "destructive" | undefined,) {
    Alert.alert(title, message, [
        {
          text: noText,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: yesText,
          onPress: yes,
          style: yesStyle,
        },
      ]);

}
