import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Restaurant } from '../interfaces/restaurant';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArcgisMarkerDirective } from '../../maps/arcgis-marker/arcgis-marker.directive';
import { ArcgisMapComponent } from '../../maps/arcgis-map/arcgis-map.component';
import { IonicModule, IonRefresher } from '@ionic/angular';
import { RestaurantsService } from '../services/restaurant-service.service';
import { Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'fs-restaurant-details',
  standalone: true,
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
  imports: [
    CommonModule,
    RestaurantCardComponent,
    RouterModule,
    StarRatingComponent,
    ReactiveFormsModule,
    ArcgisMarkerDirective,
    ArcgisMapComponent,
    IonicModule,
  ],
})
export class RestaurantDetailsComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public environmentInjector: EnvironmentInjector,
    private readonly restaurantService: RestaurantsService,
  ) {
    this.restaurant$ = this.restaurantService
    .getRestaurant(this.route.snapshot.params['id'])
    .pipe(shareReplay(1));
  }

  restaurant!: Restaurant;
  restaurant$: Observable<Restaurant>;

  getRestaurant(): Observable<Restaurant> {
    return this.restaurant$;
  }

  goBack() {
    this.router.navigate(['/restaurant']);
  }

  ngOnInit(): void {
    this.route.data.subscribe((restaurant) => {
      this.restaurant = restaurant['restaurant'];
    });
    this.restaurant$.subscribe((restaurant) => (this.restaurant = restaurant));
  }
}
