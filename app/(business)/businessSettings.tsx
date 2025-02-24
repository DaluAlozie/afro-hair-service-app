import BusinessWrapper from '@/components/business/BusinessWrapper'
import React from 'react'
import { ScrollView, useTheme, View } from 'tamagui'
import Details from '@/components/business/settings/sections/Details'
import Operations from '@/components/business/settings/sections/Operations'
import Socials from '@/components/business/settings/sections/Socials'
import ProfilePicture from '@/components/business/settings/sections/ProfilePicture'
import { makeStyles } from '@/components/business/settings/sections/utils'
import { useBusinessStore } from '@/utils/stores/businessStore'


export default function BusinessSettings() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const loadingProfilePicture = useBusinessStore((state) => state.loadingProfilePicture)
  const loadingBusiness = useBusinessStore((state) => state.loadingBusiness)

  return (
    <BusinessWrapper loading={loadingProfilePicture || loadingBusiness}>
      <ScrollView gap={60} style={styles.container} showsVerticalScrollIndicator={false} paddingTop={20}>
        <ProfilePicture/>
        <Socials/>
        <Operations/>
        <Details/>
        <View marginBottom={40}/>
      </ScrollView>
    </BusinessWrapper>
  )
}