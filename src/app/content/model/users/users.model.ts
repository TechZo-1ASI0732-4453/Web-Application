import {Products} from "../products/products.model";

export class Users {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  password: string;
  membership: string;
  membership_date: string;
  profilePicture: string;
  isActive: boolean;
  isGoogleAccount: boolean;
  roles: string[];
  favorites: Products[];

  constructor(
    id: string,
    name: string,
    username: string,
    phoneNumber: string,
    password: string,
    membership: string,
    profilePicture: string,
    isActive: boolean,
    isGoogleAccount: boolean,
    roles: string[],
    favorites: Products[]
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.membership = membership;
    this.membership_date = "";
    this.profilePicture = profilePicture;
    this.isActive = isActive;
    this.isGoogleAccount = isGoogleAccount;
    this.roles = roles;
    this.favorites = favorites;
  }

  set membershipDate(membership_date: string) {
    this.membership_date = membership_date;
  }
}
