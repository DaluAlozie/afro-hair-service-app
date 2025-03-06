import {
    AddOn,
    Style,
    Variant,
    CustomizableOption,
    Service,
    Business
  } from "@/components/business/types";

export type BookingInfo = {
  business: Business | undefined,
  service: Service | undefined,
  style: Style | undefined,
  variants: Variant[],
  addOns: AddOn[],
  customizableOptions: CustomizableOption[]
}