// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт EasyBrain загружен');
    initializeAllFunctionality();
});

function initializeAllFunctionality() {
    // 1. Навигация и меню
    setupNavigation();
    
    // 2. Плавная прокрутка
    setupSmoothScrolling();
    
    // 3. Фильтрация курсов (исправленная с поддержкой 6/12)
    setupCourseFilters();
    
    // 4. FAQ аккордеон
    setupFAQAccordion();
    
    // 5. Форма регистрации
    setupRegistrationForm();
    
    // 6. Валидация форм в реальном времени
    setupRealTimeValidation();
    
    // 7. Анимации при скролле
    setupScrollAnimations();
    
    // 8. Функционал всех кнопок
    setupAllButtons();
    
    // 9. Социальные сети
    setupSocialLinks();
    
    // 10. Футер и ссылки
    setupFooterLinks();
    
    // 11. Маска для телефона
    setupPhoneMask();
    
    // 12. Активная навигация при прокрутке
    setupActiveNavigationOnScroll();
}

// ==================== 1. НАВИГАЦИЯ ====================
function setupNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    // Меню при прокрутке
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Мобильное меню
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');
            
            // Переключаем меню
            navLinks.classList.toggle('active');
            
            // Показываем/скрываем кнопки на мобильных
            if (window.innerWidth <= 768) {
                if (!isActive) {
                    // Создаем мобильную версию кнопок
                    const mobileButtons = document.createElement('div');
                    mobileButtons.className = 'nav-buttons mobile';
                    mobileButtons.innerHTML = `
                        <a href="pages/personal/index.html" class="btn btn-login">
                            <i class="fas fa-user"></i> Войти
                        </a>
                        <a href="#contact" class="btn btn-primary">Бесплатный урок</a>
                    `;
                    navLinks.appendChild(mobileButtons);
                } else {
                    const mobileButtons = navLinks.querySelector('.nav-buttons.mobile');
                    if (mobileButtons) {
                        mobileButtons.remove();
                    }
                }
            }
            
            // Меняем иконку
            menuToggle.innerHTML = isActive 
                ? '<i class="fas fa-bars"></i>' 
                : '<i class="fas fa-times"></i>';
        });
    }

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const mobileButtons = navLinks.querySelector('.nav-buttons.mobile');
                if (mobileButtons) mobileButtons.remove();
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// ==================== 2. ПЛАВНАЯ ПРОКРУТКА ====================
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Обновляем активную ссылку в навигации
                updateActiveNavLink(targetId);
            }
        });
    });
}

function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ==================== 3. ФИЛЬТРАЦИЯ КУРСОВ (ОБНОВЛЕННАЯ С ПОДДЕРЖКОЙ 6/12) ====================
function setupCourseFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    const showAllBtn = document.getElementById('showAllCourses');
    const hideCoursesBtn = document.getElementById('hideCourses');

    console.log('Найдено кнопок фильтра:', filterButtons.length);
    console.log('Найдено карточек курсов:', courseCards.length);

    // Переменная для отслеживания, показывать ли все курсы
    let showAllCourses = false;

    // Инициализируем первую кнопку как активную
    if (filterButtons.length > 0 && !document.querySelector('.filter-btn.active')) {
        filterButtons[0].classList.add('active');
    }

    // Функция для обновления отображения курсов
    function updateCoursesDisplay() {
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        
        console.log('Обновление отображения. Фильтр:', filterValue, 'Показать все:', showAllCourses);
        
        let matchingCourses = [];
        
        // Сначала собираем все подходящие курсы
        courseCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            const matchesFilter = filterValue === 'all' || 
                                 (categories && categories.includes(filterValue));
            
            if (matchesFilter) {
                matchingCourses.push(card);
            }
        });
        
        console.log('Подходящих курсов:', matchingCourses.length);
        
        // Определяем, какие курсы показывать
        let coursesToShow = [];
        if (showAllCourses) {
            coursesToShow = matchingCourses;
        } else {
            coursesToShow = matchingCourses.slice(0, 6);
        }
        
        // Сначала скрываем все курсы
        courseCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        
        // Показываем выбранные курсы с анимацией
        coursesToShow.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            }, index * 50);
        });
        
        // Обновляем текст кнопок
        if (showAllBtn) {
            if (matchingCourses.length > 6 && !showAllCourses) {
                showAllBtn.style.display = 'inline-block';
                showAllBtn.textContent = `Показать все курсы (${matchingCourses.length})`;
                if (hideCoursesBtn) hideCoursesBtn.style.display = 'none';
            } else if (showAllCourses && matchingCourses.length > 6) {
                showAllBtn.style.display = 'none';
                if (hideCoursesBtn) hideCoursesBtn.style.display = 'inline-block';
            } else {
                showAllBtn.style.display = 'none';
                if (hideCoursesBtn) hideCoursesBtn.style.display = 'none';
            }
        }
        
        // Если нет подходящих курсов
        if (matchingCourses.length === 0) {
            showNotification('Курсы по выбранному фильтру не найдены', 'info');
        }
    }

    // Обработчики для кнопок фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Клик по фильтру:', this.textContent);
            
            // Сбрасываем флаг показа всех курсов при смене фильтра
            showAllCourses = false;
            
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Обновляем отображение курсов
            updateCoursesDisplay();
        });
    });

    // Обработчик для кнопки "Показать все курсы"
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            showAllCourses = true;
            updateCoursesDisplay();
            
            // Прокручиваем к секции курсов
            const coursesSection = document.querySelector('#courses');
            if (coursesSection) {
                window.scrollTo({
                    top: coursesSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            showNotification('Показаны все курсы по выбранному фильтру', 'info');
        });
    }

    // Обработчик для кнопки "Скрыть часть курсов"
    if (hideCoursesBtn) {
        hideCoursesBtn.addEventListener('click', function() {
            showAllCourses = false;
            updateCoursesDisplay();
            
            // Прокручиваем к началу секции
            const coursesSection = document.querySelector('#courses');
            if (coursesSection) {
                window.scrollTo({
                    top: coursesSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            showNotification('Показаны первые 6 курсов', 'info');
        });
    }

    // Инициализируем отображение при загрузке
    setTimeout(updateCoursesDisplay, 100);
}

// ==================== 4. FAQ АККОРДЕОН ====================
function setupFAQAccordion() {
    console.log('Инициализация FAQ...');
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    console.log('Найдено FAQ вопросов:', faqQuestions.length);
    
    // Если используются кнопки с классом .faq-question
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                console.log('Клик по FAQ вопросу');
                
                const item = this.closest('.faq-item');
                const answer = this.nextElementSibling;
                const isOpen = answer.classList.contains('open');
                
                // Закрываем все другие вопросы
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        
                        otherAnswer.classList.remove('open');
                        otherQuestion.classList.remove('active');
                        otherAnswer.style.maxHeight = null;
                    }
                });
                
                // Переключаем текущий вопрос
                if (!isOpen) {
                    // Открываем
                    this.classList.add('active');
                    answer.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    // Закрываем
                    this.classList.remove('active');
                    answer.classList.remove('open');
                    answer.style.maxHeight = null;
                }
            });
        });
    } 
    // Если используется структура с div.faq-question
    else {
        const faqItems = document.querySelectorAll('.faq-item');
        console.log('Найдено FAQ элементов:', faqItems.length);
        
        if (faqItems.length > 0) {
            // Открываем первый FAQ по умолчанию
            faqItems[0].classList.add('active');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', function() {
                        console.log('Клик по FAQ элементу');
                        
                        // Закрываем все FAQ
                        faqItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                        
                        // Переключаем текущий
                        const isActive = item.classList.contains('active');
                        if (!isActive) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            });
        }
    }
}

// ==================== 5. ФОРМА РЕГИСТРАЦИИ ====================
function setupRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (!registrationForm) {
        console.log('Форма регистрации не найдена');
        return;
    }
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = collectFormData();
        
        // Валидация
        if (!validateForm(formData)) {
            return;
        }
        
        // Отправка формы
        submitForm(formData);
    });
}

function collectFormData() {
    return {
        name: document.getElementById('name')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        grade: document.getElementById('grade')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        preparationType: document.getElementById('preparation-type')?.value || '',
        message: document.getElementById('message')?.value.trim() || '',
        agree: document.getElementById('agree')?.checked || false,
        newsletter: document.getElementById('newsletter')?.checked || false
    };
}

function validateForm(formData) {
    let isValid = true;
    const errors = [];
    
    // Валидация имени
    if (!formData.name || formData.name.length < 2) {
        showFieldError('name', 'Имя должно содержать минимум 2 символа');
        isValid = false;
        errors.push('Имя');
    } else {
        clearFieldError('name');
    }
    
    // Валидация email
    if (!validateEmail(formData.email)) {
        showFieldError('email', 'Введите корректный email адрес');
        isValid = false;
        errors.push('Email');
    } else {
        clearFieldError('email');
    }
    
    // Валидация телефона
    if (!validatePhone(formData.phone)) {
        showFieldError('phone', 'Введите корректный номер телефона');
        isValid = false;
        errors.push('Телефон');
    } else {
        clearFieldError('phone');
    }
    
    // Валидация класса
    if (!formData.grade) {
        showFieldError('grade', 'Выберите ваш класс');
        isValid = false;
        errors.push('Класс');
    } else {
        clearFieldError('grade');
    }
    
    // Валидация предмета
    if (!formData.subject) {
        showFieldError('subject', 'Выберите предмет для подготовки');
        isValid = false;
        errors.push('Предмет');
    } else {
        clearFieldError('subject');
    }
    
    // Валидация согласия
    if (!formData.agree) {
        showFieldError('agree', 'Необходимо согласие на обработку данных');
        isValid = false;
        errors.push('Согласие');
    } else {
        clearFieldError('agree');
    }
    
    if (!isValid) {
        showNotification(`Пожалуйста, исправьте ошибки в полях: ${errors.join(', ')}`, 'error');
        return false;
    }
    
    return true;
}

function submitForm(formData) {
    // Показываем индикатор загрузки
    const submitBtn = document.querySelector('#registrationForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    // Симуляция отправки на сервер
    setTimeout(() => {
        // Восстанавливаем кнопку
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Показываем успешное сообщение
        const subjectName = getSubjectName(formData.subject);
        const gradeText = getGradeText(formData.grade);
        
        showNotification(
            `Спасибо, ${formData.name}! Ваша заявка на пробный урок по ${subjectName} для ${gradeText} отправлена. Мы свяжемся с вами в течение 24 часов.`,
            'success'
        );
        
        // Сбрасываем форму
        document.getElementById('registrationForm').reset();
        
        // Прокручиваем к началу формы
        const contactSection = document.querySelector('.contact');
        if (contactSection) {
            window.scrollTo({
                top: contactSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
        
        // Логируем данные формы
        console.log('Форма отправлена:', formData);
        
    }, 2000);
}

function getSubjectName(subject) {
    const subjects = {
        'math': 'математике',
        'russian': 'русскому языку',
        'physics': 'физике',
        'informatics': 'информатике',
        'all': 'всем предметам'
    };
    return subjects[subject] || subject;
}

function getGradeText(grade) {
    const grades = {
        '9': '9 класса (ОГЭ)',
        '10': '10 класса',
        '11': '11 класса (ЕГЭ)',
        'other': 'подготовки'
    };
    return grades[grade] || grade;
}

// ==================== 6. ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ ====================
function setupRealTimeValidation() {
    const formInputs = document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea');
    
    formInputs.forEach(input => {
        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Очистка ошибок при вводе
        input.addEventListener('input', function() {
            clearFieldError(this.id);
            if (this.parentElement) {
                this.parentElement.classList.remove('has-error', 'success');
            }
        });
        
        // Валидация для чекбоксов
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                validateField(this);
            });
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const id = field.id;
    
    switch (id) {
        case 'name':
            if (value.length < 2) {
                showFieldError(id, 'Минимум 2 символа');
                if (field.parentElement) {
                    field.parentElement.classList.add('has-error');
                }
                return false;
            }
            break;
            
        case 'email':
            if (!validateEmail(value)) {
                showFieldError(id, 'Неверный формат email');
                if (field.parentElement) {
                    field.parentElement.classList.add('has-error');
                }
                return false;
            }
            break;
            
        case 'phone':
            if (!validatePhone(value)) {
                showFieldError(id, 'Введите номер телефона');
                if (field.parentElement) {
                    field.parentElement.classList.add('has-error');
                }
                return false;
            }
            break;
            
        case 'grade':
        case 'subject':
            if (!value) {
                showFieldError(id, 'Это поле обязательно');
                if (field.parentElement) {
                    field.parentElement.classList.add('has-error');
                }
                return false;
            }
            break;
            
        case 'agree':
            if (!field.checked) {
                showFieldError(id, 'Необходимо согласие');
                if (field.parentElement) {
                    field.parentElement.classList.add('has-error');
                }
                return false;
            }
            break;
    }
    
    if (field.parentElement) {
        field.parentElement.classList.remove('has-error');
        field.parentElement.classList.add('success');
    }
    clearFieldError(id);
    return true;
}

function showFieldError(fieldId, message) {
    clearFieldError(fieldId);
    
    const fieldElement = document.getElementById(fieldId);
    if (!fieldElement) return;
    
    let errorContainer;
    
    if (fieldElement.type === 'checkbox') {
        const parentGroup = fieldElement.closest('.form-group');
        if (parentGroup) {
            errorContainer = parentGroup.querySelector('.field-error');
        }
    } else {
        const parentGroup = fieldElement.closest('.form-group');
        if (parentGroup) {
            errorContainer = parentGroup.querySelector('.field-error');
        }
    }
    
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const fieldElement = document.getElementById(fieldId);
    if (!fieldElement) return;
    
    let errorContainer;
    
    if (fieldElement.type === 'checkbox') {
        const parentGroup = fieldElement.closest('.form-group');
        if (parentGroup) {
            errorContainer = parentGroup.querySelector('.field-error');
        }
    } else {
        const parentGroup = fieldElement.closest('.form-group');
        if (parentGroup) {
            errorContainer = parentGroup.querySelector('.field-error');
        }
    }
    
    if (errorContainer) {
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
    }
}

// ==================== 7. АНИМАЦИИ ПРИ СКРОЛЛЕ ====================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами
    document.querySelectorAll('.course-card, .teacher-card, .material-card, .review-card, .step-card, .pricing-card').forEach(el => {
        observer.observe(el);
    });
}

// ==================== 8. ФУНКЦИОНАЛ ВСЕХ КНОПОК ====================
function setupAllButtons() {
    // 8.1 Кнопка "Войти"
    setupLoginButton();
    
    // 8.2 Кнопки курсов "Подробнее"
    setupCourseDetailButtons();
    
    // 8.3 Кнопки тарифов
    setupPricingButtons();
    
    // 8.4 Кнопки материалов
    setupMaterialButtons();
    
    // 8.5 Кнопки в герое
    setupHeroButtons();
}

function setupLoginButton() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Перенаправление на страницу авторизации...', 'info');
            window.location.href = 'pages/personal/index.html';
        });
    }
}

function setupCourseDetailButtons() {
    document.querySelectorAll('.course-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('h3').textContent;
            const coursePrice = courseCard.querySelector('.course-price').textContent;
            
            showModal(`<h3>${courseTitle}</h3>
                <p>Полное описание курса, программа обучения, требования и детали.</p>
                <p><strong>Стоимость:</strong> ${coursePrice}</p>
                <p>В реальном проекте здесь будет полное описание курса со всеми модулями и возможностью записи.</p>
            `, 'Подробнее о курсе');
        });
    });
}

function setupPricingButtons() {
    document.querySelectorAll('.pricing-select-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pricingCard = this.closest('.pricing-card');
            const plan = pricingCard.querySelector('h3').textContent;
            const price = pricingCard.querySelector('.price').textContent;
            
            showModal(`<h3>Тариф "${plan}"</h3>
                <p>Стоимость: ${price}</p>
                <p>В реальном проекте здесь будет форма выбора тарифа и оплаты.</p>
                <p>Вы будете перенаправлены на страницу оформления заказа.</p>
            `, 'Выбор тарифа');
        });
    });
}

function setupMaterialButtons() {
    // Кнопки скачивания
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const material = this.closest('.material-card').querySelector('h3').textContent;
            showNotification(`Начинаем скачивание: "${material}"`, 'success');
        });
    });
    
    // Кнопка вебинара
    document.querySelectorAll('.webinar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const material = this.closest('.material-card').querySelector('h3').textContent;
            showModal(`<h3>${material}</h3>
                <p>Разбор сложных задач 2 части ЕГЭ профиль.</p>
                <p><strong>Дата:</strong> 15 декабря 2024, 19:00</p>
                <p><strong>Продолжительность:</strong> 2 часа</p>
                <p><strong>Преподаватель:</strong> Марк Цукерберг</p>
                <p>Для доступа к вебинару необходима регистрация через форму на этой странице.</p>
            `, 'Информация о вебинаре');
        });
    });
}

function setupHeroButtons() {
    // Кнопка "Выбрать курс" в герое
    const chooseCourseBtn = document.querySelector('.hero-buttons .btn-primary');
    if (chooseCourseBtn) {
        chooseCourseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector('#courses');
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Кнопка "Бесплатный урок" в герое
    const freeLessonBtn = document.querySelector('.hero-buttons .btn-secondary');
    if (freeLessonBtn) {
        freeLessonBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector('#contact');
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Фокусируемся на форме через 1 секунду
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        nameInput.focus();
                    }
                }, 1000);
            }
        });
    }
}

// ==================== 9. СОЦИАЛЬНЫЕ СЕТИ ====================
function setupSocialLinks() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.className.includes('vk') ? 'ВКонтакте' :
                           this.className.includes('telegram') ? 'Telegram' :
                           this.className.includes('youtube') ? 'YouTube' : 'WhatsApp';
            
            showModal(`<h3>Мы в ${platform}</h3>
                <p>Подписывайтесь на нас в ${platform} чтобы быть в курсе новостей, получать полезные материалы и участвовать в вебинарах.</p>
                <p>В реальном проекте здесь будет прямая ссылка на нашу страницу.</p>
            `, `EasyBrain в ${platform}`);
        });
    });
}

// ==================== 10. ФУТЕР И ССЫЛКИ ====================
function setupFooterLinks() {
    // Политика конфиденциальности
    const policyLinks = document.querySelectorAll('.policy-link');
    policyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showModal(`<h3>Политика конфиденциальности</h3>
                <p>Мы серьезно относимся к защите ваших персональных данных.</p>
                <p>Все данные, которые вы предоставляете при регистрации, используются исключительно для предоставления образовательных услуг и улучшения качества обучения.</p>
                <p>Мы не передаем ваши данные третьим лицам без вашего согласия.</p>
                <p>Полный текст политики конфиденциальности доступен по запросу.</p>
            `, 'Политика конфиденциальности');
        });
    });
    
    // Договор-оферта
    const offerLinks = document.querySelectorAll('.offer-link');
    offerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showModal(`<h3>Договор-оферта</h3>
                <p>Оферта на оказание образовательных услуг.</p>
                <p>Настоящий договор является официальным предложением (офертой) на заключение договора оказания образовательных услуг.</p>
                <p>Акцептом оферты является оплата услуг.</p>
                <p>Полный текст договора-оферты доступен для скачивания на странице оплаты.</p>
            `, 'Договор-оферта');
        });
    });
}

// ==================== 11. МАСКА ДЛЯ ТЕЛЕФОНА ====================
function setupPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Удаляем первую 7, если она есть (т.к. мы добавляем +7)
        if (value.startsWith('7')) {
            value = value.substring(1);
        }
        
        let formattedValue = '';
        
        if (value.length > 0) {
            // Добавляем +7 только если его еще нет
            if (!e.target.value.startsWith('+7')) {
                formattedValue = '+7 ';
            } else {
                formattedValue = '+7 ';
            }
            
            // Форматируем оставшиеся цифры
            let digits = value;
            
            if (digits.length > 0) {
                if (digits.length <= 3) {
                    formattedValue += digits;
                } else if (digits.length <= 6) {
                    formattedValue += '(' + digits.substring(0, 3) + ') ' + digits.substring(3);
                } else if (digits.length <= 8) {
                    formattedValue += '(' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6);
                } else {
                    formattedValue += '(' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6, 8) + '-' + digits.substring(8, 10);
                }
            }
        }
        
        e.target.value = formattedValue;
    });
    
    // Также добавим обработчик для начального значения
    phoneInput.addEventListener('focus', function() {
        if (!this.value.startsWith('+7') && !this.value) {
            this.value = '+7 ';
        }
    });
}

// ==================== 12. АКТИВНАЯ НАВИГАЦИЯ ПРИ ПРОКРУТКЕ ====================
function setupActiveNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length === 0 || navLinks.length === 0) {
        console.log('Не найдены секции или навигационные ссылки для активного скроллинга');
        return;
    }
    
    // Функция для определения активной секции
    function updateActiveNavOnScroll() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Добавляем небольшой отступ
        
        // Находим текущую секцию
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Если мы в самом верху страницы
        if (scrollPosition < sections[0].offsetTop - 150) {
            currentSectionId = 'home';
        }
        
        // Обновляем активные ссылки
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            // Проверяем, соответствует ли ссылка текущей секции
            if (linkHref === `#${currentSectionId}` || 
                (currentSectionId === 'home' && linkHref === '#home')) {
                link.classList.add('active');
            }
        });
    }
    
    // Слушаем событие прокрутки
    window.addEventListener('scroll', updateActiveNavOnScroll);
    
    // Вызываем сразу для установки начального состояния
    setTimeout(updateActiveNavOnScroll, 100);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Простая валидация для формата +7 (999) 123-45-67
    const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone) || phone.length >= 10;
}

function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#FEE2E2' : type === 'success' ? '#D1FAE5' : '#DBEAFE'};
        color: ${type === 'error' ? '#7F1D1D' : type === 'success' ? '#065F46' : '#1E3A8A'};
        border: 1px solid ${type === 'error' ? '#FCA5A5' : type === 'success' ? '#A7F3D0' : '#BFDBFE'};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
    
    // Добавляем CSS анимации
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showModal(content, title = '') {
    // Удаляем существующий модальный окно
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем модальное окно
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content">
            ${content}
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary modal-ok">ОК</button>
        </div>
    `;
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // Стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #E2E8F0;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #1E293B;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #64748B;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .modal-close:hover {
            background-color: #F1F5F9;
            color: #0F766E;
        }
        
        .modal-content {
            padding: 20px;
            color: #475569;
            line-height: 1.6;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #E2E8F0;
            text-align: right;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    
    // Закрытие модального окна
    const closeBtn = modalOverlay.querySelector('.modal-close');
    const okBtn = modalOverlay.querySelector('.modal-ok');
    
    function closeModal() {
        modalOverlay.style.animation = 'fadeOut 0.3s ease';
        modal.style.animation = 'slideDown 0.3s ease';
        
        setTimeout(() => {
            modalOverlay.remove();
            style.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// ==================== ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ ====================
// Добавляем CSS для улучшения UX
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    /* Улучшаем hover эффекты для курсора мыши */
    @media (hover: hover) {
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .course-card:hover,
        .teacher-card:hover,
        .material-card:hover,
        .pricing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
    }
    
    /* Улучшаем фокус для доступности */
    button:focus,
    input:focus,
    select:focus,
    textarea:focus {
        outline: 2px solid #0D9488;
        outline-offset: 2px;
    }
    
    /* Улучшаем скроллбар */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #F1F5F9;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #CBD5E1;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #94A3B8;
    }
    
    /* Стили для управления видимостью курсов */
    .course-card {
        transition: all 0.4s ease !important;
    }
    
    #showAllCourses, #hideCourses {
        transition: all 0.3s ease;
    }
    
    #showAllCourses:hover, #hideCourses:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
`;
document.head.appendChild(additionalStyles);

// ==================== ДЕБАГ ФУНКЦИИ ====================
// Добавим дебаг функцию для проверки фильтров
function debugFilters() {
    console.log('=== ДЕБАГ ФИЛЬТРОВ ===');
    console.log('Кнопки фильтров:', document.querySelectorAll('.filter-btn').length);
    console.log('Карточки курсов:', document.querySelectorAll('.course-card').length);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        console.log('Фильтр:', btn.textContent, 'data-filter:', btn.getAttribute('data-filter'));
    });
    
    document.querySelectorAll('.course-card').forEach(card => {
        console.log('Карточка:', card.querySelector('h3').textContent, 
                   'data-category:', card.getAttribute('data-category'));
    });
}

// Вызываем дебаг при загрузке
setTimeout(debugFilters, 1000);