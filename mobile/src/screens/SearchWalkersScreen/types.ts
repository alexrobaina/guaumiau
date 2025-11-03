export interface Walker {
  id: number;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  experience: string;
  services: string[];
  price: number;
  distance: string;
  lat: number;
  lng: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
}
