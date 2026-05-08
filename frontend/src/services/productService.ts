import axios from "axios";
import { Product, ApiResponse } from "../types";
import productsData from "../data/products.json";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      await delay(300); // Simulate network delay
      // Return mock data
      return productsData as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to mock data
      return productsData as Product[];
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      await delay(200);
      const products = productsData as Product[];
      const product = products.find((p) => p.id === id);
      return product || null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      await delay(250);
      const products = productsData as Product[];
      return products.filter((p) => p.category === category);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  /**
   * Search products by name
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      await delay(200);
      const products = productsData as Product[];
      const lowerQuery = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery),
      );
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  /**
   * Process checkout (mock API call)
   */
  async processCheckout(
    items: any[],
    totalAmount: number,
    formData: any,
  ): Promise<ApiResponse<any>> {
    try {
      await delay(1000); // Simulate payment processing

      // Simulate success response
      return {
        success: true,
        data: {
          orderId: `ORD-${Date.now()}`,
          status: "completed",
          amount: totalAmount,
          items: items,
        },
        message: "Order placed successfully",
      };
    } catch (error) {
      console.error("Error processing checkout:", error);
      return {
        success: false,
        error: "Failed to process checkout",
      };
    }
  },

  /**
   * Get available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const products = productsData as Product[];
      const categories = [...new Set(products.map((p) => p.category))];
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};

export default productService;
