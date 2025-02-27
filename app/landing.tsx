import AnonWrapper from '@/components/auth/AnonWrapper'
import Pressable from '@/components/utils/Pressable'
import React from 'react'
import { useTheme, View, Text } from 'tamagui'
import logo from '@/assets/logo/crownLogoSplashScreen.png'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'

export default function Landing() {
    const theme = useTheme();
    const router = useRouter();
    return (
        <AnonWrapper>
            <View flex={1} bg={theme.accent.val} justifyContent='center' alignItems='center'>
                <Image
                    source={logo}
                    contentFit='contain'
                    style={{ width: "70%", height: 200, maxWidth: 400,  marginBottom: 50, marginRight: 5 }}
                    />
                <View position='absolute' width={"100%"} bottom={40} justifyContent='center' alignItems='center'>
                    <View style={{
                         width: "65%",
                         maxWidth: 400,
                         height: 70
                         }}>
                        <Pressable style={{
                            width: "100%",
                            height: "80%",
                            backgroundColor: theme.white1.val,
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                        }} onPress={() => router.push("/signUp")}>
                            <Text style={{
                                color: theme.black1.val,
                                fontSize: 16,
                                fontWeight: "bold",
                            }}>
                                Get Started
                            </Text>
                        </Pressable>
                        <View width={"100%"} justifyContent='center' alignItems='center' marginTop={5}>
                            <Link href={"/login"} style={{
                                marginTop: 5,
                                color: theme.white1.val,
                                fontSize: 14,
                                opacity: 0.8,
                                textDecorationLine: "underline",
                            }}>
                                Log in
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        </AnonWrapper>
    )
}
