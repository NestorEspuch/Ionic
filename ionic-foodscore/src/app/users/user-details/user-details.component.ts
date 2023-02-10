import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Restaurant } from 'src/app/restaurants/interfaces/restaurant';
import { RestaurantCardComponent } from '../../restaurants/restaurant-card/restaurant-card.component';
import { RestaurantsService } from 'src/app/restaurants/services/restaurant-service.service';
import { UsersService } from '../services/user-service.service';
import {
  AlertController,
  IonicModule,
  IonModal,
  ModalController,
} from '@ionic/angular';
import { User } from 'src/app/auth/interfaces/user.interface';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { EditAvatarComponent } from './edit-avatar/edit-avatar.component';

@Component({
  selector: 'fs-user-details',
  standalone: true,
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  imports: [CommonModule, RouterModule, RestaurantCardComponent, IonicModule],
})
export class UserDetailsComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly userServices: UsersService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private readonly router: Router,
  ) {}

  user!: User;
  restaurants!: Restaurant[];

  async makeAlert(message: string){
    const alert = await this.alertController.create({
      header: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit(): void {
    this.route.data.subscribe((user) => {
      if (user['user']) {
        this.user = user['user'];
      } else {
        this.userServices.getUser(0, true).subscribe((u) => (this.user = u));
      }
    });
  }

  async openModalPerfil() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {user: this.user},
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      try{
        this.userServices.saveProfile(data.name, data.email).subscribe();
        this.makeAlert('Profile updated!');
      }catch (e) {
        this.makeAlert('Error: '+ e);
      }
    } else {
      this.makeAlert(role!);
    }
  }

  async openModalPassword() {
    const modal = await this.modalCtrl.create({
      component: EditPasswordComponent,
      componentProps: {user: this.user},
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      try{
        this.userServices.savePassword(data.password).subscribe();
        this.makeAlert('Password updated!');
      }catch (e) {
        this.makeAlert('Error: '+ e);
      }
    } else {
      this.makeAlert(role!);
    }
  }

  async openModalAvatar() {
    const modal = await this.modalCtrl.create({
      component: EditAvatarComponent,
      componentProps: {user: this.user},
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      try{
        this.userServices.saveAvatar(data.avatar).subscribe();
        this.makeAlert('Avatar updated!');
      }catch (e) {
        this.makeAlert('Error: '+ e);
      }
    } else {
      this.makeAlert(role!);
      this.router.navigate(['/users',this.user.id]);
    }
  }

}
