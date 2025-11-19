// Главный объект приложения
const App = {
    currentUser: null,
    isInitialized: false,

    // Инициализация приложения
    async init() {
        try {
            console.log('🚀 Инициализация приложения...');

            // Инициализация Telegram WebApp
            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                
                // Устанавливаем тему
                this.applyTelegramTheme();
            }

            // Проверяем авторизацию и загружаем данные пользователя
            await this.loadUserData();
            
            // Инициализируем карту
            await MapModule.init('yandexMap');
            
            // Загружаем данные для карты
            await MapModule.loadBusinesses();
            
            // Загружаем скидки
            await this.loadDiscounts();
            
            // Загружаем профиль с QR-кодом
            await this.loadProfile();
            
            // Инициализируем навигацию
            this.initNavigation();
            
            // Инициализируем обработчики событий
            this.initEventHandlers();
            
            // Показываем основное содержимое
            this.showAppContent();
            
            this.isInitialized = true;
            console.log('✅ Приложение успешно инициализировано');

        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
            this.showError('Не удалось загрузить приложение');
        }
    },

    // Применение темы Telegram
    applyTelegramTheme() {
        if (!Telegram.WebApp) return;
        
        const theme = Telegram.WebApp.colorScheme;
        document.body.classList.add(`tg-theme-${theme}`);
        
        // Применяем background color от Telegram
        document.body.style.backgroundColor = Telegram.WebApp.backgroundColor;
    },

    // Загрузка данных пользователя
    async loadUserData() {
        try {
            console.log('👤 Загрузка данных пользователя...');
            
            const userData = await API.getCurrentUser();
            
            if (userData.success && userData.data) {
                this.currentUser = userData.data;
                
                // Обновляем splash screen с именем пользователя
                const splashUsername = document.getElementById('splashUsername');
                if (splashUsername && this.currentUser.first_name) {
                    splashUsername.textContent = `Привет, ${this.currentUser.first_name}!`;
                }
                
                console.log('✅ Пользователь загружен:', this.currentUser);
                return true;
            } else {
                throw new Error(userData.error || 'Не удалось загрузить данные пользователя');
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки пользователя:', error);
            
            // Пробуем авторизацию через Telegram
            if (window.Telegram?.WebApp?.initData) {
                console.log('🔄 Пробуем авторизацию через Telegram...');
                try {
                    const authResult = await API.telegramAuth(Telegram.WebApp.initData);
                    if (authResult.success) {
                        return await this.loadUserData(); // Повторяем загрузку
                    }
                } catch (authError) {
                    console.error('❌ Ошибка авторизации Telegram:', authError);
                }
            }
            
            throw error;
        }
    },

    // Загрузка скидок
    async loadDiscounts() {
        try {
            console.log('🎫 Загрузка скидок...');
            const discountsList = document.getElementById('discountsList');
            
            const discountsData = await API.getDiscounts();
            
            if (discountsData.success && discountsData.data) {
                this.renderDiscounts(discountsData.data);
            } else {
                throw new Error(discountsData.error || 'Не удалось загрузить скидки');
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки скидок:', error);
            this.showDiscountsError();
        }
    },

    // Отрисовка скидок
    renderDiscounts(discounts) {
        const discountsList = document.getElementById('discountsList');
        
        if (!discounts || discounts.length === 0) {
            discountsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">🏷️</div>
                    <div class="empty-state__text">Пока нет доступных скидок</div>
                </div>
            `;
            return;
        }

        discountsList.innerHTML = discounts.map(discount => `
            <div class="discount-card" data-business-id="${discount.id}">
                <div class="discount-card__header">
                    <div class="discount-card__title">${discount.company_name}</div>
                    <div class="discount-card__discount">${discount.discount_value || 'Скидка'}</div>
                </div>
                <div class="discount-card__description">
                    ${discount.discount_description}
                </div>
                <div class="discount-card__details">
                    ${discount.address ? `<div class="discount-card__address">📍 ${discount.address}</div>` : ''}
                    ${discount.phone_number ? `<div class="discount-card__phone">📞 ${discount.phone_number}</div>` : ''}
                    ${discount.working_hours ? `<div class="discount-card__hours">🕒 ${discount.working_hours}</div>` : ''}
                </div>
                <div class="discount-card__actions">
                    <button class="discount-card__button" onclick="App.showOnMap(${discount.id})">
                        Показать на карте
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Показать ошибку загрузки скидок
    showDiscountsError() {
        const discountsList = document.getElementById('discountsList');
        discountsList.innerHTML = `
            <div class="error-message">
                <div class="error-message__icon">❌</div>
                <div class="error-message__text">
                    <strong>Ошибка загрузки</strong><br>
                    Не удалось загрузить список скидок
                </div>
            </div>
        `;
    },

    // Загрузка профиля
    async loadProfile() {
        try {
            if (!this.currentUser) {
                await this.loadUserData();
            }

            this.renderProfile(this.currentUser);
            // Генерируем QR-код после загрузки профиля
            this.generateProfileQRCode(this.currentUser.id);
            
        } catch (error) {
            console.error('❌ Ошибка загрузки профиля:', error);
            this.showQRCodeError();
        }
    },

    // Отрисовка профиля
    renderProfile(user) {
        // Заполняем текстовые данные
        document.getElementById('profileName').textContent = 
            `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Пользователь';
        
        document.getElementById('profileStatus').textContent = 'Участник программы';
        document.getElementById('cardExpires').textContent = user.expires_at || 'бессрочно';
        document.getElementById('cardNumber').textContent = user.card_number || 'Не указан';

        // Аватар
        const avatarImg = document.getElementById('profileAvatarImg');
        const avatarFallback = document.getElementById('profileAvatarFallback');
        
        if (user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.style.display = 'block';
            avatarFallback.style.display = 'none';
        } else {
            const firstName = user.first_name || 'П';
            const lastName = user.last_name || ' ';
            avatarFallback.textContent = firstName[0] + (lastName[0] || '');
            avatarFallback.style.display = 'flex';
            avatarImg.style.display = 'none';
        }
    },

    // Генерация QR-кода профиля
    generateProfileQRCode(userId) {
        try {
            const qrElement = document.getElementById('qrCode');
            if (!qrElement) return;

            // Очищаем контейнер
            qrElement.innerHTML = '';

            // Создаем URL для анкеты пользователя
            const profileUrl = `${window.location.origin}/profile/${userId}`;
            
            // Создаем экземпляр QRCode
            const qr = qrcode(0, 'M'); // тип 0 (автовыбор), уровень коррекции 'M'
            qr.addData(profileUrl);
            qr.make();
            
            // Создаем SVG и добавляем в DOM
            const svgString = qr.createSvgTag({ 
                scalable: true,
                margin: 4,
                color: this.getQRCodeColors().color,
                background: this.getQRCodeColors().background
            });
            
            qrElement.innerHTML = svgString;
            qrElement.classList.add('fade-in');

            console.log('✅ QR-код сгенерирован для пользователя:', userId);

        } catch (error) {
            console.error('❌ Ошибка генерации QR-кода:', error);
            this.showQRCodeFallback(userId);
        }
    },

    // Получение цветов для QR-кода в зависимости от темы
    getQRCodeColors() {
        const isDark = document.body.classList.contains('tg-theme-dark') || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        return {
            color: isDark ? '#ffffff' : '#000000',
            background: 'transparent'
        };
    },

    // Показать fallback для QR-кода
    showQRCodeFallback(userId) {
        const qrElement = document.getElementById('qrCode');
        const profileUrl = `${window.location.origin}/profile/${userId}`;
        
        qrElement.innerHTML = `
            <div class="qr-fallback">
                <div class="qr-fallback__icon">📱</div>
                <div class="qr-fallback__text">${userId}</div>
                <div class="qr-fallback__label">ID пользователя</div>
                <div style="margin-top: 12px; font-size: 12px; color: var(--tg-theme-hint-color);">
                    URL: ${profileUrl}
                </div>
            </div>
        `;
    },

    // Показать ошибку QR-кода
    showQRCodeError() {
        const qrElement = document.getElementById('qrCode');
        qrElement.innerHTML = `
            <div class="qr-fallback">
                <div class="qr-fallback__icon">❌</div>
                <div class="qr-fallback__text">Ошибка загрузки</div>
                <div class="qr-fallback__label">Не удалось сгенерировать QR-код</div>
            </div>
        `;
    },

    // Показать бизнес на карте
    showOnMap(businessId) {
        if (MapModule.showPlacemark(businessId)) {
            // Переключаемся на вкладку карты
            this.switchToTab('feedTab');
        } else {
            console.warn('Бизнес не найден на карте:', businessId);
        }
    },

    // Инициализация навигации
    initNavigation() {
        const navItems = document.querySelectorAll('.bottom-nav__item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetTab = item.getAttribute('data-tab');
                this.switchToTab(targetTab);
            });
        });
    },

    // Переключение вкладок
    switchToTab(tabId) {
        // Скрываем все вкладки
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('tab--active');
        });
        
        // Показываем целевую вкладку
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('tab--active');
        }
        
        // Обновление активной кнопки навигации
        document.querySelectorAll('.bottom-nav__item').forEach(navItem => {
            navItem.classList.remove('bottom-nav__item--active');
        });
        
        const activeNavItem = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('bottom-nav__item--active');
        }
        
        // При переключении на профиль обновляем QR-код
        if (tabId === 'profileTab') {
            setTimeout(() => {
                this.loadProfile().catch(console.error);
            }, 100);
        }
        
        // При переключении на карту обновляем её размер
        if (tabId === 'feedTab' && MapModule.map) {
            setTimeout(() => {
                MapModule.map.container.fitToViewport();
            }, 300);
        }
    },

    // Инициализация обработчиков событий
    initEventHandlers() {
        // Выход из аккаунта
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    },

    // Выход из аккаунта
    async logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            try {
                await API.logout();
                
                // Закрываем WebApp или перезагружаем страницу
                if (window.Telegram?.WebApp) {
                    Telegram.WebApp.close();
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error('❌ Ошибка выхода:', error);
                alert('Ошибка при выходе из аккаунта');
            }
        }
    },

    // Показать основное содержимое приложения
    showAppContent() {
        const splashScreen = document.getElementById('splashScreen');
        const appContent = document.getElementById('appContent');
        
        // Добавляем небольшую задержку для плавного перехода
        setTimeout(() => {
            splashScreen.style.display = 'none';
            appContent.classList.remove('hidden');
            
            // Анимация появления
            appContent.style.animation = 'fadeIn 0.5s ease';
        }, 500);
    },

    // Показать ошибку
    showError(message) {
        const splashScreen = document.getElementById('splashScreen');
        splashScreen.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                <div style="font-size: 18px; margin-bottom: 24px;">${message}</div>
                <button onclick="location.reload()" style="
                    background: white; 
                    color: #8b5cf6; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 8px; 
                    font-size: 16px; 
                    cursor: pointer;
                ">Попробовать снова</button>
            </div>
        `;
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init().catch(error => {
        console.error('❌ Критическая ошибка инициализации:', error);
        App.showError('Не удалось загрузить приложение');
    });
});

// Глобальные функции для использования в HTML
window.App = App;