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

type BusinessWrapperProps = {
  children: React.ReactNode,
  suspense?: React.ReactNode | undefined,
  loading?: boolean | undefined
}
export default function BusinessWrapper({
  children,
  suspense = <></>,
}: BusinessWrapperProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const hasBusiness = useBusinessStore((state) => state.hasBusiness)
    const loading = useBusinessStore((state) => state.loading)
    return (
      <AuthWrapper>
        <ThemedView style={styles.container}>
            {
              loading ? suspense :
                hasBusiness ?
                  children : (
                    <>
                      <NoBusinessIcon color={theme.gray3.val} size={300}/>
                      <Link style={styles.link} href={'/business/createBusiness'}>
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