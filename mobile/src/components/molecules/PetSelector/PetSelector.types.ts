export interface Pet {
  id: string
  name: string
  image?: string
}

export interface PetSelectorProps {
  label?: string
  pets: Pet[]
  selectedPetIds: string[]
  onTogglePet: (petId: string) => void
}
