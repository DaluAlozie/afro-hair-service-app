import ServiceOption from '@/components/business/serviceOption/ServiceOption';
import { Service as ServiceProp, ServiceOption as ServiceOptionProps } from '@/components/business/types';
import { Collapsible } from '@/components/utils';
import Pressable from '@/components/utils/Pressable';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react'
import { ScrollView, View, Text, useTheme, XStack, YStack, Switch } from 'tamagui'
import { UseThemeResult } from '@tamagui/web'
import { StyleSheet } from 'react-native'
import confirm from '@/components/utils/Alerts/Confirm';
import Feather from '@expo/vector-icons/Feather';
import EditDescriptionModal from '@/components/business/service/modals/EditDescriptionModal';
import EditNameModal from '@/components/business/service/modals/EditNameModal';

export default function ServicePage() {
    const { serviceId } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const navigation = useNavigation();
    const services = useBusinessStore(state => state.services);
    const [service, setService] = useState<ServiceProp | null>(null);

    const onLayout = useCallback(() => {
        if (typeof serviceId !== "string" || isNaN(parseInt("99191ss"))) {
            router.dismissTo("/(business)/services");
            return null
        }
        const service = services.get(parseInt(serviceId));
        if (!service) {
            router.dismissTo("/(business)/services");
            return null
        }
        setService(service);
        if (!service) {
            router.dismissTo("/(business)/services");
            return null
        }
        const title = service.title.length < 20 ? service.title : "Service";
        navigation.setOptions({
            title: title + " Service",
        })
    }, [serviceId])

    return (
        <ScrollView
            onLayout={onLayout}
            style={{ flex: 1, backgroundColor: theme.background.val }}
            contentContainerStyle={{ paddingTop: 20, gap: 120 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            {service && (
                <>
                <ServiceOptions serviceId={service.id} serviceOptions={service.service_options} />
                <General service={service} />
                </>
            )}
        </ScrollView>
  )
}

function SectionTitle({ title }: { title: string }) {
    const theme = useTheme();
    return (
        <View>
            <Text
                color={theme.gray11Dark.val}
                fontWeight={"regular"}
                fontSize={16}
                fontStyle='italic'
            >
                {title}
            </Text>
             <View
                width={"100%"}
                height={1}
                backgroundColor={theme.gray8.val}
                alignSelf='center'
                borderRadius={100}
                marginVertical={10}
                />
        </View>
    )
}

function ServiceOptions({ serviceId, serviceOptions }: { serviceId: number, serviceOptions: Map<number, ServiceOptionProps> }) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const router = useRouter();
    const items =Array.from(serviceOptions.values());
    return (
        <>
        <View style={styles.section}>
            <SectionTitle title={"Service Options"} />
            <Collapsible defaultOpen={true} >
                {items.map((item) => (
                    <ServiceOption key={item.id} {...item}/>
                ))}
            </Collapsible>
            <Pressable
                onPress={() => router.push(`/service/${serviceId}/addServiceOption`)}
                activeOpacity={0.85}
                scale={0.99}
                style={styles.addButton}
                pressedStyle={{ backgroundColor: theme.onPressStyle.val }}

                >
                <Text>Add Service Option</Text>
            </Pressable>
        </View>

        </>
    )
}

function General({ service }: { service: ServiceProp }) {
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
    return (
        <>
        <EditNameModal serviceId={service.id} open={nameModalOpen} setOpen={setNameModalOpen} />
        <EditDescriptionModal serviceId={service.id} open={openModalDescription} setOpen={setOpenModalDescription} />
        <YStack style={styles.section} gap={20}>
            <SectionTitle title={"General"}/>
            <XStack style={styles.generalSection}>
                <Text style={styles.generalTitle}>Service Title</Text>
                <ScrollView contentContainerStyle={styles.content}>
                    <Pressable
                    onPress={openNameModal}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center" }}
                        activeOpacity={0.7} scale={0.99}>
                    <Text style={[styles.contentText, { marginRight: 2 }]}>
                        {service.title}
                    </Text>
                    <Feather name="edit-3" size={12} color={theme.color.val}/>
                    </Pressable>
                </ScrollView>
            </XStack>
            <XStack style={styles.generalSection}>
                <Text style={styles.generalTitle}>Service Description</Text>
                <ScrollView contentContainerStyle={styles.content}>
                    <Pressable
                    onPress={openDescriptionModal}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }} activeOpacity={0.7} scale={0.99}>
                    <Text style={[styles.contentText, { marginRight: 2 }]}>
                        {service.description}
                    </Text>
                    <Feather name="edit-3" size={12} color={theme.color.val}/>
                    </Pressable>
                </ScrollView>
            </XStack>
            <XStack style={styles.generalSection}>
                <Text style={styles.generalTitle}>Enabled</Text>
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
            <Pressable activeOpacity={0.85} scale={0.999} onPress={deleteService}>
                <Text
                    color={theme.danger.val}
                    fontWeight={"bold"}
                    fontSize={16}>
                    Delete Service
                </Text>
            </Pressable>
        </YStack>
        </>
    )
}
const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    addButton: {
        flexDirection: "row",
        alignSelf: "center",
        height: 50,
        justifyContent: "center",
        backgroundColor: theme.section.val,
        width: "100%",
        borderRadius: 10,
        marginVertical: 20
    },
    section: {
        width: "90%",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 30,
        height: "auto",
    },
    pressedStyle: {
        backgroundColor: theme.onPressStyle.val
    },
    content: {
    },
    contentText: {
    },
    generalSection: {
        backgroundColor: theme.section.val,
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    generalTitle: {
        color: theme.gray11Dark.val,
        fontWeight: "regular",
        fontSize: 16,
        fontStyle: "italic",
    }
})