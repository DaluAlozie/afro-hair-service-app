import React from 'react'
import { Switch, useTheme, XStack, View, Text } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import Pressable from '@/components/utils/Pressable'
import Entypo from '@expo/vector-icons/Entypo'
import OnlineIcon from '@/assets/icons/online'
import { useBusinessStore } from '@/utils/stores/businessStore'
import { useRouter } from 'expo-router'
import notify from '@/components/utils/Alerts/Notify'
import { makeStyles, Separator } from './utils'
import { FontAwesome6 } from '@expo/vector-icons'

export default function Operations() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const router = useRouter();

  const activateBusiness = useBusinessStore(state => state.activateBusiness);
  const deactivateBusiness = useBusinessStore(state => state.deactivateBusiness);
  const online = useBusinessStore(state => state.online);

  return (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operations</Text>
        <View style={styles.sectionContent}>
            <Pressable style={styles.sectionItem} scale={0.99} activeOpacity={0.7} onPress={() => router.push('/myBusiness/tags')}>
                <XStack style={styles.sectionHeader}>
                <FontAwesome6 name="tag" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Business Tags</Text>
                </XStack>
                <Ionicons color={theme.color.val} name="chevron-forward" style={styles.headerIcon}/>
            </Pressable>
            <Separator/>
            <Pressable style={styles.sectionItem} scale={0.99} activeOpacity={0.7} onPress={() => router.push('/myBusiness/locations')}>
                <XStack style={styles.sectionHeader}>
                <Entypo name="location" size={24} color={theme.color.val} />
                <Text style={styles.sectionItemText}>Business Locations</Text>
                </XStack>
                <Ionicons color={theme.color.val} name="chevron-forward" style={styles.headerIcon}/>
            </Pressable>
            <Separator/>
            <Pressable style={styles.sectionItem} scale={0.99} activeOpacity={0.7} onPress={() => router.push('/myBusiness/availability')}>
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
                <Text style={styles.sectionItemText}>{online? "Deactivate" : "Activate"} Business</Text>
                </XStack>
                <Switch
                defaultChecked={online}
                native
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
  )
}