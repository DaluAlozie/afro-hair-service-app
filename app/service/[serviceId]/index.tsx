import Style from '@/components/business/style/Style';
import { Service as ServiceProp, Style as StyleOptionProps } from '@/components/business/types';
import { Collapsible } from '@/components/utils';
import Pressable from '@/components/utils/Pressable';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Href, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, useTheme, XStack, Switch, View } from 'tamagui'
import confirm from '@/components/utils/Alerts/Confirm';
import Feather from '@expo/vector-icons/Feather';
import EditDescriptionModal from '@/components/business/service/modals/EditDescriptionModal';
import EditNameModal from '@/components/business/service/modals/EditNameModal';
import { makeContainerStyles, makeStyles } from '@/components/business/utils';
import { AntDesign } from '@expo/vector-icons';

export default function ServicePage() {
    const { serviceId } = useLocalSearchParams();

    const navigation = useNavigation();
    const services = useBusinessStore(state => state.services);
    const parsedId = parseInt(typeof serviceId === "string" ? serviceId : "-1");
    const service = services.get(parsedId);

    useEffect(() => {
        if (!service) {
            return;
        }
        const title = service.name.length < 20 ? service.name : "Service";
        navigation.setOptions({
            title: title + " Service",
        })
    }, [service])

    if (!service) {
        return null;
    }
    return (
        <ScrollView backgroundColor={"$background"} padding={20}>
            <Styles serviceId={parsedId} styles={service.styles ?? new Map()}/>
            <General service={service}/>
        </ScrollView>
  )
}

export function SectionTitle({ title }: { title: string }) {
    const theme = useTheme();
    return (
        <Text
            width={"93%"}
            color={theme.gray11Dark.val}
            fontWeight={"regular"}
            fontSize={16}
            fontStyle='italic'
        >
            {title}
        </Text>

    )
}

function Styles({ serviceId, styles }: { serviceId: number, styles: Map<number, StyleOptionProps> }) {
    const items =Array.from(styles.values());
    return (
        <>
        <View>
            <AddButton href={`/service/${serviceId}/addStyle`} text={"Add Style"}/>
            <Collapsible defaultOpen={true}
            header={<SectionTitle title={"Styles"}/>}>
                {useMemo(() => items.map((item) => (
                    <Style key={item.id} {...item}/>
                )),[items])}
            </Collapsible>
        </View>

        </>
    )
}

function General({ service }: { service: ServiceProp | null }) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const router = useRouter();
    const removeService = useBusinessStore(state => state.removeService);
    const enableService = useBusinessStore(state => state.enableService);
    const disableService = useBusinessStore(state => state.disableService);
    const  [nameModalOpen, setNameModalOpen] = useState(false);
    const  [openModalDescription, setOpenModalDescription] = useState(false);

    const openNameModal = useCallback(() => {
        setNameModalOpen(true);
        setOpenModalDescription(false);
    }, [])
    const openDescriptionModal = useCallback(() => {
        setOpenModalDescription(true);
        setNameModalOpen(false);
    }, [])
    const deleteService = useCallback(async () => {
        if (!service) return;
        await confirm(
            async () => {
                const { error } = await removeService(service.id);
                if (error) {
                    console.log(error);
                }
                router.dismissTo("/(business)/services");
            },
            "Delete Service",
            "Are you sure you want to delete this service?",
            "Delete",
            "Cancel",
            "destructive"
        );
    },[])
    if (!service) return null;
    return (
        <>
        <EditNameModal serviceId={service.id} open={nameModalOpen} setOpen={setNameModalOpen} />
        <EditDescriptionModal serviceId={service.id} open={openModalDescription} setOpen={setOpenModalDescription} />
        <View marginTop={50}>
            <SectionTitle title={"General"}/>
        </View>
        <View marginTop={30} style={styles.container}>
            <XStack style={styles.section}>
                <Text style={styles.title}>Service Title</Text>
                <ScrollView contentContainerStyle={styles.content}>
                    <Pressable
                    onPress={openNameModal}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center" }}
                        activeOpacity={0.7} scale={0.99}>
                    <Text style={[styles.contentText, { marginRight: 5 }]}>
                        {service.name}
                    </Text>
                    <Feather name="edit-3" size={16} color={theme.color.val}/>
                    </Pressable>
                </ScrollView>
            </XStack>
            <XStack style={styles.section}>
                <Text style={styles.title}>Service Description</Text>
                <ScrollView contentContainerStyle={styles.content}>
                    <Pressable
                    onPress={openDescriptionModal}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }} activeOpacity={0.7} scale={0.99}>
                    <Text style={[styles.contentText, { marginRight: 5 }]}>
                        {service.description}
                    </Text>
                    <Feather name="edit-3" size={16} color={theme.color.val}/>
                    </Pressable>
                </ScrollView>
            </XStack>
            <XStack style={styles.section}>
                <View>
                    <Text style={styles.title}>Enabled</Text>
                    <Text style={styles.enabledText}>
                        {service.enabled ? "Yes" : "No"}
                    </Text>
                </View>
                <Switch
                    defaultChecked={service.enabled} native
                    onCheckedChange={
                    async (checked) => checked ?
                        await enableService(service.id) :
                        await disableService(service.id)
                    }
                    >
                    <Switch.Thumb/>
                </Switch>
            </XStack>
            <View style={styles.deleteSection}>
                <Pressable activeOpacity={0.85} scale={0.999} onPress={deleteService}>
                    <Text
                        color={theme.danger.val}
                        fontWeight={"bold"}
                        fontSize={16}>
                        Delete Service
                    </Text>
                </Pressable>
            </View>
        </View>
        <View height={50}></View>

        </>
    )
}

type AddOnProps = {
    href: Href;
    text: string;
}
export function AddButton({ href, text }: AddOnProps) {
    const router = useRouter();
    const theme = useTheme();
    const styles = makeContainerStyles(theme);
    return (
        <Pressable
            onPress={() => router.push(href)}
            activeOpacity={0.85}
            scale={0.99}
            style={styles.addButton}
            pressedStyle={{ opacity: 0.7 }}

            >
            <XStack gap={2} alignItems='center' justifyContent='center'>
            <AntDesign name="plus" size={20} color={theme.secondaryAccent.val} />
            <Text style={styles.addButtonText}>{text}</Text>
            </XStack>
        </Pressable>
    )
}