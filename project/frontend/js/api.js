const API = {
    baseURL: window.location.origin,

    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        
        const config = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Если не авторизован, пробуем авторизацию через Telegram
            if (response.status === 401 && window.Telegram?.WebApp?.initData) {
                console.log('🔄 Обнаружена 401 ошибка, пробуем авторизацию...');
                const authResult = await this.telegramAuth(window.Telegram.WebApp.initData);
                if (authResult.success) {
                    return this.request(endpoint, options);
                }
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    },

    async getCurrentUser() {
        return this.request('/api/users/current');
    },

    async getDiscounts() {
        return this.request('/api/business/active');
    },

    async getMapBusinesses() {
        return this.request('/api/map/businesses');
    },

    async telegramAuth(initData) {
        try {
            const response = await fetch(this.baseURL + '/api/telegram/auth', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Telegram auth failed:', error);
            throw error;
        }
    },

    async logout() {
        return this.request('/auth/logout', { method: 'GET' });
    },

    async generateQR(userId) {
        return this.request('/api/qr/generate', {
            method: 'POST',
            body: { userId }
        });
    },

    async getProfileData(userId) {
        return this.request(`/api/users/${userId}/profile`);
    }
};