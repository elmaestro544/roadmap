// Secure Payment Processing with Stripe
class PaymentProcessor {
    constructor() {
        // Use test key - replace with live key in production
        this.stripePublicKey = 'pk_test_51234567890abcdef'; // Demo key for testing
        this.stripe = null;
        this.elements = null;
        this.card = null;
        this.currentPurchase = null;
        this.init();
    }

    async init() {
        try {
            // Initialize Stripe (using demo mode for this template)
            this.stripe = window.Stripe ? window.Stripe(this.stripePublicKey) : null;
            
            if (!this.stripe) {
                console.warn('Stripe not loaded. Payment functionality will be simulated.');
                this.simulateMode = true;
            }

            this.setupEventListeners();
            this.setupCardElement();
        } catch (error) {
            console.error('Payment initialization error:', error);
            this.simulateMode = true;
        }
    }

    setupEventListeners() {
        // Close modal handlers
        const closeModal = document.getElementById('closeModal');
        const paymentModal = document.getElementById('paymentModal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (paymentModal) {
            paymentModal.addEventListener('click', (e) => {
                if (e.target === paymentModal) {
                    this.closeModal();
                }
            });
        }

        // Payment form submission
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupCardElement() {
        if (!this.stripe || this.simulateMode) return;

        try {
            this.elements = this.stripe.elements();
            this.card = this.elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
            });

            const cardElement = document.getElementById('card-element');
            if (cardElement) {
                this.card.mount('#card-element');
                
                this.card.on('change', ({error}) => {
                    const displayError = document.getElementById('card-errors');
                    if (displayError) {
                        if (error) {
                            displayError.textContent = error.message;
                            displayError.classList.add('error-message');
                        } else {
                            displayError.textContent = '';
                            displayError.classList.remove('error-message');
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Card element setup error:', error);
            this.simulateMode = true;
        }
    }

    openPaymentModal(packageType, price) {
        this.currentPurchase = { packageType, price };
        
        // Update modal content
        const packageName = document.getElementById('packageName');
        const packagePrice = document.getElementById('packagePrice');
        const modal = document.getElementById('paymentModal');
        
        if (packageName && packagePrice) {
            const packages = {
                'basic': {
                    en: 'Basic Pack',
                    ar: 'الحزمة الأساسية'
                },
                'professional': {
                    en: 'Professional Pack',
                    ar: 'الحزمة الاحترافية'
                },
                'enterprise': {
                    en: 'Enterprise Pack',
                    ar: 'حزمة المؤسسات'
                }
            };
            
            const currentLang = languageManager ? languageManager.getCurrentLanguage() : 'en';
            const packageDisplayName = packages[packageType] ? packages[packageType][currentLang] : packageType;
            
            packageName.textContent = packageDisplayName;
            packagePrice.textContent = `$${price}`;
        }
        
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('modal-backdrop');
            
            // Focus on email input for accessibility
            setTimeout(() => {
                const emailInput = document.getElementById('emailInput');
                if (emailInput) {
                    emailInput.focus();
                }
            }, 100);
        }
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('modal-backdrop');
        }
        
        // Reset form
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.reset();
        }
        
        // Re-enable body scrolling
        document.body.style.overflow = 'auto';
        
        this.currentPurchase = null;
    }

    async handlePayment(event) {
        event.preventDefault();
        
        const submitButton = document.getElementById('submitPayment');
        const emailInput = document.getElementById('emailInput');
        
        if (!this.currentPurchase) {
            this.showError('No package selected');
            return;
        }

        if (!emailInput || !emailInput.value) {
            this.showError('Please enter your email address');
            return;
        }

        // Validate email
        if (!this.validateEmail(emailInput.value)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        }

        try {
            if (this.simulateMode || !this.stripe) {
                // Simulate payment for demo purposes
                await this.simulatePayment();
            } else {
                // Real Stripe payment processing
                await this.processStripePayment();
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showError('Payment processing failed. Please try again.');
        } finally {
            // Remove loading state
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        }
    }

    async simulatePayment() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful payment
        this.handlePaymentSuccess({
            id: 'demo_' + Date.now(),
            amount: this.currentPurchase.price * 100,
            currency: 'usd',
            customer_email: document.getElementById('emailInput').value
        });
    }

    async processStripePayment() {
        if (!this.stripe || !this.card) {
            throw new Error('Stripe not initialized');
        }

        const {token, error} = await this.stripe.createToken(this.card);

        if (error) {
            throw new Error(error.message);
        }

        // In a real application, send token to your server
        // For this demo, we'll simulate the server response
        const paymentData = {
            token: token.id,
            amount: this.currentPurchase.price * 100, // Stripe uses cents
            currency: 'usd',
            description: `${this.currentPurchase.packageType} package`,
            receipt_email: document.getElementById('emailInput').value
        };

        // Simulate server processing
        await this.sendPaymentToServer(paymentData);
    }

    async sendPaymentToServer(paymentData) {
        // This would normally be your server endpoint
        // For demo purposes, we'll simulate success
        
        const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        }).catch(() => {
            // If server endpoint doesn't exist (demo mode), simulate success
            return {
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    payment_intent: {
                        id: 'pi_demo_' + Date.now(),
                        amount: paymentData.amount,
                        currency: paymentData.currency,
                        status: 'succeeded'
                    }
                })
            };
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const result = await response.json();
        
        if (result.success) {
            this.handlePaymentSuccess(result.payment_intent);
        } else {
            throw new Error(result.error || 'Payment failed');
        }
    }

    handlePaymentSuccess(paymentIntent) {
        // Close modal
        this.closeModal();
        
        // Show success message
        this.showSuccess();
        
        // Log successful purchase (in real app, this would be tracked properly)
        this.logPurchase(paymentIntent);
        
        // Send confirmation email (simulated)
        this.sendConfirmationEmail(paymentIntent);
        
        // Generate download links (simulated)
        this.generateDownloadLinks();
    }

    showSuccess() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        }
        
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        // Create or show error message
        let errorDiv = document.querySelector('.payment-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'payment-error error-message';
            const paymentForm = document.getElementById('paymentForm');
            if (paymentForm) {
                paymentForm.prepend(errorDiv);
            }
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }, 5000);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    logPurchase(paymentIntent) {
        const purchaseData = {
            timestamp: new Date().toISOString(),
            package: this.currentPurchase.packageType,
            amount: this.currentPurchase.price,
            paymentId: paymentIntent.id,
            email: document.getElementById('emailInput').value
        };
        
        // Store in localStorage for demo (in real app, this would go to your database)
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push(purchaseData);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        console.log('Purchase logged:', purchaseData);
    }

    async sendConfirmationEmail(paymentIntent) {
        // Simulate sending confirmation email
        const emailData = {
            to: document.getElementById('emailInput').value,
            subject: 'Your PM Templates Purchase Confirmation',
            package: this.currentPurchase.packageType,
            amount: this.currentPurchase.price,
            paymentId: paymentIntent.id
        };
        
        console.log('Confirmation email sent (simulated):', emailData);
        
        // In a real application, you would send this to your email service
        /*
        await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });
        */
    }

    generateDownloadLinks() {
        // Simulate generating secure download links
        const packageFiles = {
            basic: [
                'Project_Planning_Template.xlsx',
                'Budget_Tracker.xlsx',
                'Risk_Assessment.xlsx',
                'Team_Roles.xlsx',
                'User_Guide.pdf'
            ],
            professional: [
                'Project_Planning_Template.xlsx',
                'Advanced_Gantt_Chart.xlsx',
                'Budget_Tracker_Pro.xlsx',
                'Risk_Management_Suite.xlsx',
                'Team_Management_Kit.xlsx',
                'Resource_Allocation.xlsx',
                'Milestone_Tracker.xlsx',
                'Communication_Plan.xlsx',
                'Quality_Assurance.xlsx',
                'Project_Charter.docx',
                'Stakeholder_Analysis.xlsx',
                'Change_Request_Form.docx',
                'Project_Closure.xlsx',
                'Lessons_Learned.docx',
                'Video_Tutorials.mp4',
                'Complete_User_Guide.pdf'
            ],
            enterprise: [
                // All professional files plus...
                'Custom_Template_Generator.xlsx',
                'White_Label_Templates.zip',
                'Advanced_Analytics.xlsx',
                'Portfolio_Dashboard.xlsx',
                'Executive_Reports.xlsx',
                'ROI_Calculator.xlsx',
                'Compliance_Tracker.xlsx',
                'Vendor_Management.xlsx',
                'Contract_Templates.docx',
                'Legal_Framework.pdf',
                'Enterprise_License.pdf',
                'Implementation_Guide.pdf',
                'Training_Materials.zip',
                'Support_Resources.pdf'
            ]
        };
        
        const files = packageFiles[this.currentPurchase.packageType] || [];
        const downloadLinks = files.map(file => ({
            filename: file,
            url: `/downloads/secure/${Date.now()}/${file}`,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }));
        
        console.log('Download links generated (simulated):', downloadLinks);
        
        // Store download links (in real app, these would be secure, time-limited URLs)
        localStorage.setItem('downloadLinks', JSON.stringify(downloadLinks));
        
        return downloadLinks;
    }

    // Analytics and tracking methods
    trackPurchaseEvent(packageType, price) {
        // Google Analytics 4 tracking (if GA is installed)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: Date.now().toString(),
                value: price,
                currency: 'USD',
                items: [{
                    item_id: packageType,
                    item_name: `${packageType} Package`,
                    category: 'Templates',
                    quantity: 1,
                    price: price
                }]
            });
        }
        
        // Facebook Pixel tracking (if FB Pixel is installed)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: price,
                currency: 'USD',
                content_ids: [packageType],
                content_type: 'product'
            });
        }
    }

    // Security helpers
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    generateSecureToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}

// Global purchase function for buttons
function purchaseTemplate(packageType, price) {
    if (window.paymentProcessor) {
        window.paymentProcessor.openPaymentModal(packageType, price);
        
        // Track purchase attempt
        if (window.paymentProcessor.trackPurchaseEvent) {
            window.paymentProcessor.trackPurchaseEvent(packageType, price);
        }
    } else {
        console.error('Payment processor not initialized');
    }
}

// Initialize payment processor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.paymentProcessor = new PaymentProcessor();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentProcessor;
}