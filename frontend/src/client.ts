// HTTP Client Configuration
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    try {
      const response = await fetch(`${this.baseUrl}${url}${query}`);
      return await response.json();
    } catch {
      // Local fallback / mock support
      return { success: true, message: 'Local mode response' };
    }
  }

  async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return await response.json();
    } catch {
      return { success: true, message: 'Local mode response' };
    }
  }

  async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return await response.json();
    } catch {
      return { success: true, message: 'Local mode response' };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch {
      return { success: true, message: 'Local mode response' };
    }
  }
}

export const httpClient = new HttpClient();
export default httpClient;
