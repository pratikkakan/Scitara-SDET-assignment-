export interface TestProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

export const testProducts: TestProduct[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    category: 'Electronics',
    quantity: 2,
  },
  {
    id: '2',
    name: 'USB-C Fast Charger',
    price: 49.99,
    category: 'Electronics',
    quantity: 3,
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 129.99,
    category: 'Electronics',
    quantity: 1,
  },
  {
    id: '4',
    name: 'Portable SSD 1TB',
    price: 89.99,
    category: 'Storage',
    quantity: 2,
  },
];

export const singleProduct = testProducts[0];
export const multipleProducts = testProducts;
