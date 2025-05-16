export class Memberships {
  name: string;
  price: number;
  description: string;
  benefits: Benefits[];
  id: number;

  constructor(name: string, price: number, description: string, benefits: Benefits[], id: number) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.benefits = benefits;
    this.id=id;
  }
}

class Benefits {
  id: number;
  description: string;
  membershipId: number;

  constructor(id: number, description: string, membershipId: number) {
    this.id = id;
    this.description = description;
    this.membershipId = membershipId;
  }
}
