// src/services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  telegram_id: number;
  telegram_username: string;
  card_number: string;
  card_active: boolean;
}

export interface Business {
  id: number;
  company_name: string;
  discount_percentage: number;
}

export interface Stats {
  users: number;
  businesses: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllUsers(): Promise<User[]> {
    const data = await this.request<{ success: boolean; users: User[] }>('/admin/users');
    return data.users;
  }

  async addUser(userData: { telegram_id: number; username: string; card_number: string; card_active: boolean }): Promise<number> {
    const data = await this.request<{ success: boolean; user_id: number }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return data.user_id;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const data = await this.request<{ success: boolean; message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
    return data.success;
  }

  async getDiscounts(): Promise<Business[]> {
    const data = await this.request<{ success: boolean; businesses: Business[] }>('/businesses');
    return data.businesses;
  }

  async addDiscount(businessData: {company_name: string; discount_percentage: number;}): Promise<number> {
    const data = await this.request<{ success: boolean; discount_id: number }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
    return data.discount_id;
  }

  async deleteDiscount(businessId: number): Promise<boolean> {
    const data = await this.request<{ success: boolean; message: string }>(`/businesses/${businessId}`, {
      method: 'DELETE',
    });
    return data.success;
  }

  async getStats(): Promise<Stats> {
    const data = await this.request<{ success: boolean; stats: Stats }>('/stats');
    return data.stats;
  }
}

export const apiService = new ApiService();