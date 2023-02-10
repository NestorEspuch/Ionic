import { Pipe, PipeTransform } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';

@Pipe({
  name: 'restaurantFilter',
  standalone: true,
})
export class RestaurantFilterPipe implements PipeTransform {
  transform(
    restaurants: Restaurant[],
    onlyOpen: boolean,
    search: string
  ): Restaurant[] {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    if (onlyOpen) {
      return restaurants.filter(
        (r) =>
          (r.daysOpen.includes(days[new Date().getDay()]) &&
            ((r.name.toLowerCase().includes(search.toLowerCase())) ||
          r.description.toLowerCase().includes(search.toLowerCase())))
      );
    } else {
      return restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase())
      );
    }
  }
}
