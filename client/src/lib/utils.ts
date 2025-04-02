import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function calculateTotalPrice(
  unitPrice: number,
  quantity: number,
  includeTaxAndShipping = false
): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const subtotal = unitPrice * quantity;
  const shipping = includeTaxAndShipping ? 4.99 : 0;
  const tax = includeTaxAndShipping ? subtotal * 0.08 : 0;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total
  };
}

export type ProductType = 'postcard' | 'poster';
export type ProductSize = 'small' | 'medium' | 'large';
export type FilterType = 
  'none' | 
  'grayscale(100%)' | 
  'sepia(70%)' | 
  'brightness(120%)' | 
  'contrast(150%)' | 
  'saturate(200%)';

export const PRODUCT_SIZES = {
  postcard: {
    small: '4 × 6 in',
    medium: '5 × 7 in',
    large: '6 × 8 in'
  },
  poster: {
    small: '8 × 10 in',
    medium: '11 × 14 in',
    large: '16 × 20 in'
  }
};

export const FILTERS: { [key in FilterType]: string } = {
  'none': 'None',
  'grayscale(100%)': 'B&W',
  'sepia(70%)': 'Sepia',
  'brightness(120%)': 'Bright',
  'contrast(150%)': 'Contrast',
  'saturate(200%)': 'Vibrant'
};
