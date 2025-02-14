import React from 'react';
import { View, useTheme } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
export function Separator() {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return <View style={styles.separator}/>
}

export const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    image: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.background.val,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background.val,
      width: '90%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    headerText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    headerIcon: {
      fontSize: 24,
    },
    section: {
      marginBottom: 20,
      marginTop: 10,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
    },
    sectionContent: {
      backgroundColor: theme.section.val,
      borderRadius: 10,
      paddingLeft: 20,
      paddingRight: 20,
    },
    sectionTitle: {
      fontSize: 16,
      color: theme.gray9.val,
      marginVertical: 10,
      fontStyle: 'italic',
    },
    sectionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
      gap: 20,
    },
    sectionItemText: {
      fontSize: 16,
      color: theme.color.val,
    },
    separator: {
      height: 1,
      width: '100%',
      marginLeft: 45,
      backgroundColor: theme.gray5.val,
    },
    contentText: {
      fontSize: 16,
      textAlign: "right",
      color: theme.color.val,
      opacity: 0.4,
    },
})

export const coalesce = (a: string | undefined | null) => a ? a.length > 0 ? "@"+a : "Unspecified" : "Unspecified";
