import React, { useState } from 'react'
import { useTheme, XStack, View } from 'tamagui'
import {  Text } from 'react-native'
import Pressable from '@/components/utils/Pressable'
import { useBusinessStore } from '@/utils/stores/businessStore'
import Feather from '@expo/vector-icons/Feather'
import { Image } from 'expo-image';
import emptyProfile from '@/assets/images/empty-profile.png';
import EditProfilePictureModal from '@/components/business/settings/EditProfilePictureModal'
import { makeStyles } from './utils'

const blurHash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ProfilePicture() {
    const theme = useTheme();
    const styles = makeStyles(theme);

    const profilePicture = useBusinessStore(state => state.profilePicture);

    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);
    return (
        <>
        <EditProfilePictureModal
            open={profilePictureModalOpen}
            setOpen={setProfilePictureModalOpen}
        />
        <View width="100%" justifyContent='center' alignItems='center'>
            <View
                height={250}
                width={250}
                position='relative'
                overflow='hidden'
                borderRadius={125}
                marginVertical={20}
                borderWidth={3}
                borderColor={theme.accent.val}>
                <Image
                    style={styles.image}
                    source={profilePicture ? { uri: profilePicture } : emptyProfile}
                    contentFit="cover"
                    transition={400}
                    placeholder={{ blurHash }}
                    />
                <View
                    position='absolute'
                    width="100%"
                    height={"25%"}
                    top={"75%"}
                    right={0}
                    backgroundColor={theme.accent.val+"99"}
                    zIndex={1}
                    opacity={0.9}>
                    <XStack width={"100%"} alignSelf='center' justifyContent='center' alignItems='center' height={50} gap={40}>
                    <Pressable onPress={() => setProfilePictureModalOpen(true)} activeOpacity={0.7} scale={0.99} style={{width: "100%"}}>
                        <XStack gap={5} height={"100%"} justifyContent='center' alignItems='center'>
                        <Text style={{fontSize: 16, color: theme.white1.val, fontWeight: 600 }}>Edit Profile</Text>
                        <Feather name="edit-3" size={16} color={theme.white1.val}/>
                        </XStack>
                    </Pressable>
                    </XStack>
                </View>
            </View>
        </View>
    </>
  )
}
