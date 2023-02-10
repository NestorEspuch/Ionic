import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFilterPipe } from '../pipes/restaurant-filter.pipe';
import { RestaurantsService } from '../services/restaurant-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ActionSheetController,
  IonicModule,
  IonRefresher,
  NavController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'fs-restaurants-page',
  standalone: true,
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RestaurantFormComponent,
    RestaurantCardComponent,
    RestaurantFilterPipe,
    IonicModule,
    RouterModule,
  ],
})
export class RestaurantsPageComponent {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly route: ActivatedRoute,
    private readonly userService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private navController: NavController
  ) {}

  restaurants: Restaurant[] = [];
  user!: User;
  userRestaurants!: boolean;
  toSearch = '';
  active = true;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['creator']) {
        this.userService
          .getUser(+params['creator'])
          .subscribe((u) => (this.user = u));
        this.restaurantsService.getRestaurants().subscribe(
          (restaurant) =>
            (this.restaurants = restaurant.filter((r) => {
              if (r.mine) {
                return r.creator?.id == params['creator'];
              } else {
                return r.creator == params['creator'];
              }
            }))
        );
        this.userRestaurants = true;
      } else {
        this.restaurantsService
          .getRestaurants()
          .subscribe((restaurant) => (this.restaurants = restaurant));

        this.userRestaurants = false;
      }
    });
  }

  ionViewWillEnter() {
    if(!this.userRestaurants){
      this.restaurantsService
      .getRestaurants()
      .subscribe((rests) => (this.restaurants = rests));
    }
  }

  reloadRestaurants(refresher: IonRefresher) {
    if(!this.userRestaurants){
      this.restaurantsService.getRestaurants().subscribe((rests) => {
        this.restaurants = rests;
        refresher.complete();
      });
    }
  }

  async showOptions(rest: Restaurant) {
    const actSheet = await this.actionSheetCtrl.create({
      header: rest.description,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.restaurantsService
              .deleteRestaurant(rest.id!)
              .subscribe(() =>
                this.restaurants.splice(this.restaurants.indexOf(rest), 1)
              );
          },
        },
        {
          text: 'See details',
          icon: 'eye',
          handler: () => {
            this.navController.navigateForward(['/restaurant', rest.id]);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    actSheet.present();
  }

  setActive() {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
  }

  // saveRestaurant(restaurant: Restaurant): void {
  //   this.restaurants = [...this.restaurants, restaurant];
  // }

  // deleteRestaurant(restaurant: Restaurant): void {
  //   this.restaurants = this.restaurants.filter((r) => r !== restaurant);
  // }

}
