export interface Service {
  id: string
  name: string
  price: number
}

export interface ServiceSelectorProps {
  label?: string
  services: Service[]
  selectedServiceId: string
  onServiceChange: (serviceId: string) => void
}
