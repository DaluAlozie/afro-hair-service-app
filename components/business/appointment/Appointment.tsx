/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import { View } from 'react-native'
import { Appointment as AppointmentProps } from '../types'

export default function Appointment({
    id,
    title,
    description,
    add_ons,
    add_on_costs,
    total_cost,
    start_time,
    end_time,
    business_id,
    service_id,
    service_option_id,
    street_address,
    postcode,
    country,
    city,
    at_home,
    user_id
}: AppointmentProps) {
    return (
        <View>
        </View>
    )

}
