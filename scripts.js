/* ============================================
   LUXURY HOTEL - CAROUSEL & INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // CAROUSEL FUNCTIONALITY
    // ========================================
    const carousel = {
        slides: document.querySelectorAll('.carousel-slide'),
        indicators: document.querySelectorAll('.indicator'),
        prevButton: document.getElementById('prev-slide'),
        nextButton: document.getElementById('next-slide'),
        currentSlide: 0,
        totalSlides: 6,
        autoPlayInterval: null,
        autoPlayDelay: 5000, // 5 seconds per slide
        isPlaying: true,

        init() {
            this.bindEvents();
            this.startAutoPlay();
        },

        bindEvents() {
            // Navigation arrows
            this.prevButton.addEventListener('click', () => this.prevSlide());
            this.nextButton.addEventListener('click', () => this.nextSlide());

            // Indicator buttons
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            // Pause on hover
            const heroSection = document.getElementById('hero');
            heroSection.addEventListener('mouseenter', () => this.pauseAutoPlay());
            heroSection.addEventListener('mouseleave', () => this.startAutoPlay());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });

            // Touch/Swipe support
            this.addSwipeSupport(heroSection);
        },

        goToSlide(index) {
            // Remove active class from current slide
            this.slides[this.currentSlide].classList.remove('active');
            this.indicators[this.currentSlide].classList.remove('active');

            // Update current slide index
            this.currentSlide = index;

            // Handle infinite loop
            if (this.currentSlide >= this.totalSlides) {
                this.currentSlide = 0;
            } else if (this.currentSlide < 0) {
                this.currentSlide = this.totalSlides - 1;
            }

            // Add active class to new slide
            this.slides[this.currentSlide].classList.add('active');
            this.indicators[this.currentSlide].classList.add('active');
        },

        nextSlide() {
            this.goToSlide(this.currentSlide + 1);
        },

        prevSlide() {
            this.goToSlide(this.currentSlide - 1);
        },

        startAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }
            this.isPlaying = true;
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        },

        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
            this.isPlaying = false;
        },

        addSwipeSupport(element) {
            let startX = 0;
            let endX = 0;
            const threshold = 50;

            element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            element.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            }, { passive: true });

            element.addEventListener('touchend', () => {
                const diff = startX - endX;
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });
        }
    };

    // Initialize carousel
    carousel.init();

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    let isMobileMenuOpen = false;

    function openMobileMenu() {
        isMobileMenuOpen = true;
        mobileMenuToggle.classList.add('active');
        mainNav.classList.add('mobile-open');
        document.body.style.overflow = 'hidden'; // Lock body scroll
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('mobile-open');
        document.body.style.overflow = ''; // Restore body scroll
    }

    function toggleMobileMenu() {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileMenuToggle && mainNav) {
        // Toggle button click
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking on nav links
        const navLinks = mainNav.querySelectorAll('.nav-link:not(.reviews-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close menu on resize if screen becomes larger
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close menu when clicking outside (on the overlay background)
        mainNav.addEventListener('click', (e) => {
            if (e.target === mainNav && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // ========================================
    // SEARCH BUTTON INTERACTION
    // ========================================
    const searchButton = document.querySelector('.search-button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Add your search modal/overlay logic here
            console.log('Search clicked - implement search modal');
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // ========================================
    // PRELOAD IMAGES FOR SMOOTHER TRANSITIONS
    // ========================================
    function preloadImages() {
        const images = document.querySelectorAll('.carousel-slide img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            const preloadImg = new Image();
            preloadImg.src = src;
        });
    }

    preloadImages();

    // ========================================
    // SMOOTH NAVIGATION LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // ROOMS CAROUSEL FUNCTIONALITY
    // ========================================
    const roomsCarousel = {
        track: document.getElementById('rooms-track'),
        cards: document.querySelectorAll('.room-carousel-card'),
        prevButton: document.getElementById('rooms-prev'),
        nextButton: document.getElementById('rooms-next'),
        indicators: document.querySelectorAll('#rooms-indicators .indicator'),
        currentIndex: 0,
        cardsToShow: 3,
        cardWidth: 0,
        gap: 25,
        autoPlayInterval: null,
        autoPlayDelay: 4000, // 4 seconds between auto-scrolls
        isPlaying: true,

        init() {
            if (!this.track || this.cards.length === 0) return;
            
            this.calculateDimensions();
            this.bindEvents();
            this.updateIndicators();
            this.startAutoPlay();
            
            // Recalculate on window resize
            window.addEventListener('resize', () => {
                this.calculateDimensions();
                this.updatePosition();
            });
        },

        calculateDimensions() {
            const containerWidth = this.track.parentElement.offsetWidth;
            
            // Responsive cards to show
            if (window.innerWidth <= 480) {
                this.cardsToShow = 1;
            } else if (window.innerWidth <= 768) {
                this.cardsToShow = 1.2;
            } else if (window.innerWidth <= 992) {
                this.cardsToShow = 2;
            } else if (window.innerWidth <= 1200) {
                this.cardsToShow = 2.5;
            } else {
                this.cardsToShow = 3;
            }
            
            this.cardWidth = (containerWidth - (this.gap * (Math.floor(this.cardsToShow) - 1))) / this.cardsToShow;
        },

        bindEvents() {
            this.prevButton.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
            this.nextButton.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
            
            // Indicator clicks
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                });
            });
            
            // Pause on hover
            const section = document.getElementById('rooms');
            if (section) {
                section.addEventListener('mouseenter', () => this.pauseAutoPlay());
                section.addEventListener('mouseleave', () => this.startAutoPlay());
            }
            
            // Touch/Swipe support
            this.addSwipeSupport();
        },

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                // Loop to end
                this.currentIndex = this.cards.length - Math.floor(this.cardsToShow);
            }
            this.updatePosition();
            this.updateIndicators();
        },

        next() {
            const maxIndex = this.cards.length - Math.floor(this.cardsToShow);
            if (this.currentIndex < maxIndex) {
                this.currentIndex++;
            } else {
                // Loop to beginning
                this.currentIndex = 0;
            }
            this.updatePosition();
            this.updateIndicators();
        },

        goToSlide(index) {
            const maxIndex = this.cards.length - Math.floor(this.cardsToShow);
            this.currentIndex = Math.min(index, maxIndex);
            this.updatePosition();
            this.updateIndicators();
        },

        updatePosition() {
            const offset = this.currentIndex * (this.cardWidth + this.gap);
            this.track.style.transform = `translateX(-${offset}px)`;
        },

        updateIndicators() {
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // Always show buttons active since we have infinite loop
            this.prevButton.style.opacity = '1';
            this.prevButton.style.pointerEvents = 'auto';
            this.nextButton.style.opacity = '1';
            this.nextButton.style.pointerEvents = 'auto';
        },

        startAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }
            this.isPlaying = true;
            this.autoPlayInterval = setInterval(() => {
                this.next();
            }, this.autoPlayDelay);
        },

        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
            this.isPlaying = false;
        },

        resetAutoPlay() {
            this.pauseAutoPlay();
            this.startAutoPlay();
        },

        addSwipeSupport() {
            let startX = 0;
            let endX = 0;
            const threshold = 50;
            const container = this.track.parentElement;

            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.pauseAutoPlay();
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            }, { passive: true });

            container.addEventListener('touchend', () => {
                const diff = startX - endX;
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
                this.startAutoPlay();
            });
        }
    };

    // Initialize rooms carousel
    roomsCarousel.init();

    // ========================================
    // GALLERY FILTER FUNCTIONALITY
    // ========================================
    const galleryFilter = {
        tabs: document.querySelectorAll('.gallery-tab'),
        items: document.querySelectorAll('.gallery-item'),
        grid: document.getElementById('gallery-grid'),
        currentFilter: 'all',

        init() {
            if (!this.tabs.length || !this.items.length) return;
            
            this.bindEvents();
        },

        bindEvents() {
            this.tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const filter = tab.dataset.filter;
                    this.filterItems(filter);
                    this.setActiveTab(tab);
                });
            });
        },

        filterItems(filter) {
            this.currentFilter = filter;
            
            this.items.forEach((item) => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        },

        setActiveTab(activeTab) {
            this.tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            activeTab.classList.add('active');
        }
    };

    // Initialize gallery filter
    galleryFilter.init();

    // ========================================
    // CUSTOM DATE PICKER / CALENDAR
    // ========================================
    class CustomCalendar {
        constructor(container) {
            this.container = container;
            this.inputId = container.dataset.input;
            this.hiddenInput = container.querySelector('input[type="hidden"]');
            this.dateDisplay = container.querySelector('.date-display');
            this.dateText = container.querySelector('.date-text');
            this.popup = container.querySelector('.calendar-popup');
            
            this.currentDate = new Date();
            this.selectedDate = null;
            this.viewMonth = this.currentDate.getMonth();
            this.viewYear = this.currentDate.getFullYear();
            
            this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
            this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            this.init();
        }
        
        init() {
            this.renderCalendar();
            this.bindEvents();
        }
        
        renderCalendar() {
            this.popup.innerHTML = `
                <div class="calendar-header">
                    <span class="calendar-title">${this.monthNames[this.viewMonth]} ${this.viewYear}</span>
                    <div class="calendar-nav-group">
                        <button class="calendar-nav prev" aria-label="Previous month">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>
                        <button class="calendar-nav next" aria-label="Next month">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="calendar-weekdays">
                    ${this.dayNames.map(day => `<span>${day}</span>`).join('')}
                </div>
                <div class="calendar-days">
                    ${this.renderDays()}
                </div>
            `;
            
            this.bindCalendarEvents();
        }
        
        renderDays() {
            const firstDay = new Date(this.viewYear, this.viewMonth, 1).getDay();
            const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(this.viewYear, this.viewMonth, 0).getDate();
            const today = new Date();
            
            let days = '';
            
            // Previous month days
            for (let i = firstDay - 1; i >= 0; i--) {
                days += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
            }
            
            // Current month days
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.viewYear, this.viewMonth, day);
                const isToday = this.isToday(date);
                const isSelected = this.isSelected(date);
                const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                
                let classes = 'calendar-day';
                if (isToday) classes += ' today';
                if (isSelected) classes += ' selected';
                if (isPast) classes += ' disabled';
                
                days += `<div class="${classes}" data-date="${this.viewYear}-${String(this.viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</div>`;
            }
            
            // Next month days
            const totalDays = firstDay + daysInMonth;
            const remainingDays = totalDays > 35 ? 42 - totalDays : 35 - totalDays;
            for (let day = 1; day <= remainingDays; day++) {
                days += `<div class="calendar-day other-month">${day}</div>`;
            }
            
            return days;
        }
        
        isToday(date) {
            const today = new Date();
            return date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
        }
        
        isSelected(date) {
            if (!this.selectedDate) return false;
            return date.getDate() === this.selectedDate.getDate() && 
                   date.getMonth() === this.selectedDate.getMonth() && 
                   date.getFullYear() === this.selectedDate.getFullYear();
        }
        
        bindEvents() {
            // Toggle calendar popup
            this.dateDisplay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePopup();
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.closePopup();
                }
            });
        }
        
        bindCalendarEvents() {
            // Navigation
            const prevBtn = this.popup.querySelector('.calendar-nav.prev');
            const nextBtn = this.popup.querySelector('.calendar-nav.next');
            
            prevBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateMonth(-1);
            });
            
            nextBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateMonth(1);
            });
            
            // Day selection
            this.popup.querySelectorAll('.calendar-day:not(.disabled):not(.other-month)').forEach(day => {
                day.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectDate(day.dataset.date);
                });
            });
        }
        
        navigateMonth(direction) {
            this.viewMonth += direction;
            if (this.viewMonth < 0) {
                this.viewMonth = 11;
                this.viewYear--;
            } else if (this.viewMonth > 11) {
                this.viewMonth = 0;
                this.viewYear++;
            }
            this.renderCalendar();
        }
        
        selectDate(dateString) {
            this.selectedDate = new Date(dateString + 'T00:00:00');
            this.hiddenInput.value = dateString;
            
            // Format date for display
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            this.dateText.textContent = this.selectedDate.toLocaleDateString('en-US', options);
            this.dateText.classList.add('has-date');
            
            // Animation
            const selectedDay = this.popup.querySelector(`[data-date="${dateString}"]`);
            selectedDay?.classList.add('just-selected');
            
            // Close after short delay
            setTimeout(() => {
                this.closePopup();
            }, 200);
            
            this.renderCalendar();
        }
        
        togglePopup() {
            if (this.popup.classList.contains('show')) {
                this.closePopup();
            } else {
                this.openPopup();
            }
        }
        
        openPopup() {
            // Close other calendars
            document.querySelectorAll('.calendar-popup.show').forEach(popup => {
                popup.classList.remove('show');
                popup.closest('.custom-date-picker')?.classList.remove('active');
            });
            
            this.container.classList.add('active');
            this.popup.classList.add('show');
        }
        
        closePopup() {
            this.container.classList.remove('active');
            this.popup.classList.remove('show');
        }
    }
    
    // Initialize all custom date pickers
    document.querySelectorAll('.custom-date-picker').forEach(picker => {
        new CustomCalendar(picker);
    });

    // ========================================
    // FAQ ACCORDION FUNCTIONALITY
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If this item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ========================================
    // HALF-MOON REVIEWS CAROUSEL
    // ========================================
    const halfmoonCarousel = {
        container: document.getElementById('halfmoon-reviews'),
        toggle: document.getElementById('halfmoon-toggle'),
        carousel: document.getElementById('halfmoon-carousel'),
        slides: document.querySelectorAll('.review-slide'),
        dots: document.querySelectorAll('.halfmoon-dots .dot'),
        currentSlide: 0,
        totalSlides: 5,
        autoPlayInterval: null,
        autoPlayDelay: 4000, // 4 seconds per slide
        isPlaying: true,

        init() {
            if (!this.container || !this.slides.length) return;
            
            this.bindEvents();
            this.startAutoPlay();
        },

        bindEvents() {
            // Toggle button - expand/collapse the carousel
            if (this.toggle) {
                this.toggle.addEventListener('click', () => {
                    this.container.classList.toggle('collapsed');
                    if (this.container.classList.contains('collapsed')) {
                        this.pauseAutoPlay();
                    } else {
                        this.startAutoPlay();
                    }
                });
            }

            // Dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                });
            });

            // Pause on hover
            if (this.carousel) {
                this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
                this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
            }

            // Touch/Swipe support for mobile
            this.addSwipeSupport();
        },

        goToSlide(index) {
            // Mark current slide as exiting
            this.slides[this.currentSlide].classList.add('exiting');
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');

            // Update current index
            this.currentSlide = index;

            // Handle infinite loop
            if (this.currentSlide >= this.totalSlides) {
                this.currentSlide = 0;
            } else if (this.currentSlide < 0) {
                this.currentSlide = this.totalSlides - 1;
            }

            // Activate new slide
            setTimeout(() => {
                this.slides.forEach(slide => slide.classList.remove('exiting'));
                this.slides[this.currentSlide].classList.add('active');
                this.dots[this.currentSlide].classList.add('active');
            }, 50);
        },

        nextSlide() {
            this.goToSlide(this.currentSlide + 1);
        },

        prevSlide() {
            this.goToSlide(this.currentSlide - 1);
        },

        startAutoPlay() {
            if (this.container.classList.contains('collapsed')) return;
            
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }
            this.isPlaying = true;
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        },

        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
            this.isPlaying = false;
        },

        resetAutoPlay() {
            this.pauseAutoPlay();
            this.startAutoPlay();
        },

        addSwipeSupport() {
            if (!this.carousel) return;
            
            let startX = 0;
            let endX = 0;
            const threshold = 50;

            this.carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.pauseAutoPlay();
            }, { passive: true });

            this.carousel.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            }, { passive: true });

            this.carousel.addEventListener('touchend', () => {
                const diff = startX - endX;
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                this.startAutoPlay();
            });
        }
    };

    // Initialize half-moon reviews carousel (if present - for backwards compatibility)
    if (document.getElementById('halfmoon-reviews')) {
        halfmoonCarousel.init();
    }

    // ========================================
    // HEADER REVIEWS TOGGLE PANEL
    // ========================================
    const headerReviewsToggle = {
        toggle: document.getElementById('header-reviews-toggle'),
        panel: document.getElementById('header-reviews-panel'),
        isOpen: false,

        init() {
            if (!this.toggle || !this.panel) return;
            
            this.bindEvents();
        },

        bindEvents() {
            // Toggle button click
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePanel();
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && 
                    !this.panel.contains(e.target) && 
                    !this.toggle.contains(e.target)) {
                    this.closePanel();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closePanel();
                }
            });

            // Close on scroll (optional - for better UX)
            let lastScrollY = window.scrollY;
            window.addEventListener('scroll', () => {
                const scrollDelta = Math.abs(window.scrollY - lastScrollY);
                if (scrollDelta > 50 && this.isOpen) {
                    this.closePanel();
                }
                lastScrollY = window.scrollY;
            }, { passive: true });
        },

        togglePanel() {
            if (this.isOpen) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        },

        openPanel() {
            this.isOpen = true;
            this.toggle.classList.add('active');
            this.panel.classList.add('active');
        },

        closePanel() {
            this.isOpen = false;
            this.toggle.classList.remove('active');
            this.panel.classList.remove('active');
        }
    };

    // Initialize header reviews toggle
    headerReviewsToggle.init();
});
