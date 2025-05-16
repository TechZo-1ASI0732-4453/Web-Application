export class Ongs {
  name: string;
  type: string;
  information: any[];
  projects: any[];
  account_number: any[];
  address: any;
  category: string;
  email: string;
  contact_number: string;
  attention_schedule: any[];
  logo: string;
  website: string;
  social_networks: any[];
  id: string;
  category_name: string;

  constructor(
    name: string,
    type: string,
    information: any[],
    projects: any[],
    account_number: any[],
    address: any,
    category: string,
    email: string,
    contact_number: string,
    attention_schedule: any[],
    logo: string,
    website: string,
    social_networks: any[],
    id: string
  ) {
    this.name = name;
    this.type = type;
    this.information = information;
    this.projects = projects;
    this.account_number = account_number;
    this.address = address;
    this.category = category;
    this.email = email;
    this.contact_number = contact_number;
    this.attention_schedule = attention_schedule;
    this.logo = logo;
    this.website = website;
    this.social_networks = social_networks;
    this.id = id;
    this.setInformation();
    this.category_name = ''
  }


  /* funccion para cambiar valores de information. en sus propiedades about, mission_vision hacer que el texto tenga un salto de line despues de cada punto(remember the data is json)*/
  setInformation() {
    this.information.map((info: any) => {
      info.about = info.about.split('.').join('.\n\n');
      info.mission_vision = info.mission_vision.split('.').join('.\n\n');
    });
  }

  get nameUpper(){
    return this.name.toUpperCase();
  }

  get addressText(){
    return `${this.address.street}, ${this.address.district}, ${this.address.city}, ${this.address.country}`;
  }
  set setCategory_name(category_name: string){
    this.category_name = category_name;
  }



}
