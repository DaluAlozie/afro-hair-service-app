import { useBusinessStore } from '@/utils/stores/businessStore'
import React, { useState } from 'react'
import { useTheme, View, Text, ScrollView, Input, XStack } from 'tamagui'
import { StyleSheet } from 'react-native'
import { UseThemeResult } from '@tamagui/core'
import Pressable from '@/components/utils/Pressable'
import confirm from '@/components/utils/Alerts/Confirm'
import { Entypo } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import { useAnimatedShake } from '@/hooks/useAnimatedShake'

export default function Tags() {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const tags = useBusinessStore(state => state.tags);
    const addTag = useBusinessStore(state => state.addTag);
    const { shake, rStyle } = useAnimatedShake();
    const [newTag, setNewTag] = useState('');

    const addNewTag = async () => {
        if (newTag.trim() === '') {
            shake();
            return
        };
        if (tags.includes(newTag.toLowerCase())) {
            shake();
            return
        };
        const { error } = await addTag(newTag.toLowerCase().trim());
        if (error) {
            console.log(error);
            return;
        }
        setNewTag('');
    }

    return (
        <View
            width={"100%"}
            height={"100%"}
            alignItems="center"
            justifyContent='center'
            alignSelf='center'
            backgroundColor={theme.background.val}>
            <XStack gap={20} width={"95%"} height={80} alignItems="center" justifyContent='space-between'>
                <Animated.View style={[{ width: "80%" },rStyle]}>
                    <Input
                        style={{ height: 50, borderRadius: 100 }}
                        borderRadius={100}
                        value={newTag}
                        onChangeText={setNewTag}
                        placeholder="Add a tag"
                    />
                </Animated.View>
                <Pressable onPress={addNewTag} style={styles.addButton} pressedStyle={{ opacity: 0.8 }}>
                    <Entypo name="plus" size={24} color={theme.white1.val} />
                </Pressable>
            </XStack>
            <ScrollView style={{ width:"95%" }} contentContainerStyle={styles.container}>
                {tags.map(tag => (
                    <Tag key={tag} tag={tag} />
                ))}
            </ScrollView>

        </View>
    )
}

const Tag = ({ tag }: { tag: string }) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const removeTag = useBusinessStore(state => state.removeTag);
    const deleteTag = () => {
        confirm(
            () => removeTag(tag),
            "Remove Tag",
            `Are you sure you want to remove the tag ${tag}?`,
            "Delete",
            "Cancel",
            "destructive",
        )
    }

    return (
        <View style={styles.tag}>
            <Pressable onPress={deleteTag} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <XStack marginHorizontal={10} alignItems="center">
                    <Text style={styles.tagText}>{tag}</Text>
                    <View opacity={0.5}>
                        <Text color={theme.color.val}>✕</Text>
                    </View>
                </XStack>
            </Pressable>
        </View>
    )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        width: '100%',
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    tag: {
        borderRadius: 100,
        backgroundColor: theme.section.val,
        width: 'auto',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagText: {
        color: theme.white1.val,
        justifyContent: 'center',
        alignItems: 'center',
        height: "auto",
        fontSize: 16,
        alignSelf: 'center',
        fontWeight: "bold",
        marginHorizontal: 6,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: theme.accent.val,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
