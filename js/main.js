/**
 * ============================================================================
 * DYING LIGHT 2: STAY HUMAN — КУРСОВОЙ ПРОЕКТ
 * Основной интерактивный скрипт (main.js)
 * Реализация: переключение День/Ночь, мобильное меню, плавный скролл,
 * фильтры бестиария, вкладки механик и системных требований, симулятор города
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------------
     * 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ: ДЕНЬ / НОЧЬ (DAY / NIGHT THEME TOGGLE)
     * ------------------------------------------------------------------------ */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const toggleLabel = document.getElementById('toggle-label');
    const uvFlash = document.getElementById('uv-flash');
    const bioSensor = document.getElementById('bio-sensor');
    const bioBar = document.getElementById('bio-bar');
    const bioTimer = document.getElementById('bio-timer');
    const mobileBioStatus = document.getElementById('mobile-bio-status');

    // Проверяем сохраненную тему в localStorage (по умолчанию night)
    const savedTheme = localStorage.getItem('dl2_theme') || 'night';
    applyTheme(savedTheme, false);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('theme-night') ? 'night' : 'day';
        const newTheme = currentTheme === 'night' ? 'day' : 'night';
        applyTheme(newTheme, true);
    });

    function applyTheme(theme, animateFlash) {
        if (theme === 'night') {
            document.body.classList.remove('theme-day');
            document.body.classList.add('theme-night');
            document.documentElement.setAttribute('data-theme', 'night');
            if (toggleLabel) toggleLabel.textContent = 'НОЧЬ';
            
            // Настройка HUD биомаркера под ночной режим (УФ-защита)
            if (bioSensor) {
                bioSensor.style.background = 'var(--color-uv-purple)';
                bioSensor.style.boxShadow = '0 0 12px var(--color-uv-purple)';
            }
            if (bioBar) {
                bioBar.style.width = '75%';
                bioBar.style.background = 'var(--color-uv-purple)';
            }
            if (bioTimer) bioTimer.textContent = 'UV 12:45';
            if (mobileBioStatus) mobileBioStatus.textContent = 'UV Защита';

            if (animateFlash && uvFlash) {
                triggerUvFlash('rgba(168, 85, 247, 0.45)');
            }
        } else {
            document.body.classList.remove('theme-night');
            document.body.classList.add('theme-day');
            document.documentElement.setAttribute('data-theme', 'day');
            if (toggleLabel) toggleLabel.textContent = 'ДЕНЬ';
            
            // Настройка HUD биомаркера под дневной режим (Солнечный свет)
            if (bioSensor) {
                bioSensor.style.background = 'var(--color-safe-green)';
                bioSensor.style.boxShadow = '0 0 10px var(--color-safe-green)';
            }
            if (bioBar) {
                bioBar.style.width = '100%';
                bioBar.style.background = 'var(--color-safe-green)';
            }
            if (bioTimer) bioTimer.textContent = 'SAFE SUN';
            if (mobileBioStatus) mobileBioStatus.textContent = 'Солнечный свет';

            if (animateFlash && uvFlash) {
                triggerUvFlash('rgba(255, 230, 0, 0.4)');
            }
        }
        localStorage.setItem('dl2_theme', theme);
    }

    function triggerUvFlash(color) {
        if (!uvFlash) return;
        uvFlash.style.background = `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 80%)`;
        uvFlash.classList.add('active');
        setTimeout(() => {
            uvFlash.classList.remove('active');
        }, 350);
    }

    /* ------------------------------------------------------------------------
     * 2. МОБИЛЬНОЕ МЕНЮ (DRAWER & OVERLAY)
     * ------------------------------------------------------------------------ */
    const mobileBurger = document.getElementById('mobile-burger');
    const mobileClose = document.getElementById('mobile-close');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileMenu() {
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileBurger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileDrawer.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileBurger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (mobileBurger) mobileBurger.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    /* ------------------------------------------------------------------------
     * 3. ПЛАВНЫЙ СКРОЛЛ И ПОДСВЕТКА АКТИВНЫХ ПУНКТОВ (SMOOTH SCROLL & SPY)
     * ------------------------------------------------------------------------ */
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = 76;

    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ScrollSpy для активной ссылки в шапке
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ------------------------------------------------------------------------
     * 4. ВКЛАДКИ МЕХАНИК (GAMEPLAY MECHANICS TABS)
     * ------------------------------------------------------------------------ */
    const mechTabButtons = document.querySelectorAll('.mech-tab-btn');
    const mechTabPanels = document.querySelectorAll('.mech-tab-panel');

    mechTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            mechTabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            mechTabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(`tab-${tabName}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    /* ------------------------------------------------------------------------
     * 5. ИНТЕРАКТИВНЫЙ БЕСТИАРИЙ: ФИЛЬТРАЦИЯ И АККОРДЕОН КАРТОЧЕК
     * ------------------------------------------------------------------------ */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const zombieCards = document.querySelectorAll('.zombie-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            zombieCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInTab 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Раскрытие подробного досье зараженного
    const expandButtons = document.querySelectorAll('.zombie-expand-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const detailBlock = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                detailBlock.hidden = true;
                btn.innerHTML = 'Подробное досье <i class="fa-solid fa-chevron-down"></i>';
            } else {
                btn.setAttribute('aria-expanded', 'true');
                detailBlock.hidden = false;
                btn.innerHTML = 'Скрыть досье <i class="fa-solid fa-chevron-up"></i>';
            }
        });
    });

    /* ------------------------------------------------------------------------
     * 6. ВКЛАДКИ СИСТЕМНЫХ ТРЕБОВАНИЙ (SYSTEM REQUIREMENTS TABS)
     * ------------------------------------------------------------------------ */
    const reqModeButtons = document.querySelectorAll('.req-mode-btn');
    const reqTables = document.querySelectorAll('.req-table-container');

    reqModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            reqModeButtons.forEach(b => b.classList.remove('active'));
            reqTables.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const targetReq = btn.getAttribute('data-req');
            const targetTable = document.getElementById(`req-${targetReq}`);
            if (targetTable) {
                targetTable.classList.add('active');
            }
        });
    });

    /* ------------------------------------------------------------------------
     * 7. СИМУЛЯТОР ВЛИЯНИЯ ФРАКЦИЙ НА ГОРОД (CITY ALIGNMENT SLIDER)
     * ------------------------------------------------------------------------ */
    const alignmentSlider = document.getElementById('alignment-slider');
    const alignmentBadge = document.getElementById('alignment-badge');
    const alignmentText = document.getElementById('alignment-text');

    if (alignmentSlider && alignmentBadge && alignmentText) {
        alignmentSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);

            if (val < 35) {
                alignmentBadge.textContent = 'Доминирование Выживших (Survivors)';
                alignmentBadge.style.color = 'var(--color-safe-green)';
                alignmentBadge.style.borderColor = 'var(--color-safe-green)';
                alignmentBadge.style.background = 'rgba(16, 185, 129, 0.12)';
                alignmentText.textContent = 'Крыши Вилледора покрыты батутами, канатами и подушками. Перемещение по городу максимально быстрое и безопасное от падений.';
            } else if (val > 65) {
                alignmentBadge.textContent = 'Милитаризация Миротворцев (PK Control)';
                alignmentBadge.style.color = 'var(--color-cyan)';
                alignmentBadge.style.borderColor = 'var(--color-cyan)';
                alignmentBadge.style.background = 'rgba(0, 229, 255, 0.12)';
                alignmentText.textContent = 'Улицы оснащены электрическими турелями, взрывными автомобильными ловушками и шипами. В боях доступен полуавтоматический арбалет.';
            } else {
                alignmentBadge.textContent = 'Сбалансированный город (Баланс сил)';
                alignmentBadge.style.color = 'var(--color-dl-yellow)';
                alignmentBadge.style.borderColor = 'var(--color-dl-yellow)';
                alignmentBadge.style.background = 'rgba(255, 230, 0, 0.12)';
                alignmentText.textContent = 'В городе поровну распределены средства паркурной мобильности и защитные ловушки Миротворцев.';
            }
        });
    }

    // Выбор фракции из карточки (интерактивный клик)
    const factionSelectBtns = document.querySelectorAll('.faction-select-btn');
    factionSelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const faction = this.getAttribute('data-faction');
            if (faction === 'survivors') {
                if (alignmentSlider) {
                    alignmentSlider.value = 15;
                    alignmentSlider.dispatchEvent(new Event('input'));
                }
            } else if (faction === 'peacekeepers') {
                if (alignmentSlider) {
                    alignmentSlider.value = 85;
                    alignmentSlider.dispatchEvent(new Event('input'));
                }
            } else {
                alert('Ренегаты — враждебная банда. Союз с ними приведет к террору в городе!');
            }
        });
    });

    /* ------------------------------------------------------------------------
     * 8. КНОПКА «НАВЕРХ» (BACK TO TOP)
     * ------------------------------------------------------------------------ */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ------------------------------------------------------------------------
     * 9. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (INTERSECTION OBSERVER REVEAL)
     * ------------------------------------------------------------------------ */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Фоллбэк для старых браузеров
        revealElements.forEach(el => el.classList.add('active'));
    }

    console.log('%c DYING LIGHT 2: STAY HUMAN ', 'background: #ffe600; color: #000; font-weight: bold; font-size: 14px; padding: 4px;');
    console.log('%c Курсовой проект успешно инициализирован. Stay Human! ', 'color: #a855f7; font-weight: bold;');
});
