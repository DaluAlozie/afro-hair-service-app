/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import { supabaseClient } from '../auth/supabase'
import { AuthError } from '@supabase/supabase-js'
import { Appointment, Notification } from '@/components/business/types'
import { Address } from '@/components/business/businessLocation/types'
import { Filters, Radius, Rating, SortBy } from '@/components/explore/types'
import { formatAddress } from '@/components/explore/utils'

export interface CustomerStore {
    appointments: Map<string, Appointment>,
    notifications: Map<string, Notification>,
    searchHistory: Address[],
    searchFilters: Filters,
    setSearchFilters: (filters: Filters) => void,
    setSearchAddress: (address: Address) => void,
    setSearchSortBy: (sortBy: SortBy) => void,
    setSearchRadius: (radius: Radius) => void,
    setSearchRating: (rating: Rating) => void,
    setSearchInput: (searchInput: string) => void,
    clearSearchFilters: () => void,
    addSearchHistory: (address: Address) => void,
    bookAppointment: (
        businessId: string,
        serviceId: string,
        serviceOptionId: string,
        locationId: string,
        startTime: Date,
        endTime: Date,
        atHome: boolean,
        addOns: string[]
    ) => Promise<Appointment | AuthError>,
    reset: () => void
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
    appointments: new Map<string, Appointment>(),
    notifications: new Map<string, Notification>(),
    searchAddress: null,
    searchHistory: [],
    searchFilters: {
        radius: "any",
        rating: "any",
        sortBy: "recommended",
        searchInput: "",
        address: undefined
    },
    setSearchFilters: (filters: Filters) => set({ searchFilters: filters }),
    setSearchSortBy: (sortBy: SortBy) => set({ searchFilters: {...get().searchFilters, sortBy } }),
    setSearchRadius: (radius: Radius) => set({ searchFilters: {...get().searchFilters, radius: radius } }),
    setSearchRating: (rating: Rating) => set({ searchFilters: {...get().searchFilters, rating } }),
    setSearchAddress: (address: Address) => set({ searchFilters: {...get().searchFilters, address } }),
    setSearchInput: (searchInput: string) => set({ searchFilters: {...get().searchFilters, searchInput } }),
    clearSearchFilters: () => set({ searchFilters: {...initialFilters} }),
    addSearchHistory: (address: Address) => {
        let history = get().searchHistory;
        const formattedAddress = formatAddress(address);
        history = history.filter(a => formattedAddress !== formatAddress(a));
        const newHistory = [address, ...history].slice(0, 5)
        set({ searchHistory: newHistory })
    },
    bookAppointment: async (
        businessId: string,
        serviceId: string,
        serviceOptionId: string,
        locationId: string,
        startTime: Date,
        endTime: Date,
        atHome: boolean,
        addOns: string[]
    ) => { return {} as Appointment },
    reset: () => set(initialState)
  })
)

const initialFilters = {
    radius: "any",
    rating: "any",
    sortBy: "recommended",
    searchInput: "",
    address: undefined,
} as Filters

const initialState = {
    appointments: new Map<string, Appointment>(),
    notifications: new Map<string, Notification>(),
    searchHistory: [],
    searchFilters: {...initialFilters},
}