import { Modal } from '@/components/utils/ui/Modal'
import React, { useState } from 'react'
import { useTheme, View, XStack, Text } from 'tamagui'
import { Image } from 'expo-image';
import emptyProfile from '@/assets/images/empty-profile.png';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { useBusinessStore } from '@/utils/stores/businessStore';
import ImageCrop from './ImageCrop';
import SubmitButton from '@/components/utils/form/SubmitButton';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import notify from '@/components/utils/Alerts/Notify';
import Pressable from '@/components/utils/Pressable';
import confirm from '@/components/utils/Alerts/Confirm';
import { normalise } from './ImageCrop';

// Maximum file size of 10MB
const sizeLimit = 10000000;

export default function EditProfilePictureModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
    const theme = useTheme();
    const styles = makeStyles();
    const { width } = useWindowDimensions();
    const size = normalise(width);
    const profilePicture = useBusinessStore(state => state.profilePicture);
    const uploadProfilePicture = useBusinessStore(state => state.uploadProfilePicture);
    const removeProfilePicture = useBusinessStore(state => state.removeProfilePicture);
    const [image, setImage] = useState<string | null>(profilePicture);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async () => {
        setIsUploading(true);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true, // Ensure the result contains base64 data
        });

        if (result.canceled) {
            setIsUploading(false);
            return;
        }
        const img = result.assets[0];
        // Convert to a displayable URI format
        const imageUri = `data:image/png;base64,${img.base64}`;
        if (img.fileSize && img.fileSize > sizeLimit) {
            setIsUploading(false);
            setError("Image size exceeds 10MB");
            return;
        } else {
            setError(null);
        }
        setImage(imageUri);
        setIsUploading(false);
        setIsEditing(true);
    };
    const save = async () => {
        if (image === null) return;
        setIsSaving(true);
        const base64 = image.split(",")[1];
        const { error } = await uploadProfilePicture(base64);
        setIsSaving(false);
        if (error) {
            console.log(error);
        }
        else {
            notify("Profile picture updated", "It may take a few minutes for the changes to reflect");
            setOpen(false);
            setImage(profilePicture);
            setIsEditing(false);
        }
    };

    const deleteProfilePicture = async () => {
        confirm(
            async () => {
                const { error } = await removeProfilePicture();
                if (error) {
                    console.log(error);
                }
                else {
                    notify("Profile picture removed", "It may take a few minutes for the changes to reflect");
                    setOpen(false);
                    setImage(null);
                    setIsEditing(false);
                }
            },
            "Remove Profile Picture",
            "Are you sure you want to remove your profile picture ?",
            "Remove",
            "Cancel",
            "destructive"
        );

    }
    return (
        <Modal open={open} setOpen={(value: boolean) => {
            setOpen(value);
            if (!value) {
                setImage(profilePicture);
                setIsEditing(false);
                setIsSaving(false);
                setIsUploading(false);
            }
        }}>
                <ScrollView
                    contentContainerStyle={{
                        height: "auto",
                        width: size,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        gap: 10,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableWithoutFeedback>
                    <View justifyContent='center' alignItems='center' gap={20} width={"100%"} marginVertical={20}>
                        <Text fontSize={20} fontWeight='bold' alignSelf='center'>Edit Profile Picture</Text>

                        <View height={size} width={size} position='relative' overflow='hidden' marginVertical={20} borderRadius={10}>
                            <ImageCrop />
                            <Image
                                style={styles.image}
                                source={image ? { uri: image}: emptyProfile}
                                contentFit="cover"
                                transition={400}
                                />
                        </View>

                        <Text color={theme.danger.val}>{error}</Text>
                        <View width={"100%"}>
                            <SubmitButton
                                onPress={save}
                                isSubmitting={isSaving}
                                disabled={!isEditing}

                            >
                                Save
                            </SubmitButton>
                        </View>
                        <View width={"100%"}>
                            <SubmitButton
                                onPress={upload}
                                isSubmitting={isUploading}
                                style={{ backgroundColor: theme.white1.val }}
                            >
                                <XStack gap={10}>
                                    <Text color={theme.black1.val} marginTop={2}>Upload</Text>
                                    <FontAwesome6 name="upload" size={20} color={theme.black1.val} />
                                </XStack>
                            </SubmitButton>
                        </View>
                        <Pressable
                            activeOpacity={0.7}
                            style={{ height: 30, opacity: (isSaving || isUploading || isEditing || image === null) ? 0.6 : 1 }}
                            onPress={deleteProfilePicture}
                            disabled={isSaving || isUploading || isEditing || image === null}>
                            <Text color={theme.danger.val} fontSize={14} fontWeight={"bold"}>Remove Picture</Text>
                        </Pressable>
                    </View>
                    </TouchableWithoutFeedback>

                </ScrollView>
        </Modal>
    )
}

const makeStyles = () => StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: 'transparent',
      },
});