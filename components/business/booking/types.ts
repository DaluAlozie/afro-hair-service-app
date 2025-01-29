import {
    AddOn as AddOnType,
    ServiceOption as ServiceOptionType,
    Variant as VariantType,
    CustomizableOption
  } from "@/components/business/types";

export type BookingInfo = {
  serviceOption: ServiceOptionType | null,
  variants: VariantType[],
  addOns: AddOnType[],
  customizableOptions: CustomizableOption[]
}