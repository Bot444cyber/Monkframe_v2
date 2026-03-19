
export enum Category {
  ALL = 'All',
  WEB = 'Web',
  MOBILE = 'Mobile',
  DASHBOARD = 'Dashboard',
  LANDING = 'Landing',
  COMPONENTS = 'Components'
}

export interface Product {
  id: string;
  title: string;
  price: string;
  author: string;
  category: Category;
  imageSrc: string;
  sales: number;
  revenue: string;
  color: string;
  likes: number;
  liked: boolean;
  wished: boolean;
  rating: number;
  fileType: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LicenseTier {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}
