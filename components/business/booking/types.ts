import {
    AddOn,
    ServiceOption,
    Variant,
    CustomizableOption,
    Service,
    Business
  } from "@/components/business/types";

export type BookingInfo = {
  business: Business | undefined,
  service: Service | undefined,
  serviceOption: ServiceOption | undefined,
  variants: Variant[],
  addOns: AddOn[],
  customizableOptions: CustomizableOption[]
}