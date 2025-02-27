import NoBusinessIcon from '@/assets/icons/no_business_icon'
import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedView } from '@/components/utils'
import React from 'react'
import { useTheme } from 'tamagui';
import { UseThemeResult } from '@tamagui/web';
import { StyleSheet } from 'react-native';
import { useBusinessStore } from '@/utils/stores/businessStore';

import { Text } from 'react-native';
import Link from '../utils/Link';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import PageSpinner from '../utils/loading/PageSpinner';

type BusinessWrapperProps = {
  children: React.ReactNode,
  suspense?: React.ReactNode | undefined,
  loading: boolean
}
export default function BusinessWrapper({
  children,
  loading,
  suspense

}: BusinessWrapperProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const hasBusiness = useBusinessStore((state) => state.hasBusiness)
    const scheme = useColorScheme();
    return (
      <AuthWrapper>
        <ThemedView style={styles.container}>
            {
              loading ? ( suspense || <PageSpinner /> ) :
                hasBusiness ?
                  children : (
                    <>
                      <NoBusinessIcon color={scheme === "dark"?theme.gray1Dark.val:theme.gray5.val} size={300}/>
                      <Link style={styles.link} href={'/myBusiness/createBusiness'}>
                        <Text style={styles.link}>Start your Business</Text>
                      </Link>
                    </>
                  )
              }
        </ThemedView>
      </AuthWrapper>
    )
  }

  const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background.val
    },
    link: {
      height: 50,
      width: "auto",
      color: theme.linkBlue.val,
      fontSize: 22,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      marginTop: 10,
      marginBottom: 40
    }
  })