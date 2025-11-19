// Валидация формы добавления бизнеса
function validateBusinessForm() {
    const companyName = document.getElementById('company_name').value.trim();
    const address = document.getElementById('address').value.trim();
    const coordinates = document.getElementById('coordinates').value.trim();
    const discountDescription = document.getElementById('discount_description').value.trim();
    const phoneNumber = document.getElementById('phone_number').value.trim();
    
    // Проверка обязательных полей
    if (!companyName) {
        alert('Введите название компании');
        return false;
    }
    
    if (!address) {
        alert('Введите адрес');
        return false;
    }
    
    if (!coordinates) {
        alert('Введите координаты');
        return false;
    }
    
    if (!discountDescription) {
        alert('Введите описание скидки');
        return false;
    }
    
    // Проверка координат
    const coordsRegex = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
    if (!coordsRegex.test(coordinates)) {
        alert('Неверный формат координат. Используйте: широта, долгота');
        return false;
    }
    
    // Проверка телефона (если указан)
    if (phoneNumber && !validatePhone(phoneNumber)) {
        document.getElementById('phone-error').textContent = 'Неверный формат телефона';
        document.getElementById('phone-error').style.display = 'block';
        return false;
    } else {
        document.getElementById('phone-error').style.display = 'none';
    }
    
    return true;
}

function validatePhone(phone) {
    // Упрощенная валидация российских номеров
    const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone);
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('7') || value.startsWith('8')) {
        value = value.substring(1);
    }
    
    if (value.length > 0) {
        if (value.length <= 3) {
            input.value = '+7 (' + value;
        } else if (value.length <= 6) {
            input.value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3);
        } else if (value.length <= 8) {
            input.value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6);
        } else {
            input.value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 10);
        }
    }
    
    // Скрываем ошибку при вводе
    document.getElementById('phone-error').style.display = 'none';
}

// Функции для списка пользователей
function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить пользователя?')) {
        fetch(`/api/users/${userId}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Пользователь удален');
                location.reload();
            } else {
                alert('Ошибка при удалении пользователя');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при удалении пользователя: ' + error.message);
        });
    }
}

// Функции для списка бизнесов
function deleteBusiness(businessId) {
    if (confirm('Вы уверены, что хотите удалить этот бизнес?')) {
        fetch(`/api/business/${businessId}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Бизнес удален');
                location.reload();
            } else {
                alert('Ошибка при удалении бизнеса');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при удалении бизнеса: ' + error.message);
        });
    }
}