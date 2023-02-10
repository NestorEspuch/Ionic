import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { IonicModule, AlertController } from '@ionic/angular';
import { ArcgisMapComponent } from 'src/app/maps/arcgis-map/arcgis-map.component';
import { ArcgisMarkerDirective } from 'src/app/maps/arcgis-marker/arcgis-marker.directive';
import { ArcgisSearchDirective } from 'src/app/maps/arcgis-search/arcgis-search.directive';
import { SearchResult } from 'src/app/maps/interfaces/search-result';

import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurant-service.service';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    ArcgisMapComponent,
    ArcgisMarkerDirective,
    ArcgisSearchDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  editing = false;
  restaurant!: Restaurant;

  daysOpen: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  days!: string[];
  daysShow!: '';

  newRestaurant: Restaurant = {
    name: '',
    description: '',
    cuisine: '',
    daysOpen: [],
    image: '',
    phone: '',
    address: '',
    lat: 0,
    lng: 0,
  };

  restaurantForm!: FormGroup;
  nameControl!: FormControl<string>;
  descriptionControl!: FormControl<string>;
  cuisineControl!: FormControl;
  phoneControl!: FormControl<string>;

  constructor(
    private readonly restaurantServices: RestaurantsService,
    private readonly router: Router,
    private readonly fb: NonNullableFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['restaurant']) {
        this.restaurant = data['restaurant'];
        this.editing = true;
      }
    });

    if (this.editing) {
      this.newRestaurant = this.restaurant;
      this.days = this.newRestaurant.daysOpen;
    }

    this.nameControl = this.fb.control(this.newRestaurant.name, [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+'),
    ]);

    this.descriptionControl = this.fb.control(this.newRestaurant.description, [
      Validators.required,
    ]);

    this.cuisineControl = this.fb.control(this.newRestaurant.cuisine, [
      Validators.required,
    ]);

    this.phoneControl = this.fb.control(this.newRestaurant.phone, [
      Validators.required,
      Validators.pattern('(\\+?[0-9]2 ?)?[0-9]{9}'),
    ]);

    this.restaurantForm = this.fb.group({
      name: this.nameControl,
      description: this.descriptionControl,
      cuisine: this.cuisineControl,
      phone: this.phoneControl,
    });

    navigator.geolocation.getCurrentPosition((pos) => {
      this.newRestaurant.lat = pos.coords.latitude;
      this.newRestaurant.lng = pos.coords.longitude;
    });
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.newRestaurant.image = photo.dataUrl as string;
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.newRestaurant.image = photo.dataUrl as string;
  }

  searchResult(result: SearchResult): void {
    this.newRestaurant.lat = result.latitude;
    this.newRestaurant.lng = result.longitude;

    this.newRestaurant.address = result.address;
  }

  addRestaurant(): void {
    this.newRestaurant.name = this.nameControl.value;
    this.newRestaurant.description = this.descriptionControl.value;
    this.newRestaurant.cuisine = this.cuisineControl.value;
    this.newRestaurant.daysOpen = this.booleanArray();
    this.newRestaurant.phone = this.phoneControl.value;

    if (!this.editing) {
      this.restaurantServices.addRestaurant(this.newRestaurant).subscribe({
        next: () => this.router.navigate(['/restaurants']),
        error: (e) => console.error(e),
      });
    } else {
      this.restaurantServices
        .editRestaurant(this.restaurant.id!, this.newRestaurant)
        .subscribe({
          next: () => {
            this.router.navigate(['/restaurants']);
          },
          error: (e) => console.error(e),
        });
    }
  }

  async showDaysCheckbox() {
    const alert = await this.alertController.create({
      header: 'Select days',
      inputs: [
        {
          name: 'Sunday',
          type: 'checkbox',
          value: 'Sunday',
          label: 'Sunday',
          checked: true,
        },
        {
          name: 'Monday',
          type: 'checkbox',
          value: 'Monday',
          label: 'Monday',
          checked: true,
        },
        {
          name: 'Tuesday',
          type: 'checkbox',
          value: 'Tuesday',
          label: 'Tuesday',
          checked: true,
        },
        {
          name: 'Wednesday',
          type: 'checkbox',
          value: 'Wednesday',
          label: 'Wednesday',
          checked: true,
        },
        {
          name: 'Thursday',
          type: 'checkbox',
          value: 'Thursday',
          label: 'Thursday',
          checked: true,
        },
        {
          name: 'Friday',
          type: 'checkbox',
          value: 'Friday',
          label: 'Friday',
          checked: true,
        },
        {
          name: 'Saturday',
          type: 'checkbox',
          value: 'Saturday',
          label: 'Saturday',
          checked: true,
        },
      ],
      buttons: ['Ok', 'Cancel'],
    });

    await alert.present();

    const resp = await alert.onDidDismiss();
    if (resp.data && resp.role !== 'cancel') {
      this.daysShow = resp.data.values.toString();
      this.days = resp.data.values;
    }
  }

  booleanArray(): string[] {
    const array: string[] = [];

    for (let i = 0; i < this.days.length; i++) {
      switch (this.days[i]) {
        case 'Sunday':
          array[0] = 0 + '';
          break;
        case 'Monday':
          array[1] = 1 + '';
          break;
        case 'Tuesday':
          array[2] = 2 + '';
          break;
        case 'Wednesday':
          array[3] = 3 + '';
          break;
        case 'Thursday':
          array[4] = 4 + '';
          break;
        case 'Friday':
          array[5] = 5 + '';
          break;
        case 'Saturday':
          array[6] = 6 + '';
          break;
      }
    }

    return array;
  }

}
