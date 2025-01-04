import BusinessWrapper from '@/components/business/BusinessWrapper'
import React, { useState } from 'react'
import { ScrollView, Switch, useTheme, XStack } from 'tamagui'
import { StyleSheet, Text, View } from 'react-native'
import { UseThemeResult } from '@tamagui/core'
import Ionicons from '@expo/vector-icons/Ionicons'
import Pressable from '@/components/utils/Pressable'
import Entypo from '@expo/vector-icons/Entypo'
import OnlineIcon from '@/assets/icons/online'
import { useBusinessStore } from '@/utils/stores/businessStore'
import { useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import EditNameModal from '@/components/settings/modals/EditBusinessNameModal'
import EditDescModal from '@/components/settings/modals/EditBusinessDescriptionModal'
import EditPhoneNumberModal from '@/components/settings/modals/EditPhoneNumberModal'
import EditTwitterModal from '@/components/settings/modals/EditTwitterModal'
import EditFacebookModal from '@/components/settings/modals/EditFacebookModal'
import EditInstagramModal from '@/components/settings/modals/EditInstagramModal'
import notify from '@/components/utils/Alerts/Notify'

const coalesce = (a: string | undefined | null) => a ? a.length > 0 ? a : "Unspecified" : "Unspecified";

export default function BusinessSettings() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const activateBusiness = useBusinessStore(state => state.activateBusiness);
  const deactivateBusiness = useBusinessStore(state => state.deactivateBusiness);

  const businessName = useBusinessStore(state => state.name);
  const businessDescription = useBusinessStore(state => state.description);
  const phone = useBusinessStore(state => state.phoneNumber);

  const twitter = useBusinessStore(state => state.twitter);
  const facebook = useBusinessStore(state => state.facebook);
  const instagram = useBusinessStore(state => state.instagram);

  const [businessNameModalOpen, setBusinessNameModalOpen] = useState(false);
  const [businessDescModalOpen, setBusinessDescModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  const [twitterModalOpen, setTwitterModalOpen] = useState(false);
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);

  const router = useRouter();

  return (
    <BusinessWrapper>
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
      </>
      <ScrollView gap={60} style={styles.container}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operations</Text>
          <View style={styles.sectionContent}>
            <Pressable style={styles.sectionItem} scale={0.99} activeOpacity={0.7} onPress={() => router.push('/business/locations')}>
              <XStack style={styles.sectionHeader}>
                <Entypo name="location" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Business Locations</Text>
              </XStack>
              <Ionicons color={theme.color.val} name="chevron-forward" style={styles.headerIcon}/>
            </Pressable>
            <Separator/>
            <Pressable style={styles.sectionItem} scale={0.99} activeOpacity={0.7} onPress={() => router.push('/business/availability')}>
              <XStack style={styles.sectionHeader}>
                <Entypo name="calendar" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Edit Availability</Text>
              </XStack>
              <Ionicons color={theme.color.val} name="chevron-forward" style={styles.headerIcon}/>
            </Pressable>
            <Separator/>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <OnlineIcon size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Activate Business</Text>
              </XStack>
              <Switch
                defaultChecked={true} native
                onCheckedChange={
                  async (checked) => {
                    if (checked) {
                      await activateBusiness();
                      notify("Business Online", "Your business is now online");
                    }
                    else {
                      await deactivateBusiness();
                      notify("Business Offline", "\nExisting appointments will not be affected");
                    };
                  }
                }>
                <Switch.Thumb/>
              </Switch>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Info</Text>
          <View style={styles.sectionContent}>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <Ionicons name="business" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Name</Text>
              </XStack>
              <ScrollView contentContainerStyle={styles.sectionItem}>
                <Pressable
                onPress={() => setBusinessNameModalOpen(true)}
                style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
                  <Text style={[styles.contentText, { marginRight: 10 }]}>
                      {businessName}
                  </Text>
                  <Feather name="edit-3" size={16} color={theme.color.val}/>
                </Pressable>
              </ScrollView>
            </View>
            <Separator/>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <Ionicons name="document-text" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Description</Text>
              </XStack>
              <ScrollView contentContainerStyle={styles.sectionItem}>
                <Pressable
                onPress={() => setBusinessDescModalOpen(true)}
                style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
                  <Text style={[styles.contentText, { marginRight: 10 }]}>
                      {businessDescription}
                  </Text>
                  <Feather name="edit-3" size={16} color={theme.color.val}/>
                </Pressable>
              </ScrollView>
            </View>
            <Separator/>
            <View style={styles.sectionItem}>
              <XStack style={styles.sectionHeader}>
                <Ionicons name="call" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Contact Number</Text>
              </XStack>
              <ScrollView contentContainerStyle={styles.sectionItem}>
                <Pressable
                onPress={() => setPhoneModalOpen(true)}
                style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
                  <Text style={[styles.contentText, { marginRight: 10 }]}>
                      {coalesce(phone)}
                  </Text>
                  <Feather name="edit-3" size={16} color={theme.color.val}/>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </BusinessWrapper>
  )
}

function Separator() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return <View style={styles.separator}/>
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
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