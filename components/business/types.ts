interface Business {
    id: number,
    name: string,
    description: string,
    phone_number: string,
    instagram: string,
    facebook: string,
    twitter: string,
    online: boolean,
    tags: string[],
    rating: number,
    owner_id: string
}

interface Service {
    id: number,
    name: string,
    description: string,
    enabled: boolean,
    styles: Map<number, Style>,
    locations: Map<number, Location>
}

interface Style {
    id: number,
    name: string,
    description: string,
    requirements:string,
    enabled: boolean,
    addOns: Map<number, AddOn>,
    variants: Map<number, Variant>,
    customizableOptions: Map<number, CustomizableOption>,
    service_id: number
}

interface Variant {
    id: number,
    name: string,
    price: number,
    enabled: boolean,
    duration: number,
    style_id: number,
    service_id: number
}

interface AddOn {
    id: number,
    name: string,
    price: number,
    enabled: boolean,
    duration: number,
    style_id: number,
    service_id: number
}
type CustomizableOptionType = "text" | "boolean" | "numeric"
interface CustomizableOption {
    id: number,
    name: string,
    type: CustomizableOptionType,
    lower_bound: number,
    upper_bound: number,
    style_id: number,
    service_id: number
}

interface Location {
    id: number,
    street_address: string,
    flat_number: string,
    city: string,
    postcode: string,
    country: string,
    longitude: number,
    latitude: number,
    enabled: boolean
    business_id: number
}

interface ServiceLocation {
    location_id: number,
    service_id: number
}

interface BusinessReview {
    id: number,
    content: string,
    rating: number,
    business_id: number
    created_at: Date
}

interface CustomerReview {
    id: number,
    content: string,
    rating: number,
    customer_id: string
    created_at: Date
}
interface Appointment {
    id: number,
    start_time: Date,
    end_time: Date,
    customer_id: string,
    variant_id: number,
    business_id: number,
    total_price: number,
    paid: boolean,
    cancelled: boolean,
    addOns: Map<number, AddOn>,
    customizableOptions: Map<number, CustomizableOption>
}

interface Notification {
    id: number,
    title: string,
    message: string,
    type: NotificationType,
    read: boolean,
    business_id: number
}

interface TimeSlot {
    id: number,
    from: Date,
    to: Date,
    business_id: number
}

type NotificationType =
        "appointment-accepted"
    |   "appointment-rejected"
    |   "appointment-cancelled"
    |   "appointment-request"
    |   "new-availability"

export {
    Business,
    Service,
    Style,
    AddOn,
    Location,
    ServiceLocation,
    BusinessReview,
    CustomerReview,
    Appointment,
    Notification,
    NotificationType,
    Variant,
    TimeSlot,
    CustomizableOption,
    CustomizableOptionType
}