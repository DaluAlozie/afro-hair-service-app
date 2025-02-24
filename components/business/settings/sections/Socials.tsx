import React, { useState } from 'react'
import { XStack, useTheme, View } from 'tamagui'
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
          <XStack>
            <Pressable
            onPress={() => setFacebookModalOpen(true)}
            style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={styles.contentText} numberOfLines={2}>
                  {coalesce(facebook)}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
            </Pressable>
          </XStack>
        </View>
        <Separator/>
        <View style={styles.sectionItem}>
          <XStack style={styles.sectionHeader}>
            <Ionicons name="logo-instagram" size={24} color={theme.color.val} />
            <Text style={styles.sectionItemText}>Instagram</Text>
          </XStack>
          <XStack>
            <Pressable
            onPress={() => setInstagramModalOpen(true)}
            style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={styles.contentText} numberOfLines={2}>
                  {coalesce(instagram)}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
            </Pressable>
          </XStack>
        </View>
        <Separator/>
        <View style={styles.sectionItem}>
          <XStack style={styles.sectionHeader}>
            <Ionicons name="logo-twitter" size={24} color={theme.color.val} />
            <Text style={styles.sectionItemText}>Twitter</Text>
          </XStack>
          <XStack>
            <Pressable
            onPress={() => setTwitterModalOpen(true)}
            style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={styles.contentText} numberOfLines={2}>
                  {coalesce(twitter)}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
            </Pressable>
          </XStack>
        </View>
      </View>
    </View>
    </>
  )
}
