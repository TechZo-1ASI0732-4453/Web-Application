export interface FlatProduct {
  id: string;
  userId: string;
  categoryId: string;
  category: string;
  name: string;
  description: string;
  desiredObject: string;
  price: number;
  images: string[];
  boost: boolean;
  available: boolean;
  location: {
    country: string;
    department: string;
    district: string;
  };
}
