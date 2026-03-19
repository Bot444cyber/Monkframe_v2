
export interface Product {
    id: string;
    title: string;
    price: string;
    author: string;
    category: string;
    imageSrc: string;
    google_file_id?: string;
    color?: string;
    tags?: string[];
    sales?: number;
    revenue?: string;
    likes: number;
    liked: boolean;
    wished: boolean;
    rating?: number;
    overview?: string;
    highlights?: string[];
    showcase?: string[];
    specifications?: { label: string; value: string; desc: string }[];
    fileType?: string;
}

export interface Transaction {
    id: string;
    productName: string;
    customerName: string;
    date: string;
    amount: string;
    status: 'completed' | 'pending' | 'refunded';
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'author' | 'admin';
    joinedDate: string;
    purchases: number;
}

export enum Category {
    ALL = "All products",
    AI = "AI",
    BUSINESS = "Business",
    CRYPTO = "Crypto",
    DASHBOARD = "Dashboard",
    ECOMMERCE = "Ecommerce",
    EDUCATION = "Education",
    FASHION = "Fashion",
    FINANCE = "Finance",
    FOOD = "Food",
}

export type ViewState = 'marketplace' | 'dashboard';
