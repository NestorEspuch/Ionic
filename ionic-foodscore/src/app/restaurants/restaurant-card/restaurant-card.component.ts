import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
import { RestaurantsService } from '../services/restaurant-service.service';
import { Router, RouterModule } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'fs-restaurant-card',
  standalone: true,
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StarRatingComponent,
    IonicModule,
  ],
})
export class RestaurantCardComponent implements OnInit {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly router: Router,
    private alertController: AlertController
  ) {}

  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  handlerMessage = '';
  roleMessage = '';

  @Input() restaurant!: Restaurant;
  @Output() deleted = new EventEmitter<void>();

  ngOnInit(): void {

  }

  checkOpening(daysOpen: string[]): boolean {
    let result = false;
    daysOpen.forEach((day) => {
      if (+day == new Date().getDay()) {
        result = true;
      }
    });
    return result;
  }

  fillDays(daysOpen: string[]): string {
    let result = '';
    daysOpen.forEach((day) => {
      switch (day) {
        case '0':
        case 'Su':
        case 'Sun':
          result += 'Su,';
          break;
        case '1':
        case 'Mo':
        case 'Mon':
          result += 'Mo,';
          break;
        case '2':
        case 'Tu':
        case 'Tue':
          result += 'Tu,';
          break;
        case '3':
        case 'We':
        case 'Wed':
          result += 'We,';
          break;
        case '4':
        case 'Th':
        case 'Thu':
          result += 'Th,';
          break;
        case '5':
        case 'Fr':
        case 'Fri':
          result += 'Fr,';
          break;
        case '6':
        case 'Sa':
        case 'Sat':
          result += 'Sa,';
          break;
      }
    });
    return result.substring(0, result.length - 1);
  }

  async deleteRestaurant(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Do you want to delete the restaurant?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alertController.create({
              header: 'Alert',
              subHeader: 'Important message',
              message: 'The restaurant has not been eliminated',
              buttons: ['OK'],
            });
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.restaurantsService
              .deleteRestaurant(this.restaurant.id!)
              .subscribe({
                next: () => {
                  this.deleted.emit();
                  this.alertController.create({
                    header: 'Alert',
                    subHeader: 'Important message',
                    message: 'The restaurant has been eliminated',
                    buttons: ['OK'],
                  });
                  this.router.navigate(['/restaurants']);
                },
                error: (e) => {
                  this.alertController.create({
                    header: 'Alert',
                    subHeader: 'Important message',
                    message: 'The restaurant has not been eliminated: ' + e,
                    buttons: ['OK'],
                  });
                },
              });
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }
}
