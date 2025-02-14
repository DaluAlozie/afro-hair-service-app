import React, { useState } from 'react'
import { ScrollView, useTheme, XStack, View } from 'tamagui'
import { Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Pressable from '@/components/utils/Pressable'
import { useBusinessStore } from '@/utils/stores/businessStore'
import Feather from '@expo/vector-icons/Feather'
import EditTwitterModal from '@/components/settings/modals/EditTwitterModal'
import EditFacebookModal from '@/components/settings/modals/EditFacebookModal'
import EditInstagramModal from '@/components/settings/modals/EditInstagramModal'
import { coalesce, makeStyles, Separator } from './utils'


export default function Socials() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const twitter = useBusinessStore(state => state.twitter);
  const facebook = useBusinessStore(state => state.facebook);
  const instagram = useBusinessStore(state => state.instagram);

  const [twitterModalOpen, setTwitterModalOpen] = useState(false);
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);

  return (
    <>
    <EditTwitterModal
      open={twitterModalOpen}
      setOpen={setTwitterModalOpen}
    />
    <EditFacebookModal
      open={facebookModalOpen}
      setOpen={setFacebookModalOpen}
    />
    <EditInstagramModal
      open={instagramModalOpen}
      setOpen={setInstagramModalOpen}
    />

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Socials</Text>
      <View style={styles.sectionContent}>
        <View style={styles.sectionItem}>
          <XStack style={styles.sectionHeader}>
            <Ionicons name="logo-facebook" size={24} color={theme.color.val} />
            <Text style={styles.sectionItemText}>Facebook</Text>
          </XStack>
          <ScrollView contentContainerStyle={styles.sectionItem}>
            <Pressable
            onPress={() => setFacebookModalOpen(true)}
            style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={[styles.contentText, { marginRight: 10 }]}>
                  {coalesce(facebook)}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
            </Pressable>
          </ScrollView>
        </View>
        <Separator/>
        <View style={styles.sectionItem}>
          <XStack style={styles.sectionHeader}>
            <Ionicons name="logo-instagram" size={24} color={theme.color.val} />
            <Text style={styles.sectionItemText}>Instagram</Text>
          </XStack>
          <ScrollView contentContainerStyle={styles.sectionItem}>
            <Pressable
            onPress={() => setInstagramModalOpen(true)}
            style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={[styles.contentText, { marginRight: 10 }]}>
                  {coalesce(instagram)}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
            </Pressable>
          </ScrollView>
        </View>
        <Separator/>
        <View style={styles.sectionItem}>
          <XStack style={styles.sectionHeader}>
            <Ionicons name="logo-twitter" size={24} color={theme.color.val} />
            <Text style={styles.sectionItemText}>Twitter</Text>
          </XStack>
          <ScrollView contentContainerStyle={styles.sectionItem}>
            <Pressable
            onPress={() => setTwitterModalOpen(true)}
            style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={[styles.contentText, { marginRight: 10 }]}>
                  {coalesce(twitter)}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </View>
    </>
  )
}
