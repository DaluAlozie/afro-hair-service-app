/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import { supabaseClient } from '../auth/supabase'
import { AuthError } from '@supabase/supabase-js'
import { Appointment, Notification } from '@/components/business/types'

export interface CustomerStore {
    appointments: Map<string, Appointment>,
    notifications: Map<string, Notification>,
    requestAppointment: (
        businessId: string,
        serviceId: string,
        serviceOptionId: string,
        locationId: string,
        startTime: Date,
        endTime: Date,
        atHome: boolean,
        addOns: string[]
    ) => Promise<Appointment | AuthError>
}

export const useCustomerStore = create<CustomerStore>((set) => ({
    appointments: new Map<string, Appointment>(),
    notifications: new Map<string, Notification>(),
    requestAppointment: async (
        businessId: string,
        serviceId: string,
        serviceOptionId: string,
        locationId: string,
        startTime: Date,
        endTime: Date,
        atHome: boolean,
        addOns: string[]
    ) => { return {} as Appointment }
  })
)