import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  Platform,
  IonRefresher,
  IonicModule,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/users/services/user-service.service';
import { Commentary } from '../../interfaces/comment';
import { RestaurantsService } from '../../services/restaurant-service.service';
import { StarRatingComponent } from '../../star-rating/star-rating.component';

@Component({
  selector: 'app-restaurant-comments',
  standalone: true,
  templateUrl: './restaurant-comments.component.html',
  styleUrls: ['./restaurant-comments.component.scss'],
  imports: [CommonModule, IonicModule, StarRatingComponent],
})
export class RestaurantCommentsComponent implements OnInit, OnDestroy {
  idRestaurant!: number;
  idUser!: number;
  haveComment = false;
  comments!: Commentary[];
  resumeSub!: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private readonly router: Router,
    private restaurantServices: RestaurantsService,
    private userServices: UsersService,
    private platform: Platform,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadComments();
    // If the app comes back from being paused, reload comments
    this.resumeSub = this.platform.resume.subscribe(
      () => this.ngZone.run(() => this.loadComments()) // Needs NgZone because Angular doesn't detect this event
    );
  }

  ngOnDestroy(): void {
    this.resumeSub.unsubscribe();
  }

  loadComments(refresher?: IonRefresher) {
    this.idRestaurant = +this.route.snapshot.parent!.params['id'];
    this.userServices.getUser(0,true).subscribe((user) => {
      this.idUser = user.id!;
    });
    this.restaurantServices
      .getComments(this.idRestaurant)
      .subscribe((comments) => {
        comments.comments.forEach(c =>{
          if(c.user?.id == this.idUser) this.haveComment = true;
        })
        this.comments = comments.comments;
        refresher?.complete();
      });
  }

  async addComment() {
    const alert = await this.alertCtrl.create({
      header: 'New commment',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Enter your comment',
        },
        {
          name: 'stars',
          type: 'number',
          placeholder: 'Stars (0-5)',
          min: 0,
          max: 5,
        },
      ],
      buttons: [
        {
          text: 'Add',
          role: 'ok',
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'ok') {
      let commentary: Commentary = {
        stars: +result.data.values.stars,
        text: result.data.values.comment,
      };

      this.restaurantServices
        .addComment(this.idRestaurant, commentary)
        .subscribe((comment) => this.comments.push(comment));
    }
  }

}
