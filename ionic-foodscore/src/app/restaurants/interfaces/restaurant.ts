import { User } from "src/app/auth/interfaces/user.interface";

export interface Restaurant {
  id?: number,
  name: string,
  image: string,
  cuisine: string,
  description: string,
  phone: string,
  daysOpen: string[]
  creator?: User;
  stars?: number;
  mine?: boolean;
  distance?: number;
  commented?: boolean;
  address?: string;
  lat: number;
  lng: number;
}
