import { UseThemeResult } from "@tamagui/core";
import { StyleSheet } from "react-native";

export const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    width: '100%',
    alignItems: "stretch",
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: theme.section.val,
    margin: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 15,
    opacity: 0.7
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: '100%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.gray5.val,
  },
  content: {
    alignSelf: 'flex-end',
    width: '70%',
    justifyContent: "flex-end",
  },
  contentText: {
    fontSize: 15,
    textAlign: "right",
    fontWeight: "bold",
    textOverflow: "ellipsis",
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export const makeContainerStyles = (theme: UseThemeResult) =>
    StyleSheet.create({
      container: {
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        paddingTop: 20,
      },
      addButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        height: 50,
        justifyContent: 'center',
        backgroundColor: theme.section.val,
        width: '100%',
        borderRadius: 10,
        marginVertical: 20,
      },
});