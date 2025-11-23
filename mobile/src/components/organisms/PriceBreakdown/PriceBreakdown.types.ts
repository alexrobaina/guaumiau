export interface PetItem {
  id: string
  name: string
}

export interface PriceBreakdownProps {
  serviceName: string
  servicePrice: number
  bookingFee?: number // Deprecated: use platformCommissionPercent
  platformCommissionPercent?: number // Percentage commission (e.g., 15 for 15%)
  numberOfPets?: number // Number of pets to show price per pet breakdown
  pricePerPet?: number // Price per individual pet
  pets?: PetItem[] // Array of pets to show individual breakdown
}
