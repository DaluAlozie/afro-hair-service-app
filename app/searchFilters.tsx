import AuthWrapper from '@/components/auth/AuthWrapper'
import React from 'react'
import { View, Text, RadioGroup, ScrollView } from 'tamagui'
import { useTheme, UseThemeResult } from '@tamagui/core'
import { StyleSheet } from 'react-native'
import { RadioGroupItemWithLabel } from '@/components/utils/form/inputs'
import { useCustomerStore } from '@/utils/stores/customerStore'
import { Radius, Rating } from '@/components/explore/types'

export default function SearchFilters() {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
        <AuthWrapper>
        <ScrollView contentContainerStyle={styles.container}>
            <DistanceFromLocation/>
            <Ratings/>
            <View height={50}/>
        </ScrollView>
        </AuthWrapper>
    )
}

const DistanceFromLocation = () => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const setRadius = useCustomerStore(state => state.setSearchRadius);
    const radius = useCustomerStore(state => state.searchFilters.radius);
    return (
        <View>
            <Text style={styles.sectionTitle}>Distance from location</Text>
            <RadioGroup
            id="distance"
                gap={10}
                defaultValue={radius}
                value={radius}
                onValueChange={(value) => {
                    if (['1', '5', '10', '25', 'any'].includes(value)) {
                        setRadius(value as Radius);
                    }
                }}
                >
                <RadioGroupItemWithLabel
                    selectedValue={radius}
                    label="Within 1 mile"
                    value="1"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={radius}
                    label="Within 5 miles"
                    value="5"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={radius}
                    label="Within 10 miles"
                    value="10"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={radius}
                    label="Within 25 miles"
                    value="25"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={radius}
                    label="Any Distance"
                    value="any"
                    size={24}
                />
            </RadioGroup>
        </View>
    )
}

const Ratings = () => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const setRating = useCustomerStore(state => state.setSearchRating);
    const rating = useCustomerStore(state => state.searchFilters.rating);
    return (
        <View>
            <Text style={styles.sectionTitle}>Rating</Text>
            <RadioGroup
                id="rating"
                gap={10}
                defaultValue={rating}
                value={rating}
                onValueChange={(value) => {
                    if (['1', '2', '3', '4', '5', 'any'].includes(value)) {
                        setRating(value as Rating);
                    }
                }
            }>
                <RadioGroupItemWithLabel
                    selectedValue={rating}
                    label="1+"
                    value="1"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={rating}
                    label="2+"
                    value="2"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={rating}
                    label="3+"
                    value="3"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={rating}
                    label="4+"
                    value="4"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={rating}
                    label="5"
                    value="5"
                    size={24}
                />
                <RadioGroupItemWithLabel
                    selectedValue={rating}
                    label="Any"
                    value="any"
                    size={24}
                />
            </RadioGroup>
        </View>
    )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        backgroundColor: theme.background.val,
        width: '90%',
        paddingTop: 40,
        gap: 50,
        alignSelf: 'center'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContentText: {
        fontSize: 16,
        color: theme.color.val
    }
})