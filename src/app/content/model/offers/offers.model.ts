import { Users } from "../users/users.model";

export class Offers {
  id: string;
  id_product_offers: string;
  id_product_get: string;
  status: string;
  user_get: any;
  user_offer: any;
  product_get: any;
  product_offers: any;

  constructor(
    id: string,
    id_product_offers: string,
    id_product_get: string,
    status: string
  ) {
    this.id = id;
    this.id_product_offers = id_product_offers;
    this.id_product_get = id_product_get;
    this.status = status;
  }

  set setUserGet(value: any) {
    this.user_get = value;
  }

  set setProductGet(value: any) {
    this.product_get = value;
  }

  set setProductOffers(value: any) {
    this.product_offers = value;
  }

  set setUserOffers(value: any) {
    this.user_offer = value;
  }

  get getUserOffers(){
    return this.user_offer;
  }
}
