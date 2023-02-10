import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StartNavigation } from '@proteansoftware/capacitor-start-navigation';
import { ArcgisMapComponent } from 'src/app/maps/arcgis-map/arcgis-map.component';
import { ArcgisMarkerDirective } from 'src/app/maps/arcgis-marker/arcgis-marker.directive';
import { Restaurant } from '../../interfaces/restaurant';
import { RestaurantDetailsComponent } from '../restaurant-details.component';

@Component({
  selector: 'app-restaurant-location',
  standalone: true,
  templateUrl: './restaurant-location.component.html',
  styleUrls: ['./restaurant-location.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ArcgisMarkerDirective,
    ArcgisMapComponent,
  ],
})
export class RestaurantLocationComponent implements OnInit {
  restaurant!: Restaurant;

  constructor(
    @Inject(RestaurantDetailsComponent)
    private parentComponent: RestaurantDetailsComponent
  ) {}

  ngOnInit() {
    this.parentComponent.restaurant$.subscribe(
      (restaurant) => (this.restaurant = restaurant)
    );
  }

  startNavigation() {
    StartNavigation.launchMapsApp({
      latitude: this.restaurant.lat,
      longitude: this.restaurant.lng,
      name: 'Directions ' + this.restaurant.name,
    });
  }
}
