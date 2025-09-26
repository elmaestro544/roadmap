// Main Application JavaScript
class MainApp {
    constructor() {
        this.isLoaded = false;
        this.scrollPosition = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupLoadingEffects();
        this.isLoaded = true;
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
        
        // Document events
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        
        // Error handling
        window.addEventListener('error', (event) => this.handleError(event));
        window.addEventListener('unhandledrejection', (event) => this.handlePromiseRejection(event));
    }

    initializeComponents() {
        this.initializeAnimations();
        this.setupIntersectionObserver();
        this.initializeLazyLoading();
        this.setupKeyboardNavigation();
        this.initializeTooltips();
    }

    onPageLoad() {
        // Remove loading class when page is fully loaded
        document.body.classList.remove('loading');
        
        // Trigger entrance animations
        this.triggerEntranceAnimations();
        
        // Initialize any third-party libraries
        this.initializeThirdPartyLibraries();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    onDOMReady() {
        // Initialize critical functionality first
        this.setupCriticalFeatures();
        
        // Setup analytics if available
        this.setupAnalytics();
        
        // Initialize accessibility features
        this.setupAccessibility();
    }

    onScroll() {
        this.scrollPosition = window.pageYOffset;
        
        // Update header appearance on scroll
        this.updateHeaderOnScroll();
        
        // Trigger scroll-based animations
        this.handleScrollAnimations();
        
        // Update progress indicator if exists
        this.updateScrollProgress();
        
        // Throttle scroll events for performance
        this.throttledScrollHandler();
    }

    onResize() {
        // Handle responsive adjustments
        this.handleResponsiveChanges();
        
        // Recalculate animations if needed
        this.recalculateAnimations();
        
        // Update mobile menu if open
        this.updateMobileMenu();
    }

    // Header scroll effects
    updateHeaderOnScroll() {
        const header = document.querySelector('header');
        if (header) {
            if (this.scrollPosition > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking on links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu) {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu && mobileMenuBtn) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('active');
            
            // Update button icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
            
            // Focus management
            mobileMenu.querySelector('a')?.focus();
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu && mobileMenuBtn) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
            
            // Update button icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Re-enable body scrolling
            document.body.style.overflow = 'auto';
        }
    }

    updateMobileMenu() {
        if (window.innerWidth >= 768) {
            this.closeMobileMenu();
        }
    }

    // Scroll-based animations
    setupScrollEffects() {
        // Add scroll reveal functionality
        this.scrollRevealElements = document.querySelectorAll('.scroll-reveal');
        
        if (this.scrollRevealElements.length > 0) {
            this.setupIntersectionObserver();
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, options);
        
        // Observe all scroll reveal elements
        this.scrollRevealElements?.forEach(el => {
            el.classList.add('scroll-reveal');
            this.intersectionObserver.observe(el);
        });
        
        // Also observe template cards and other elements
        document.querySelectorAll('.template-card, .pricing-card, .testimonial-card').forEach(el => {
            el.classList.add('scroll-reveal');
            this.intersectionObserver.observe(el);
        });
    }

    // Form validation
    setupFormValidation() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
            
            // Real-time validation
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            });
        }
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const isValid = this.validateForm(form);
        
        if (isValid) {
            this.submitContactForm(formData);
        }
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (type === 'email' && value && !this.validateEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Update field appearance
        if (isValid) {
            this.markFieldAsValid(field);
        } else {
            this.markFieldAsInvalid(field, errorMessage);
        }
        
        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    markFieldAsValid(field) {
        field.classList.remove('field-error');
        field.classList.add('field-success');
        this.removeFieldError(field);
    }

    markFieldAsInvalid(field, message) {
        field.classList.remove('field-success');
        field.classList.add('field-error');
        this.showFieldError(field, message);
    }

    clearFieldError(field) {
        field.classList.remove('field-error', 'field-success');
        this.removeFieldError(field);
    }

    showFieldError(field, message) {
        this.removeFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-text';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.error-text');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async submitContactForm(formData) {
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        
        try {
            // Show loading state
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            }
            
            // Simulate form submission (replace with actual endpoint)
            await this.sendContactMessage(formData);
            
            // Show success message
            this.showSuccessMessage('Message sent successfully! We\'ll get back to you soon.');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Remove loading state
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        }
    }

    async sendContactMessage(formData) {
        // Simulate API call - replace with actual endpoint
        const contactData = {
            name: formData.get('name') || formData.get('Name'),
            email: formData.get('email') || formData.get('Email'),
            message: formData.get('message') || formData.get('Message'),
            timestamp: new Date().toISOString()
        };
        
        // Store in localStorage for demo (replace with actual API call)
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Contact message sent:', contactData);
        
        return { success: true };
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            animation: slideInFromRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => notification.remove());
        }
    }

    // Lazy loading for images
    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                img.classList.add('lazy-load');
                imageObserver.observe(img);
            });
        }
    }

    // Keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key handlers
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                // Close any open modals
                document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
            
            // Enter key for buttons
            if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
                e.target.click();
            }
        });
        
        // Skip to main content link
        this.addSkipLink();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Loading effects
    setupLoadingEffects() {
        // Add loading class to body initially
        document.body.classList.add('loading');
        
        // Remove loading class when everything is ready
        if (document.readyState === 'complete') {
            this.onPageLoad();
        }
    }

    // Entrance animations
    triggerEntranceAnimations() {
        // Animate hero section
        const hero = document.querySelector('#home');
        if (hero) {
            hero.classList.add('animate-fade-in-up');
        }
        
        // Stagger animation for feature cards
        const featureCards = document.querySelectorAll('#features .bg-white');
        featureCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-fade-in-up');
            }, index * 100);
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            });
        }
    }

    // Analytics setup
    setupAnalytics() {
        // Google Analytics 4 (if GA_MEASUREMENT_ID is defined)
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        // Track scroll depth
        this.setupScrollTracking();
    }

    setupScrollTracking() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                // Track milestone percentages
                if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                    this.trackEvent('scroll_depth', '25_percent');
                } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                    this.trackEvent('scroll_depth', '50_percent');
                } else if (maxScrollDepth >= 75 && maxScrollDepth < 90) {
                    this.trackEvent('scroll_depth', '75_percent');
                } else if (maxScrollDepth >= 90) {
                    this.trackEvent('scroll_depth', '90_percent');
                }
            }
        });
    }

    trackEvent(eventName, eventValue) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'engagement',
                event_label: eventValue
            });
        }
        
        console.log('Event tracked:', eventName, eventValue);
    }

    // Error handling
    handleError(event) {
        console.error('JavaScript Error:', event.error);
        
        // Track error if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: event.error?.message || 'Unknown error',
                fatal: false
            });
        }
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // Track promise rejection
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: 'Promise rejection: ' + (event.reason?.message || 'Unknown'),
                fatal: false
            });
        }
    }

    // Accessibility features
    setupAccessibility() {
        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Reduced motion detection
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Focus management
        this.setupFocusManagement();
    }

    setupFocusManagement() {
        // Focus ring for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    throttledScrollHandler() {
        this.throttle(() => {
            this.updateScrollProgress();
        }, 16)(); // 60fps
    }

    updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const progress = (this.scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    handleScrollAnimations() {
        // Additional scroll-based animations can be added here
    }

    handleResponsiveChanges() {
        // Handle responsive layout changes
        this.updateMobileMenu();
    }

    recalculateAnimations() {
        // Recalculate any animations that depend on viewport size
    }

    setupCriticalFeatures() {
        // Initialize the most important features first
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    initializeThirdPartyLibraries() {
        // Initialize any third-party libraries after page load
        // This could include analytics, chat widgets, etc.
    }

    initializeAnimations() {
        // Initialize any complex animations
    }

    initializeTooltips() {
        // Setup tooltips if needed
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(e) {
        const text = e.target.getAttribute('data-tooltip');
        if (text) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            
            e.target._tooltip = tooltip;
        }
    }

    hideTooltip(e) {
        if (e.target._tooltip) {
            e.target._tooltip.remove();
            delete e.target._tooltip;
        }
    }
}

// Initialize the main application
let mainApp;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mainApp = new MainApp();
    });
} else {
    mainApp = new MainApp();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainApp;
}