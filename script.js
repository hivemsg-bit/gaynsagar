//
// 🔴 YAHAN APNA NAYA GOOGLE SCRIPT URL PASTE KAREIN 🔴
//
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxm2yhSbYtwudph3Ba_nxCfT35PV9t1E1txYdPu8ljNeEFRzt0PBdpra5Td2hULakU-Hg/exec';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // --- Google Sheet Submission Logic (Updated & More Reliable) ---
    async function submitToGoogleSheet(formData, sheetName) {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbxm2yhSbYtwudph3Ba_nxCfT35PV9t1E1txYdPu8ljNeEFRzt0PBdpra5Td2hULakU-Hg/exec') {
            console.error('Google Script URL is not set. Please update it in script.js');
            alert('Form submission is not configured correctly. Please add the Google Script URL in script.js');
            return false;
        }
        try {
            // This method sends the data and continues without waiting for a reply that browsers
            // might block due to security (CORS). This is more reliable for this use case.
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important: This prevents the browser from showing a CORS error
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify({
                    sheet: sheetName,
                    formData: formData
                })
            });
            // If the request above doesn't cause a network error, we assume it was successful.
            return true;
        } catch (error) {
            console.error('Network error while submitting to Google Sheet:', error);
            return false;
        }
    }


    // --- Mobile Navigation ---
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
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });


    // --- Main Login/Register Modal ---
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

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal || event.target === freeTestModal) {
            if(loginModal) loginModal.style.display = 'none';
            if(freeTestModal) freeTestModal.style.display = 'none';
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
            document.getElementById(tab).classList.add('active');
        });
    });

    // --- Form Submissions (Login & Register) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login Successful!');
            window.location.href = 'student-dashboard.htm';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Registering...';
            submitButton.disabled = true;

            const formData = {
                FullName: document.getElementById('regName').value,
                Email: document.getElementById('regEmail').value
            };

            const success = await submitToGoogleSheet(formData, 'Registrations');

            if (success) {
                alert('Registration successful! You can now log in.');
                this.reset();
                document.querySelector('.tab-btn[data-tab="login"]').click();
            } else {
                alert('There was an error. Please check your internet connection and try again.');
            }
            submitButton.textContent = 'Register';
            submitButton.disabled = false;
        });
    }


    // --- Free Test Modal & Form Logic ---
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

    if (closeFreeTestModal) {
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
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            const formData = {
                EmailOrMobile: document.getElementById('freeTestEmail').value
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

                freeTestModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.reset();

            } else {
                alert('There was an error submitting your details. Please check your internet connection and try again.');
            }
            
            submitButton.textContent = 'Download Now';
            submitButton.disabled = false;
        });
    }


    // --- Pricing Tabs ---
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingPanels = document.querySelectorAll('.pricing-panel');

    pricingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`panel-${target}`).classList.add('active');
        });
    });

    // --- Testimonial Slider ---
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
        dots[currentSlideIndex].classList.add('active');
    }

    function startSlider() {
        sliderInterval = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 5000);
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
             clearInterval(sliderInterval);
             showSlide(index);
             startSlider();
        });
    });

    if (slides.length > 0) {
        showSlide(0);
        startSlider();
    }

    // --- Coupon Code Copy Functionality ---
    const copyCouponBtn = document.getElementById('horizontalCouponBtn');
    if (copyCouponBtn) {
        copyCouponBtn.addEventListener('click', function() {
            const couponCode = 'SAVE100';
            navigator.clipboard.writeText(couponCode).then(() => {
                const originalText = this.dataset.en;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = this.dataset.en;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy coupon code: ', err);
            });
        });
    }
    

    // --- Language Switching ---
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
            switchLanguage(savedLanguage);
        }
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
            if(text){
                 if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    // --- Smooth Scrolling ---
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

    // --- Newsletter Form ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
});

