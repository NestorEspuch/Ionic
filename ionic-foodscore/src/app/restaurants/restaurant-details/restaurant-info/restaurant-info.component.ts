import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { Restaurant } from '../../interfaces/restaurant';
import { RestaurantCardComponent } from '../../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../../services/restaurant-service.service';
import { RestaurantDetailsComponent } from '../restaurant-details.component';

@Component({
  selector: 'app-restaurant-info',
  standalone: true,
  imports: [CommonModule, IonicModule, RestaurantCardComponent, RouterModule],
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss'],
})
export class RestaurantInfoComponent implements OnInit {
  restaurant!: Restaurant;

  constructor(
    private alertCrl: AlertController,
    private restaurantService: RestaurantsService,
    private nav: NavController,
    @Inject(RestaurantDetailsComponent) private parentComponent: RestaurantDetailsComponent
  ) {}

  ngOnInit() {
    this.parentComponent.restaurant$.subscribe(
      restaurant => this.restaurant = restaurant
    );
  }

  async delete() {
    const alert = await this.alertCrl.create({
      header: 'Delete restaurant',
      message: 'Are you sure you want to delete this restaurant?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.restaurantService
              .deleteRestaurant(this.restaurant.id!)
              .subscribe(() => this.nav.navigateBack(['/restaurants']));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
}
