import { Product } from '@/lib/types'

export interface StoreAvailability {
  'Stock Casa': number;
  'Stock Rabat': number;
  'Stock Marrakech': number;
  'Stock Tanger': number;
}

export async function fetchStoreAvailability(productRef: string): Promise<StoreAvailability> {
  const response = await fetch(`https://phpstack-937973-4763176.cloudwaysapps.com/data1.php?type=search&query=${encodeURIComponent(productRef)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch store availability');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.length === 0) {
    throw new Error('No availability data found for this product');
  }

  return {
    'Stock Casa': parseInt(data[0]['Stock Casa']),
    'Stock Rabat': parseInt(data[0]['Stock Rabat']),
    'Stock Marrakech': parseInt(data[0]['Stock Marrakech']),
    'Stock Tanger': parseInt(data[0]['Stock Tanger']),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products/category/tous')
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

