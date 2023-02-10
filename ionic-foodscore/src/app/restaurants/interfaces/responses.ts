import { Commentary } from "./comment";
import { Restaurant } from "./restaurant";

export interface RestaurantsResponse {
  restaurants: Restaurant[];
}

export interface RestaurantResponse {
  restaurant: Restaurant;
}

export interface CommentsResponse {
  comments: Commentary[];
}

export interface CommentResponse {
  comment: Commentary;
}
