import { UseThemeResult } from "@tamagui/core";
import { StyleSheet } from "react-native";

export const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    width: '100%',
    alignItems: "stretch",
    paddingLeft: 20,
    backgroundColor: theme.background.val,
    borderLeftWidth: 5,
    borderColor: theme.accent.val,
    marginTop: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: '100%',
  },
  deleteSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: '100%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.background.val,
  },
  content: {
    alignSelf: 'flex-end',
    width: '70%',
    justifyContent: "flex-end",
  },
  contentText: {
    fontSize: 16,
    textAlign: "right",
    opacity: 0.7,
    textOverflow: "ellipsis",
  },
  enabledText: {
    marginTop: 5,
    opacity: 0.4,
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
        alignSelf: 'flex-end',
        height: 50,
        justifyContent: 'flex-end',
        backgroundColor: theme.background.val,
        borderRadius: 100,
      },
      addButtonText: {
        color: theme.color.val,
        fontSize: 16,
      },
});