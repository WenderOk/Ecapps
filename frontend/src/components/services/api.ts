// src/services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: number;
  telegram_id: number;
  telegram_username: string;
  card_number: string;
  card_active: boolean;
}

export interface Business {
  id: number;
  company_name: string;
  address: string;
  discount_description: string;
  discount_percentage: number;
  phone_number: string;
  working_hours: string;
  is_active: boolean;
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

  // Admin User methods
  async getAllUsers(): Promise<User[]> {
    const data = await this.request<{ success: boolean; users: User[] }>('/admin/users');
    return data.users;
  }

  async addUser(userData: { fio: string; phone: string; email: string }): Promise<number> {
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

  async getBusinesses(): Promise<Business[]> {
    const data = await this.request<{ success: boolean; businesses: Business[] }>('/businesses');
    return data.businesses;
  }

  async addBusiness(businessData: {
    company_name: string;
    address: string;
    discount_description: string;
    discount_percentage?: number;
    phone_number?: string;
    working_hours?: string;
  }): Promise<number> {
    const data = await this.request<{ success: boolean; business_id: number }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
    return data.business_id;
  }

  async deleteBusiness(businessId: number): Promise<boolean> {
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