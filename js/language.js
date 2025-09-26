// Language Management System
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.isRTL = this.currentLanguage === 'ar';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyLanguage();
        this.updateDirection();
    }

    setupEventListeners() {
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Handle page load
        document.addEventListener('DOMContentLoaded', () => {
            this.applyLanguage();
            this.updateDirection();
        });
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.isRTL = this.currentLanguage === 'ar';
        localStorage.setItem('language', this.currentLanguage);
        this.applyLanguage();
        this.updateDirection();
        this.updateToggleButton();
        this.announceLanguageChange();
    }

    applyLanguage() {
        // Update all elements with data attributes
        const elementsWithLang = document.querySelectorAll('[data-en], [data-ar]');
        
        elementsWithLang.forEach(element => {
            const englishText = element.getAttribute('data-en');
            const arabicText = element.getAttribute('data-ar');
            
            if (this.currentLanguage === 'ar' && arabicText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = arabicText;
                } else if (element.hasAttribute('title')) {
                    element.title = arabicText;
                } else if (element.hasAttribute('alt')) {
                    element.alt = arabicText;
                } else {
                    element.textContent = arabicText;
                }
            } else if (this.currentLanguage === 'en' && englishText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = englishText;
                } else if (element.hasAttribute('title')) {
                    element.title = englishText;
                } else if (element.hasAttribute('alt')) {
                    element.alt = englishText;
                } else {
                    element.textContent = englishText;
                }
            }
        });

        // Update form placeholders
        this.updateFormPlaceholders();
        
        // Update meta tags
        this.updateMetaTags();
        
        // Update document title
        this.updateDocumentTitle();
    }

    updateFormPlaceholders() {
        const placeholderElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
        
        placeholderElements.forEach(element => {
            const englishPlaceholder = element.getAttribute('data-placeholder-en');
            const arabicPlaceholder = element.getAttribute('data-placeholder-ar');
            
            if (this.currentLanguage === 'ar' && arabicPlaceholder) {
                element.placeholder = arabicPlaceholder;
            } else if (this.currentLanguage === 'en' && englishPlaceholder) {
                element.placeholder = englishPlaceholder;
            }
        });
    }

    updateMetaTags() {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const englishDesc = metaDescription.getAttribute('data-en');
            const arabicDesc = metaDescription.getAttribute('data-ar');
            
            if (this.currentLanguage === 'ar' && arabicDesc) {
                metaDescription.setAttribute('content', arabicDesc);
            } else if (this.currentLanguage === 'en' && englishDesc) {
                metaDescription.setAttribute('content', englishDesc);
            }
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle && this.currentLanguage === 'ar') {
            ogTitle.setAttribute('content', 'قوالب إدارة المشاريع - حلول احترافية');
        } else if (ogTitle) {
            ogTitle.setAttribute('content', 'Project Management Templates - Professional Solutions');
        }

        if (ogDescription && this.currentLanguage === 'ar') {
            ogDescription.setAttribute('content', 'قوالب إدارة مشاريع متميزة لتحسين سير العمل');
        } else if (ogDescription) {
            ogDescription.setAttribute('content', 'Premium project management templates to streamline your workflow');
        }
    }

    updateDocumentTitle() {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const englishTitle = titleElement.getAttribute('data-en');
            const arabicTitle = titleElement.getAttribute('data-ar');
            
            if (this.currentLanguage === 'ar' && arabicTitle) {
                titleElement.textContent = arabicTitle;
            } else if (this.currentLanguage === 'en' && englishTitle) {
                titleElement.textContent = englishTitle;
            }
        }
    }

    updateDirection() {
        const html = document.documentElement;
        const body = document.body;

        if (this.isRTL) {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            body.style.fontFamily = "'Tajawal', 'Inter', sans-serif";
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            body.style.fontFamily = "'Inter', sans-serif";
        }

        // Update Tailwind classes for RTL
        this.updateRTLClasses();
    }

    updateRTLClasses() {
        const elementsToUpdate = document.querySelectorAll('.space-x-4, .space-x-8, .mr-3, .mr-4, .ml-3, .ml-4');
        
        elementsToUpdate.forEach(element => {
            if (this.isRTL) {
                // Convert left/right margins and spacing for RTL
                if (element.classList.contains('space-x-4')) {
                    element.classList.remove('space-x-4');
                    element.classList.add('space-x-reverse', 'space-x-4');
                }
                if (element.classList.contains('space-x-8')) {
                    element.classList.remove('space-x-8');
                    element.classList.add('space-x-reverse', 'space-x-8');
                }
            } else {
                // Remove RTL classes for LTR
                element.classList.remove('space-x-reverse');
            }
        });
    }

    updateToggleButton() {
        const currentLangElement = document.getElementById('currentLang');
        if (currentLangElement) {
            currentLangElement.textContent = this.currentLanguage === 'ar' ? 'العربية' : 'EN';
        }

        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle && this.currentLanguage === 'ar') {
            languageToggle.innerHTML = '<i class="fas fa-globe"></i><span id="currentLang">العربية</span>';
        } else if (languageToggle) {
            languageToggle.innerHTML = '<i class="fas fa-globe"></i><span id="currentLang">EN</span>';
        }
    }

    announceLanguageChange() {
        // Accessibility: Announce language change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        
        const message = this.currentLanguage === 'ar' 
            ? 'تم تغيير اللغة إلى العربية' 
            : 'Language changed to English';
        
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isCurrentlyRTL() {
        return this.isRTL;
    }

    // Get translated text
    t(englishText, arabicText) {
        return this.currentLanguage === 'ar' ? arabicText : englishText;
    }

    // Format numbers for current locale
    formatNumber(number) {
        if (this.currentLanguage === 'ar') {
            return new Intl.NumberFormat('ar-SA').format(number);
        }
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Format currency for current locale
    formatCurrency(amount, currency = 'USD') {
        if (this.currentLanguage === 'ar') {
            return new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: currency,
                currencyDisplay: 'symbol'
            }).format(amount);
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Format dates for current locale
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        
        if (this.currentLanguage === 'ar') {
            return new Intl.DateTimeFormat('ar-SA', formatOptions).format(date);
        }
        return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
    }

    // Animate text changes
    animateTextChange(element, newText) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    }

    // Preload fonts for better performance
    preloadFonts() {
        const link1 = document.createElement('link');
        link1.rel = 'preload';
        link1.as = 'font';
        link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
        link1.crossOrigin = 'anonymous';
        
        const link2 = document.createElement('link');
        link2.rel = 'preload';
        link2.as = 'font';
        link2.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap';
        link2.crossOrigin = 'anonymous';
        
        document.head.appendChild(link1);
        document.head.appendChild(link2);
    }
}

// Initialize Language Manager
let languageManager;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        languageManager = new LanguageManager();
    });
} else {
    languageManager = new LanguageManager();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}