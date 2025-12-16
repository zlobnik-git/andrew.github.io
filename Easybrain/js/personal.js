// Личный кабинет - основной функционал
document.addEventListener('DOMContentLoaded', function() {
    console.log('Личный кабинет загружен');
    initPersonalCabinet();
});

function initPersonalCabinet() {
    // Инициализация боковой панели
    initSidebar();
    
    // Уведомления
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotificationsModal();
        });
    }
    
    // Инициализация прогресс-баров
    initProgressBars();
    
    // Поиск
    initSearch();
    
    // Инициализация текущей страницы
    initCurrentPage();
}

// Создаем оверлей для мобильного меню
function createSidebarOverlay() {
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', function() {
            closeSidebar();
        });
    }
}

// Инициализация боковой панели
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('menuToggle');
    
    // Создаем оверлей
    createSidebarOverlay();
    
    // Добавляем кнопку сворачивания если её нет (только на десктопе)
    if (window.innerWidth > 992) {
        addSidebarToggle();
    }
    
    // Мобильное меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    // Закрытие при клике на ссылки в меню (на мобильных)
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeSidebar();
            }
        });
    });
    
    // Обработка ресайза окна
    window.addEventListener('resize', handleResize);
    handleResize(); // Инициализация при загрузке
}

// Переключение боковой панели
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

// Закрытие боковой панели
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Обработка изменения размера окна
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    if (window.innerWidth > 992) {
        // Десктоп: показываем панель, скрываем оверлей
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Показываем кнопку сворачивания
        if (toggleBtn) toggleBtn.style.display = 'flex';
    } else {
        // Мобильные: скрываем панель
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        
        // Скрываем кнопку сворачивания
        if (toggleBtn) toggleBtn.style.display = 'none';
    }
}

// Функция для добавления кнопки сворачивания сайдбара
function addSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || window.innerWidth <= 992) return;
    
    // Проверяем, есть ли уже кнопка
    if (sidebar.querySelector('.sidebar-toggle')) {
        return;
    }
    
    // Создаем кнопку
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    toggleBtn.setAttribute('aria-label', 'Свернуть меню');
    
    // Находим sidebar-header и добавляем кнопку
    const sidebarHeader = sidebar.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.appendChild(toggleBtn);
        
        // Добавляем обработчик клика
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            
            // Меняем иконку
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
        });
    }
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width || bar.getAttribute('style')?.match(/width:\s*([^;]+)/)?.[1] || '0%';
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchCourses(this.value);
            }
        });
        
        // Поиск при вводе (с задержкой)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.trim().length >= 2) {
                    searchCourses(this.value);
                }
            }, 500);
        });
    }
}

function initCurrentPage() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().replace('.html', '');
    
    switch(pageName) {
        case 'index':
            initDashboardPage();
            break;
        case 'courses':
            initCoursesPage();
            break;
        case 'progress':
            initProgressPage();
            break;
        case 'profile':
            initProfilePage();
            break;
        default:
            initDashboardPage();
    }
}

function initDashboardPage() {
    // Инициализация календаря
    initCalendar();
    
    // Загрузка уведомлений
    loadNotifications();
    
    // Обновление статистики
    updateDashboardStats();
}

function initCalendar() {
    const dates = document.querySelectorAll('.calendar-date');
    dates.forEach(date => {
        date.addEventListener('click', function() {
            if (this.classList.contains('has-lesson')) {
                const day = this.textContent.match(/\d+/)?.[0] || this.textContent;
                showLessonDetails(day);
            }
        });
    });
}

function initCoursesPage() {
    // Фильтрация курсов
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    if (filterBtns.length > 0 && courseCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                courseCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category.includes(filter)) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });
            });
        });
    }
    
    // Поиск курсов
    const searchInput = document.getElementById('courseSearch');
    if (searchInput && courseCards.length > 0) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            courseCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    }
    
    // Кнопки действий с курсами
    initCourseActions();
}

function initCourseActions() {
    // Кнопка добавления курса
    const addCourseBtn = document.getElementById('addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', showCourseCatalog);
    }
    
    // Кнопки "Продолжить обучение"
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const course = this.dataset.course;
            startCourse(course);
        });
    });
    
    // Кнопки деталей курса
    document.querySelectorAll('.course-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const course = this.dataset.course;
            showCourseDetails(course);
        });
    });
    
    // Кнопки получения сертификата
    document.querySelectorAll('.get-certificate-btn').forEach(btn => {
        btn.addEventListener('click', generateCertificate);
    });
    
    // Кнопки добавления рекомендованных курсов
    document.querySelectorAll('.add-course-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseName = courseCard.querySelector('h3')?.textContent || 'Новый курс';
            addNewCourse(courseName);
        });
    });
}

function initProgressPage() {
    // Инициализация переключателя периода
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            updateCharts(this.value);
        });
    }
    
    // Кнопка экспорта данных
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportProgressData);
    }
    
    // Кнопки подробной статистики
    document.querySelectorAll('.detailed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const course = this.dataset.course;
            showDetailedStats(course);
        });
    });
    
    // Инициализация графиков (если есть Chart.js)
    if (typeof Chart !== 'undefined') {
        initProgressCharts();
    }
}

function initProfilePage() {
    // Переключение вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                const tabPane = document.getElementById(tabId + 'Tab');
                if (tabPane) {
                    tabPane.classList.add('active');
                }
            });
        });
    }
    
    // Загрузка аватара
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview') || document.getElementById('userAvatar');
    
    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }
    
    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Аватар" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Переключение видимости пароля
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            }
        });
    });
    
    // Форма профиля
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    // Форма смены пароля
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
    
    // Кнопка отмены
    const cancelBtn = document.getElementById('cancelChangesBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Отменить все изменения?')) {
                profileForm.reset();
            }
        });
    }
    
    // Двухфакторная аутентификация
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            if (this.checked) {
                setupTwoFactorAuth();
            } else {
                disableTwoFactorAuth();
            }
        });
    }
}

// Функции для работы с данными
function searchCourses(query) {
    if (query.trim().length < 2) return;
    
    // В реальном проекте здесь был бы AJAX запрос
    console.log('Поиск курсов:', query);
    
    showModal(`
        <h3>Результаты поиска: "${query}"</h3>
        <p>В реальном проекте здесь будут результаты поиска по курсам.</p>
        <div style="background: var(--gray-100); padding: 15px; border-radius: 8px; margin-top: 10px;">
            <strong>Математика ЕГЭ профиль</strong><br>
            <small>Урок 15: Производные сложных функций</small>
        </div>
    `, 'Результаты поиска');
}

function showNotificationsModal() {
    const modalContent = `
        <h3>Все уведомления</h3>
        <div style="max-height: 400px; overflow-y: auto;">
            <div class="notification-item unread">
                <div class="notification-icon info">
                    <i class="fas fa-book"></i>
                </div>
                <div>
                    <div style="font-weight: 600;">Новый урок доступен</div>
                    <p style="color: var(--text-light); margin: 5px 0;">Математика: "Производные сложных функций"</p>
                    <div style="font-size: 0.8rem; color: var(--text-light);">2 часа назад</div>
                </div>
            </div>
            
            <div class="notification-item unread">
                <div class="notification-icon warning">
                    <i class="fas fa-clock"></i>
                </div>
                <div>
                    <div style="font-weight: 600;">Срок сдачи задания</div>
                    <p style="color: var(--text-light); margin: 5px 0;">Задание по информатике нужно сдать до завтра</p>
                    <div style="font-size: 0.8rem; color: var(--text-light);">5 часов назад</div>
                </div>
            </div>
            
            <div class="notification-item">
                <div class="notification-icon success">
                    <i class="fas fa-check"></i>
                </div>
                <div>
                    <div style="font-weight: 600;">Задание проверено</div>
                    <p style="color: var(--text-light); margin: 5px 0;">Вы получили 9/10 баллов за тест по математике</p>
                    <div style="font-size: 0.8rem; color: var(--text-light);">1 день назад</div>
                </div>
            </div>
            
            <div class="notification-item">
                <div class="notification-icon info">
                    <i class="fas fa-video"></i>
                </div>
                <div>
                    <div style="font-weight: 600;">Завтра вебинар</div>
                    <p style="color: var(--text-light); margin: 5px 0;">Не пропустите вебинар по математике в 19:00</p>
                    <div style="font-size: 0.8rem; color: var(--text-light);">2 дня назад</div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'Уведомления');
}

function showLessonDetails(day) {
    const modalContent = `
        <h3>Занятия на ${day} декабря</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="padding: 10px; background: var(--gray-100); border-radius: 8px; margin-bottom: 10px;">
                <strong>Математика</strong><br>
                <small>19:00 - 21:00 • Вебинар "Производные"</small>
            </li>
            <li style="padding: 10px; background: var(--gray-100); border-radius: 8px;">
                <strong>Информатика</strong><br>
                <small>Дедлайн задания "Алгоритмы"</small>
            </li>
        </ul>
    `;
    
    showModal(modalContent, 'Расписание занятий');
}

// Функции для работы с модальными окнами
function showModal(content, title = '') {
    // Удаляем предыдущее модальное окно, если есть
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-header">
            <h3 style="margin: 0;">${title}</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content">
            ${content}
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary modal-ok">Закрыть</button>
        </div>
    `;
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';
    
    // Закрытие
    const closeBtn = modalOverlay.querySelector('.modal-close');
    const okBtn = modalOverlay.querySelector('.modal-ok');
    
    function closeModal() {
        modalOverlay.remove();
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Вспомогательные функции
function loadNotifications() {
    // Загрузка уведомлений с сервера
    console.log('Загрузка уведомлений...');
}

function updateDashboardStats() {
    // Обновление статистики дашборда
    console.log('Обновление статистики...');
}

function showCourseCatalog() {
    const modalContent = `
        <h3>Доступные курсы</h3>
        <p>Выберите новый курс для добавления в ваш учебный план:</p>
        
        <div style="display: grid; gap: var(--space-md); margin-top: var(--space-lg);">
            <div style="padding: var(--space-md); border: 1px solid var(--gray-200); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0 0 5px 0;">Математика база</h4>
                        <p style="margin: 0; color: var(--text-light);">Подготовка к базовому ЕГЭ</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: var(--primary);">2 900 ₽/мес</div>
                        <button class="btn btn-primary btn-small select-course-btn" data-course="math-base">
                            Выбрать
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="padding: var(--space-md); border: 1px solid var(--gray-200); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0 0 5px 0;">Программирование Python</h4>
                        <p style="margin: 0; color: var(--text-light);">Основы для задач ЕГЭ</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: var(--primary);">3 200 ₽/мес</div>
                        <button class="btn btn-primary btn-small select-course-btn" data-course="python">
                            Выбрать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'Выбор курса');
    
    setTimeout(() => {
        document.querySelectorAll('.select-course-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showModal('<p>Курс успешно добавлен! Начните обучение в разделе "Мои курсы".</p>', 'Курс добавлен');
            });
        });
    }, 100);
}

function startCourse(course) {
    showModal(`
        <h3>Начать обучение</h3>
        <p>Вы будете перенаправлены к последнему пройденному уроку курса "${getCourseName(course)}".</p>
        <p>Готовы продолжить?</p>
        <div style="margin-top: var(--space-lg);">
            <button class="btn btn-primary" id="confirmStartCourse">Да, продолжить</button>
            <button class="btn btn-outline" onclick="document.querySelector('.modal-ok').click()">Отмена</button>
        </div>
    `, 'Продолжить обучение');
    
    setTimeout(() => {
        document.getElementById('confirmStartCourse')?.addEventListener('click', function() {
            // В реальном проекте здесь будет переход на страницу урока
            console.log('Начало курса:', course);
            showModal('<p>Переход к уроку... В реальном проекте будет перенаправление.</p>', 'Загрузка');
        });
    }, 100);
}

function showCourseDetails(course) {
    const courseData = {
        'math': {
            name: 'Математика ЕГЭ профиль',
            teacher: 'Анна Сергеева',
            lessons: '24 урока',
            duration: '48 часов',
            rating: '4.8',
            description: 'Полный курс подготовки к профильному ЕГЭ по математике с разбором всех типов задач.'
        },
        'informatics': {
            name: 'Информатика ЕГЭ',
            teacher: 'Михаил Соколов',
            lessons: '20 уроков',
            duration: '40 часов',
            rating: '4.9',
            description: 'Программирование на Python и решение задач ЕГЭ по информатике.'
        },
        'russian': {
            name: 'Русский язык ОГЭ',
            teacher: 'Ольга Иванова',
            lessons: '20 уроков',
            duration: '40 часов',
            rating: '4.7',
            description: 'Подготовка к ОГЭ по русскому языку: изложение, сочинение, тесты.'
        }
    };
    
    const data = courseData[course] || courseData.math;
    
    const modalContent = `
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        
        <div style="background: var(--gray-100); padding: var(--space-md); border-radius: var(--radius-md); margin: var(--space-md) 0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <div>
                    <strong><i class="fas fa-chalkboard-teacher"></i> Преподаватель:</strong>
                    <p>${data.teacher}</p>
                </div>
                <div>
                    <strong><i class="fas fa-video"></i> Уроков:</strong>
                    <p>${data.lessons}</p>
                </div>
                <div>
                    <strong><i class="fas fa-clock"></i> Длительность:</strong>
                    <p>${data.duration}</p>
                </div>
                <div>
                    <strong><i class="fas fa-star"></i> Рейтинг:</strong>
                    <p>${data.rating}/5.0</p>
                </div>
            </div>
        </div>
        
        <h4>Программа курса:</h4>
        <ul>
            <li>Модуль 1: Базовые темы</li>
            <li>Модуль 2: Продвинутые задачи</li>
            <li>Модуль 3: Практика ЕГЭ</li>
            <li>Модуль 4: Итоговое тестирование</li>
        </ul>
    `;
    
    showModal(modalContent, 'Информация о курсе');
}

function generateCertificate() {
    showModal(`
        <h3>Сертификат о прохождении</h3>
        <p>Вы успешно завершили курс! Сгенерировать сертификат?</p>
        <div style="text-align: center; margin: var(--space-lg) 0;">
            <div style="border: 2px dashed var(--primary); padding: var(--space-xl); border-radius: var(--radius-lg); background: var(--background-alt);">
                <h4 style="color: var(--primary);">СЕРТИФИКАТ</h4>
                <p>Выдан: <strong>Алексей Журавлев</strong></p>
                <p>За успешное прохождение курса</p>
                <h3>"Русский язык ОГЭ"</h3>
                <p>Дата: 15.05.2024</p>
            </div>
        </div>
        <button class="btn btn-primary btn-block" id="downloadCertificateBtn">
            <i class="fas fa-download"></i> Скачать сертификат (PDF)
        </button>
    `, 'Сертификат');
    
    setTimeout(() => {
        document.getElementById('downloadCertificateBtn')?.addEventListener('click', function() {
            showModal('<p>Сертификат скачивается... В реальном проекте будет скачан PDF файл.</p>', 'Скачивание');
        });
    }, 100);
}

function addNewCourse(courseName) {
    showModal(`
        <h3>Добавить курс</h3>
        <p>Вы хотите добавить курс "${courseName}" в свой учебный план?</p>
        <p>После добавления курс будет доступен в разделе "Мои курсы".</p>
        
        <div style="margin-top: var(--space-lg);">
            <h4>Выберите тариф:</h4>
            <div style="display: grid; gap: var(--space-sm);">
                <label style="display: flex; align-items: center; padding: var(--space-sm); border: 1px solid var(--gray-200); border-radius: var(--radius-sm);">
                    <input type="radio" name="tariff" value="basic" checked style="margin-right: var(--space-sm);">
                    <div>
                        <strong>Базовый (2 900 ₽/мес)</strong>
                        <div style="font-size: 0.9rem; color: var(--text-light);">Доступ к видеоурокам</div>
                    </div>
                </label>
                
                <label style="display: flex; align-items: center; padding: var(--space-sm); border: 1px solid var(--primary); border-radius: var(--radius-sm); background: var(--background-alt);">
                    <input type="radio" name="tariff" value="standard" style="margin-right: var(--space-sm);">
                    <div>
                        <strong>Стандарт (4 900 ₽/мес)</strong>
                        <div style="font-size: 0.9rem; color: var(--text-light);">Видео + проверка ДЗ + вебинары</div>
                    </div>
                </label>
            </div>
        </div>
        
        <div style="margin-top: var(--space-lg);">
            <button class="btn btn-primary" id="confirmAddCourse">Добавить курс</button>
            <button class="btn btn-outline" onclick="document.querySelector('.modal-ok').click()">Отмена</button>
        </div>
    `, 'Добавление курса');
    
    setTimeout(() => {
        document.getElementById('confirmAddCourse')?.addEventListener('click', function() {
            showModal('<p>Курс успешно добавлен в ваш учебный план!</p>', 'Успешно');
        });
    }, 100);
}

function getCourseName(course) {
    const names = {
        'math': 'Математика ЕГЭ профиль',
        'informatics': 'Информатика ЕГЭ',
        'russian': 'Русский язык ОГЭ',
        'math-base': 'Математика база',
        'python': 'Программирование Python'
    };
    return names[course] || 'Курс';
}

// Функции для страницы прогресса
function initProgressCharts() {
    // Инициализация графиков с Chart.js
    const coursesChartCanvas = document.getElementById('coursesChart');
    const activityChartCanvas = document.getElementById('activityChart');
    
    if (coursesChartCanvas) {
        const ctx = coursesChartCanvas.getContext('2d');
        window.coursesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Математика', 'Информатика', 'Русский', 'Физика'],
                datasets: [{
                    label: 'Прогресс (%)',
                    data: [75, 60, 100, 0],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(209, 213, 219, 0.7)'
                    ],
                    borderColor: [
                        'rgb(37, 99, 235)',
                        'rgb(16, 185, 129)',
                        'rgb(59, 130, 246)',
                        'rgb(209, 213, 219)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    if (activityChartCanvas) {
        const ctx = activityChartCanvas.getContext('2d');
        window.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1 нед', '2 нед', '3 нед', '4 нед', '5 нед', '6 нед', '7 нед'],
                datasets: [{
                    label: 'Часы обучения',
                    data: [8, 7, 9, 6, 8, 10, 7],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true
            }
        });
    }
}

function updateCharts(period) {
    // Обновление графиков в зависимости от периода
    console.log('Обновление графиков для периода:', period);
    
    if (window.coursesChart) {
        const newData = {
            'month': [65, 50, 100, 0],
            '3months': [75, 60, 100, 0],
            '6months': [85, 70, 100, 30],
            'year': [90, 80, 100, 50],
            'all': [95, 85, 100, 70]
        };
        
        window.coursesChart.data.datasets[0].data = newData[period] || newData['3months'];
        window.coursesChart.update();
    }
}

function exportProgressData() {
    showModal(`
        <h3>Экспорт данных</h3>
        <p>Выберите формат для экспорта вашей статистики:</p>
        
        <div style="display: grid; gap: var(--space-sm); margin: var(--space-lg) 0;">
            <button class="btn btn-outline btn-block" id="exportPDF">
                <i class="fas fa-file-pdf"></i> PDF отчет
            </button>
            
            <button class="btn btn-outline btn-block" id="exportExcel">
                <i class="fas fa-file-excel"></i> Excel таблица
            </button>
            
            <button class="btn btn-outline btn-block" id="exportCSV">
                <i class="fas fa-file-csv"></i> CSV данные
            </button>
            
            <button class="btn btn-outline btn-block" id="exportJSON">
                <i class="fas fa-code"></i> JSON данные
            </button>
        </div>
        
        <div style="background: var(--gray-100); padding: var(--space-md); border-radius: var(--radius-md);">
            <h4 style="margin-top: 0;">Что будет включено:</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Статистика по всем курсам</li>
                <li>Графики прогресса</li>
                <li>Детальная успеваемость</li>
                <li>Достижения и награды</li>
            </ul>
        </div>
    `, 'Экспорт данных');
    
    setTimeout(() => {
        document.getElementById('exportPDF')?.addEventListener('click', function() {
            downloadFile('pdf');
        });
        document.getElementById('exportExcel')?.addEventListener('click', function() {
            downloadFile('excel');
        });
        document.getElementById('exportCSV')?.addEventListener('click', function() {
            downloadFile('csv');
        });
        document.getElementById('exportJSON')?.addEventListener('click', function() {
            downloadFile('json');
        });
    }, 100);
}

function downloadFile(format) {
    showModal(`
        <h3>Экспорт завершён</h3>
        <p>Ваши данные успешно экспортированы в формате ${format.toUpperCase()}.</p>
        <p>В реальном проекте файл автоматически скачается.</p>
        <div style="text-align: center; margin: var(--space-lg) 0;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success);"></i>
        </div>
        <p style="text-align: center; font-size: 0.9rem; color: var(--text-light);">
            Размер файла: ~${format === 'pdf' ? '1.2' : format === 'excel' ? '0.8' : '0.3'} МБ
        </p>
    `, 'Экспорт завершён');
}

function showDetailedStats(course) {
    const courseData = {
        'math': {
            name: 'Математика ЕГЭ профиль',
            stats: {
                totalLessons: 24,
                completedLessons: 18,
                totalTasks: 30,
                completedTasks: 22,
                averageScore: 4.8,
                timeSpent: '32 часа',
                bestTopic: 'Производные',
                weakTopic: 'Геометрия'
            }
        },
        'informatics': {
            name: 'Информатика ЕГЭ',
            stats: {
                totalLessons: 20,
                completedLessons: 12,
                totalTasks: 25,
                completedTasks: 15,
                averageScore: 4.5,
                timeSpent: '24 часа',
                bestTopic: 'Алгоритмы',
                weakTopic: 'Программирование'
            }
        }
    };
    
    const data = courseData[course] || courseData.math;
    
    const modalContent = `
        <h3>Детальная статистика: ${data.name}</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin: var(--space-lg) 0;">
            <div style="background: var(--gray-100); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="font-size: 0.9rem; color: var(--text-light);">Уроков пройдено</div>
                <div style="font-size: 1.5rem; font-weight: 600; color: var(--primary);">
                    ${data.stats.completedLessons}/${data.stats.totalLessons}
                </div>
                <div class="progress-bar" style="margin-top: 10px;">
                    <div class="progress-fill" style="width: ${(data.stats.completedLessons/data.stats.totalLessons)*100}%"></div>
                </div>
            </div>
            
            <div style="background: var(--gray-100); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="font-size: 0.9rem; color: var(--text-light);">Заданий выполнено</div>
                <div style="font-size: 1.5rem; font-weight: 600; color: var(--primary);">
                    ${data.stats.completedTasks}/${data.stats.totalTasks}
                </div>
                <div class="progress-bar" style="margin-top: 10px;">
                    <div class="progress-fill" style="width: ${(data.stats.completedTasks/data.stats.totalTasks)*100}%"></div>
                </div>
            </div>
        </div>
        
        <div style="background: var(--background-alt); padding: var(--space-md); border-radius: var(--radius-md);">
            <h4 style="margin-top: 0;">Другие показатели:</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <div>
                    <strong>Средний балл:</strong>
                    <div style="color: var(--primary); font-weight: 600;">${data.stats.averageScore}/5.0</div>
                </div>
                
                <div>
                    <strong>Время обучения:</strong>
                    <div style="color: var(--primary); font-weight: 600;">${data.stats.timeSpent}</div>
                </div>
                
                <div>
                    <strong>Лучшая тема:</strong>
                    <div style="color: var(--success); font-weight: 600;">${data.stats.bestTopic}</div>
                </div>
                
                <div>
                    <strong>Слабая тема:</strong>
                    <div style="color: var(--warning); font-weight: 600;">${data.stats.weakTopic}</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: var(--space-lg);">
            <h4>Рекомендации:</h4>
            <ul>
                <li>Сосредоточьтесь на теме "${data.stats.weakTopic}"</li>
                <li>Попробуйте дополнительные практические задания</li>
                <li>Посмотрите вебинары по сложным темам</li>
            </ul>
        </div>
    `;
    
    showModal(modalContent, 'Детальная статистика');
}

// Функции для страницы профиля
function saveProfile() {
    const formData = {
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        birthDate: document.getElementById('birthDate')?.value || '',
        city: document.getElementById('city')?.value || '',
        about: document.getElementById('about')?.value || '',
        education: document.getElementById('education')?.value || '',
        class: document.getElementById('class')?.value || ''
    };
    
    // В реальном проекте здесь был бы AJAX запрос
    console.log('Сохранение профиля:', formData);
    
    showModal(`
        <h3>Профиль обновлён</h3>
        <p>Ваши данные успешно сохранены.</p>
        <div style="text-align: center; margin: var(--space-lg) 0;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success);"></i>
        </div>
    `, 'Успешно');
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword')?.value || '';
    const newPassword = document.getElementById('newPassword')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';
    
    if (newPassword !== confirmPassword) {
        showModal('<p>Новый пароль и подтверждение не совпадают.</p>', 'Ошибка');
        return;
    }
    
    if (newPassword.length < 8) {
        showModal('<p>Пароль должен содержать минимум 8 символов.</p>', 'Ошибка');
        return;
    }
    
    // В реальном проекте здесь был бы AJAX запрос
    console.log('Смена пароля');
    
    showModal(`
        <h3>Пароль изменён</h3>
        <p>Ваш пароль успешно обновлён.</p>
        <p style="font-size: 0.9rem; color: var(--text-light);">
            В следующий раз используйте новый пароль для входа.
        </p>
    `, 'Успешно');
    
    // Очищаем форму
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.reset();
    }
}

function setupTwoFactorAuth() {
    showModal(`
        <h3>Настройка двухфакторной аутентификации</h3>
        <p>Для включения двухфакторной аутентификации:</p>
        <ol>
            <li>Установите приложение Google Authenticator</li>
            <li>Отсканируйте QR-код ниже</li>
            <li>Введите код из приложения</li>
        </ol>
        
        <div style="text-align: center; margin: var(--space-lg) 0;">
            <div style="display: inline-block; padding: 20px; background: white; border: 1px solid var(--gray-200);">
                [QR-код будет здесь]
            </div>
        </div>
        
        <div class="form-group">
            <label for="authCode">Код из приложения</label>
            <input type="text" id="authCode" placeholder="000000" maxlength="6">
        </div>
        
        <div style="margin-top: var(--space-lg);">
            <button class="btn btn-primary" id="confirm2FABtn">Подтвердить и включить</button>
            <button class="btn btn-outline" onclick="document.querySelector('.modal-ok').click()">Отмена</button>
        </div>
    `, 'Двухфакторная аутентификация');
    
    setTimeout(() => {
        document.getElementById('confirm2FABtn')?.addEventListener('click', function() {
            const authCode = document.getElementById('authCode')?.value;
            if (authCode && authCode.length === 6) {
                showModal('<p>Двухфакторная аутентификация успешно включена!</p>', 'Успешно');
            } else {
                showModal('<p>Пожалуйста, введите 6-значный код из приложения.</p>', 'Ошибка');
            }
        });
    }, 100);
}

function disableTwoFactorAuth() {
    showModal(`
        <h3>Отключение двухфакторной аутентификации</h3>
        <p>Вы уверены, что хотите отключить двухфакторную аутентификацию?</p>
        <p style="color: var(--warning);">Это снизит безопасность вашего аккаунта.</p>
        
        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-lg);">
            <button class="btn btn-danger" id="confirmDisable2FA">Да, отключить</button>
            <button class="btn btn-outline" onclick="document.querySelector('.modal-ok').click()">Отмена</button>
        </div>
    `, 'Подтверждение');
    
    setTimeout(() => {
        document.getElementById('confirmDisable2FA')?.addEventListener('click', function() {
            document.getElementById('twoFactorToggle').checked = false;
            showModal('<p>Двухфакторная аутентификация отключена.</p>', 'Успешно');
        });
    }, 100);
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: var(--space-md);
        background: var(--white);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        animation: slideInRight 0.3s ease;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    notification.innerHTML = `
        <span style="font-weight: bold; color: var(--${type});">${icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавляем анимации для уведомлений
if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification.success {
            border-left: 4px solid var(--success);
        }
        
        .notification.error {
            border-left: 4px solid var(--danger);
        }
        
        .notification.info {
            border-left: 4px solid var(--primary);
        }
    `;
    document.head.appendChild(style);
}

// Инициализация вкладок
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все вкладки
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Показываем нужную вкладку
            const targetPane = document.getElementById(tabId + 'Tab');
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Инициализация модальных окон
function initModals() {
    // Создаем структуру для модальных окон если её нет
    if (!document.querySelector('.modal-overlay')) {
        const modalHTML = `
            <div class="modal-overlay" style="display: none;">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title"></h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-content"></div>
                    <div class="modal-footer">
                        <button class="btn btn-primary modal-ok">OK</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Обработчики для модальных окон
    document.querySelectorAll('.modal-close, .modal-ok').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.modal-overlay').style.display = 'none';
        });
    });
    
    // Закрытие по клику вне модального окна
    document.querySelector('.modal-overlay')?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

// Переключение видимости пароля
function initPasswordToggle() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-password')) {
            const toggleBtn = e.target.closest('.toggle-password');
            const targetId = toggleBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = toggleBtn.querySelector('i');
            
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            }
        }
    });
}

// Фильтрация курсов
function filterCourses(category) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category').includes(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Поиск курсов
function searchCourses(query) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || desc.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}