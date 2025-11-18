const MapModule = {
    map: null,
    placemarks: [],
    isInitialized: false,

    async init(mapContainerId) {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) {
                resolve();
                return;
            }

            if (typeof ymaps === 'undefined') {
                reject(new Error('Yandex Maps API not loaded'));
                return;
            }

            // Ждем готовности API
            ymaps.ready(() => {
                try {
                    const mapElement = document.getElementById(mapContainerId);
                    if (!mapElement) {
                        reject(new Error('Map element not found'));
                        return;
                    }

                    // Проверяем видимость элемента
                    if (mapElement.offsetWidth === 0 || mapElement.offsetHeight === 0) {
                        setTimeout(() => this.init(mapContainerId).then(resolve).catch(reject), 100);
                        return;
                    }

                    this.map = new ymaps.Map(mapContainerId, {
                        center: [60.709456, 28.750274], // Центр Выборга
                        zoom: 13,
                        controls: ['fullscreenControl']
                    });

                    // Ждем полной загрузки карты
                    this.map.events.add('load', () => {
                        this.isInitialized = true;
                        resolve();
                    });

                    // Обработчик ошибок карты
                    this.map.events.add('error', (error) => {
                        reject(error);
                    });

                } catch (error) {
                    reject(error);
                }
            });
        });
    },

    async loadBusinesses() {
        try {
            const response = await API.getMapBusinesses();
            
            if (response.success && response.data) {
                this.addPlacemarks(response.data);
                return response.data;
            } else {
                throw new Error(response.error || 'Не удалось загрузить бизнесы');
            }
        } catch (error) {
            throw error;
        }
    },

    addPlacemarks(businesses) {
        if (!this.isInitialized) return;

        // Удаляем старые метки
        this.clearPlacemarks();

        businesses.forEach(business => {
            try {
                // Получаем координаты из разных форматов данных
                let coordinates;
                if (business.coordinates && Array.isArray(business.coordinates)) {
                    coordinates = business.coordinates;
                } else if (business.latitude && business.longitude) {
                    coordinates = [parseFloat(business.latitude), parseFloat(business.longitude)];
                } else {
                    return;
                }

                // Проверяем валидность координат
                if (!coordinates || coordinates.length !== 2 || 
                    isNaN(coordinates[0]) || isNaN(coordinates[1])) {
                    return;
                }

                const placemark = new ymaps.Placemark(
                    coordinates,
                    {
                        balloonContentHeader: `<strong style="color: #8b5cf6; font-size: 16px;">${business.company_name}</strong>`,
                        balloonContentBody: this._createBalloonContent(business),
                        balloonContentFooter: `<div style="color: #666; font-size: 12px;">📍 ${business.address}</div>`,
                        hintContent: business.company_name
                    },
                    {
                        preset: 'islands#violetIcon',
                        balloonCloseButton: true,
                        hideIconOnBalloonOpen: false,
                        balloonMaxWidth: 300
                    }
                );

                // Сохраняем данные бизнеса в метке
                placemark.properties.set('businessId', business.id);
                placemark.properties.set('businessData', business);
                
                this.map.geoObjects.add(placemark);
                this.placemarks.push(placemark);

            } catch (error) {
                // Игнорируем ошибки создания меток
            }
        });
        
        // Если есть метки, устанавливаем границы карты
        if (this.placemarks.length > 0) {
            setTimeout(() => {
                this.fitMapToPlacemarks();
            }, 500);
        }
    },

    _createBalloonContent(business) {
        const { discount_description, phone_number, working_hours } = business;
        
        return `
            <div style="padding: 5px; max-width: 280px;">
                <div style="margin-bottom: 8px; color: #666; line-height: 1.4;">
                    ${discount_description}
                </div>
                ${phone_number ? `
                <div style="margin-bottom: 5px; font-size: 13px; color: #555;">
                    <strong>📞 Телефон:</strong> ${phone_number}
                </div>
                ` : ''}
                ${working_hours ? `
                <div style="font-size: 13px; color: #555;">
                    <strong>🕒 Часы работы:</strong> ${working_hours}
                </div>
                ` : ''}
            </div>
        `;
    },

    clearPlacemarks() {
        if (!this.isInitialized) return;
        
        this.placemarks.forEach(placemark => {
            try {
                this.map.geoObjects.remove(placemark);
            } catch (error) {
                // Игнорируем ошибки удаления
            }
        });
        this.placemarks = [];
    },

    showPlacemark(businessId) {
        if (!this.isInitialized) return false;

        const placemark = this.placemarks.find(p => 
            p.properties.get('businessId') == businessId
        );

        if (placemark) {
            try {
                // Закрываем все открытые балуны
                this.placemarks.forEach(p => {
                    try {
                        p.balloon.close();
                    } catch (error) {}
                });
                
                // Открываем балун нужной метки
                setTimeout(() => {
                    try {
                        placemark.balloon.open();
                    } catch (error) {}
                }, 100);
                
                // Центрируем карту на метке
                const coordinates = placemark.geometry.getCoordinates();
                this.map.setCenter(coordinates, 16);
                
                return true;
            } catch (error) {
                return false;
            }
        }
        return false;
    },

    fitMapToPlacemarks() {
        if (!this.isInitialized || this.placemarks.length === 0) return;
        
        try {
            const bounds = this.map.geoObjects.getBounds();
            if (bounds) {
                this.map.setBounds(bounds, {
                    checkZoomRange: true,
                    zoomMargin: 30
                });
            }
        } catch (error) {}
    },

    destroy() {
        if (this.map) {
            try {
                this.clearPlacemarks();
                this.map.destroy();
                this.isInitialized = false;
            } catch (error) {}
        }
    }
};