const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYkTDOtWlWSaAYUEGDGhnGkt-ubunZgo0WfkrbyNrfLmPUYy9LkP5TZqM9TtbhbXua/exec';

document.addEventListener('DOMContentLoaded', function() {
    async function submitToGoogleSheet(formData, sheetName) {
        if (!GOOGLE_SCRIPT_URL) {
            console.error('Google Script URL is not set.');
            alert('Form submission is not configured correctly.');
            return false;
        }

        if (!formData || Object.keys(formData).length === 0) {
            console.error('No form data provided');
            alert('Please fill in the required fields.');
            return false;
        }
        
        // Email validation
        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        // Mobile validation (10 digits)
        if (formData.Mobile && !/^\d{10}$/.test(formData.Mobile)) {
            alert('Please enter a valid 10-digit mobile number.');
            return false;
        }
        
        // Name validation
        if (formData.Name && formData.Name.trim().length < 2) {
            alert('Please enter a valid name (minimum 2 characters).');
            return false;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify({
                    sheet: sheetName,
                    formData: formData
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log(`Submission sent to Google Sheets for sheet: ${sheetName}`);
            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Submission timed out after 10 seconds');
                alert('Submission timed out. Please check your connection and try again.');
            } else {
                console.error('Network error while submitting to Google Sheet:', error);
                alert('There was a network error. Please check your internet connection and try again.');
            }
            return false;
        }
    }

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Main Login/Register Modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const freeTestModal = document.getElementById('freeTestModal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === loginModal || event.target === freeTestModal) {
            if (loginModal) loginModal.style.display = 'none';
            if (freeTestModal) freeTestModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Tab Switching in Main Modal
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const targetTab = document.getElementById(tab);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Form Submissions (Login & Register)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            if (!email || !password) {
                alert('Please enter email and password.');
                return;
            }
            alert('Login Successful!');
            window.location.href = 'student-dashboard.htm';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            if (!submitButton) return;
            submitButton.textContent = 'Registering...';
            submitButton.disabled = true;

            const fullName = document.getElementById('regName')?.value.trim();
            const email = document.getElementById('regEmail')?.value.trim();
            const mobile = document.getElementById('regMobile')?.value.trim();
            
            if (!fullName || !email || !mobile) {
                alert('Please fill in all fields.');
                submitButton.textContent = 'Register';
                submitButton.disabled = false;
                return;
            }

            const formData = {
                Name: fullName,
                Email: email,
                Mobile: mobile
            };

            const success = await submitToGoogleSheet(formData, 'Registrations');

            if (success) {
                alert('Registration successful! You can now log in.');
                this.reset();
                const loginTabBtn = document.querySelector('.tab-btn[data-tab="login"]');
                if (loginTabBtn) loginTabBtn.click();
            }
            submitButton.textContent = 'Register';
            submitButton.disabled = false;
        });
    }

    // Free Test Modal & Form Logic
    const openFreeTestModalBtns = document.querySelectorAll('.open-free-test-modal');
    const closeFreeTestModal = document.getElementById('closeFreeTestModal');
    const freeTestForm = document.getElementById('freeTestForm');

    openFreeTestModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (freeTestModal) {
                freeTestModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeFreeTestModal && freeTestModal) {
        closeFreeTestModal.addEventListener('click', function() {
            freeTestModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    const freeTestPdfUrl = 'https://drive.google.com/uc?export=download&id=1ztptHMUr3KXA_vq8It1bGsDQrc8d5rNG';

    if (freeTestForm) {
        freeTestForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            if (!submitButton) return;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            const emailOrMobile = document.getElementById('freeTestEmail')?.value.trim();
            if (!emailOrMobile) {
                alert('Please enter your email or mobile number.');
                submitButton.textContent = 'Download Now';
                submitButton.disabled = false;
                return;
            }

            const formData = {
                EmailOrMobile: emailOrMobile
            };
            
            const success = await submitToGoogleSheet(formData, 'Free_Test_Signups');

            if (success) {
                alert('Thank you! Your free test paper will begin downloading now.');
                
                const downloadLink = document.createElement('a');
                downloadLink.href = freeTestPdfUrl;
                downloadLink.download = 'caexam-Free-Test-Paper.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                if (freeTestModal) freeTestModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.reset();
            }
            
            submitButton.textContent = 'Download Now';
            submitButton.disabled = false;
        });
    }

    // Pricing Tabs
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingPanels = document.querySelectorAll('.pricing-panel');

    pricingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const targetPanel = document.getElementById(`panel-${target}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // Testimonial Slider
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let sliderInterval;

    function showSlide(n) {
        if (!slides.length) return;
        currentSlideIndex = (n + slides.length) % slides.length;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[currentSlideIndex].classList.add('active');
        if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
    }

    function startSlider() {
        if (sliderInterval) clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 5000);
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlider();
        });
    });

    if (slides.length > 0) {
        showSlide(0);
        startSlider();
    }

    // Coupon Code Copy Functionality
    const copyCouponBtn = document.getElementById('horizontalCouponBtn');
    if (copyCouponBtn) {
        const originalText = copyCouponBtn.dataset.en || copyCouponBtn.textContent;
        copyCouponBtn.addEventListener('click', function() {
            const couponCode = 'SAVE100';
            navigator.clipboard.writeText(couponCode).then(() => {
                const originalText = this.dataset.en || 'Copy Code';
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy coupon code: ', err);
                alert('Failed to copy. Please copy manually: SAVE100');
            });
        });
    }

    // Language Switching
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        languageSelect.value = savedLanguage;
        switchLanguage(savedLanguage);

        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('preferredLanguage', selectedLanguage);
            switchLanguage(selectedLanguage);
        });
    }
    
    function switchLanguage(lang) {
        const elements = document.querySelectorAll('[data-en], [data-hi]');
        elements.forEach(element => {
            const text = (lang === 'hi') ? element.getAttribute('data-hi') : element.getAttribute('data-en');
            if (text && text.trim()) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                alert('Please enter a valid email address.');
                return;
            }
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
});
