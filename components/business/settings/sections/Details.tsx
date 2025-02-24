import React, { useState } from 'react'
import { useTheme, XStack, View } from 'tamagui'
import { Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Pressable from '@/components/utils/Pressable'
import { useBusinessStore } from '@/utils/stores/businessStore'
import Feather from '@expo/vector-icons/Feather'
import EditNameModal from '@/components/settings/modals/EditBusinessNameModal'
import EditDescModal from '@/components/settings/modals/EditBusinessDescriptionModal'
import EditPhoneNumberModal from '@/components/settings/modals/EditPhoneNumberModal'
import { makeStyles, Separator } from './utils'

export default function Details() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const businessName = useBusinessStore(state => state.name);
  const businessDescription = useBusinessStore(state => state.description);
  const phone = useBusinessStore(state => state.phoneNumber);

  const [businessNameModalOpen, setBusinessNameModalOpen] = useState(false);
  const [businessDescModalOpen, setBusinessDescModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  return (
      <>
        <EditNameModal
          open={businessNameModalOpen}
          setOpen={setBusinessNameModalOpen}
        />
        <EditDescModal
          open={businessDescModalOpen}
          setOpen={setBusinessDescModalOpen}
        />
        <EditPhoneNumberModal
          open={phoneModalOpen}
          setOpen={setPhoneModalOpen}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Info</Text>
          <View style={styles.sectionContent}>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <Ionicons name="business" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Name</Text>
              </XStack>
              <XStack>
                <Pressable
                onPress={() => setBusinessNameModalOpen(true)}
                style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
                  <Text style={styles.contentText} numberOfLines={2}>
                      {businessName}
                  </Text>
                  <Feather name="edit-3" size={16} color={theme.color.val}/>
                </Pressable>
              </XStack>
            </View>
            <Separator/>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <Ionicons name="document-text" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Description</Text>
              </XStack>
              <XStack>
                <Pressable
                onPress={() => setBusinessDescModalOpen(true)}
                style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
                  <Text style={styles.contentText} numberOfLines={2}>
                      {businessDescription}
                  </Text>
                  <Feather name="edit-3" size={16} color={theme.color.val}/>
                </Pressable>
              </XStack>
            </View>
            <Separator/>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <Ionicons name="call" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Contact Number</Text>
              </XStack>
              <XStack>
                <Pressable
                onPress={() => setPhoneModalOpen(true)}
                style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
                  <Text style={[styles.contentText, { fontSize: 15 }]} numberOfLines={1}>
                      {phone}
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

