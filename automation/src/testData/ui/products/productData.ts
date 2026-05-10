export interface TestProduct {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const testProducts: TestProduct[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'USB-C Fast Charger',
    price: 49.99,
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 129.99,
    category: 'Electronics',
  },
];

export const singleProduct = testProducts[0];
export const multipleProducts = testProducts.slice(0, 3);
