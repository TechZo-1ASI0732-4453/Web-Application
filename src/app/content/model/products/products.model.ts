export class Products {
  id: string;
  user_id:string;
  category_id: string;
  product_name: string;
  description: string;
  change_for: string;
  price: number;
  images: string[];
  boost: boolean;
  available: boolean;
  location: any;
  category: string;

  constructor(
    id: string,
    user_id:string,
    category_id: string,
    product_name: string,
    description: string,
    change_for: string,
    price: number,
    images: string[],
    boost: boolean,
    available: boolean,
    location: any
  ) {
    this.id = id;
    this.user_id = user_id;
    this.category_id = category_id;
    this.product_name = product_name;
    this.description = description;
    this.change_for = change_for;
    this.price = price;
    this.images = images;
    this.boost = boost;
    this.available= available;
    this.location = location;
    this.category = '';
  }

  set setCategory(value: string) {
    this.category = value;
  }
  get getCategory(): any {
    return this.category;
  }
}
