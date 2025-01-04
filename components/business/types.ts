interface Service {
    id: number,
    title: string,
    description: string,
    enabled: boolean,
    service_options: Map<number, ServiceOption>,
    locations: Map<number, Location>
}

interface ServiceOption {
    id: number,
    title: string,
    description: string,
    requirements:string,
    enabled: boolean,
    addOns: Map<number, AddOn>,
    variants: Map<number, Variant>,
    service_id: number
}

interface Variant {
    id: number,
    name: string,
    price: number,
    enabled: boolean,
    duration: number,
    service_option_id: number,
    service_id: number
}

interface AddOn {
    id: number,
    name: string,
    price: number,
    enabled: boolean,
    duration: number,
    service_option_id: number,
    service_id: number
}

interface Location {
    id: number,
    street_address: string,
    flat_number: string,
    city: string,
    postcode: string,
    country: string,
    enabled: boolean
}

interface ServiceLocation {
    location_id: number,
    service_id: number
}

interface Review {
    id: number,
    description: string,
    business_rating_id: number,
    business_id: number
}
interface Rating {
    id: number,
    score: number,
    service_id: number,
    business_id: number
}

interface Appointment {
    id: number,
    start_time: Date,
    endTime: Date,
    street_address: string,
    city: string,
    postcode: string,
    country: string,
    addOns: Map<number, AddOn>[],
    at_home: boolean,
    accepted: boolean
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
    Service,
    ServiceOption,
    AddOn,
    Location,
    ServiceLocation,
    Review,
    Rating,
    Appointment,
    Notification,
    NotificationType,
    Variant,
    TimeSlot
}