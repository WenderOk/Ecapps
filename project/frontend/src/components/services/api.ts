// src/services/api.ts
const API_BASE_URL = 'https://dom-molodezi-ycapps-wenwu.amvera.io/api';

export interface User {
  telegram_id: number;
  telegram_username: string;
  card_number: string;
  card_active: boolean;
}

export interface Discount {
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

  async getUser(telegram_id: number): Promise<User> {
    const data = await this.request<{ success: boolean; user: User }>(`/user/${telegram_id}`);
    return data.user;
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

  async addOrGetUser(userData: { telegram_id: number; username: string; card_number: string; card_active: boolean }): Promise<number> {
    const data = await this.request<{ success: boolean; user_id: number }>('/user', {
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

  async getDiscounts(): Promise<Discount[]> {
    const data = await this.request<{ success: boolean; discounts: Discount[] }>('/discounts');
    return data.discounts;
  }

  async addDiscount(discountData: {company_name: string; discount_percentage: number;}): Promise<number> {
    const data = await this.request<{ success: boolean; discount_id: number }>('/discounts', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
    return data.discount_id;
  }

  async deleteDiscount(discountId: number): Promise<boolean> {
    const data = await this.request<{ success: boolean; message: string }>(`/discounts/${discountId}`, {
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