//
// 🔴 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE 🔴
//
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzquS-P1jGoQA6D7AnsK0NmdG4Bv54YcZdRVZIMKBdAXdDUc4hMHDhteGJrEWas6Kkpqw/exec';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // --- Google Sheet Submission Logic ---
    async function submitToGoogleSheet(formData, sheetName) {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sheet: sheetName,
                    formData: formData
                }),
            });
            const result = await response.json();
            return result.status === 'success';
        } catch (error) {
            console.error('Error submitting to Google Sheet:', error);
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
            loginModal.style.display = 'none';
            freeTestModal.style.display = 'none';
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
            // Redirect to dashboard after "successful" login
            window.location.href = 'student-dashboard.html';
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
                // Switch to login tab
                document.querySelector('.tab-btn[data-tab="login"]').click();
            } else {
                alert('There was an error. Please try again.');
            }
            submitButton.textContent = 'Register';
            submitButton.disabled = false;
        });
    }


    // --- Free Test Modal & Form Logic ---
    const freeTestModal = document.getElementById('freeTestModal');
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
    
    // Google Drive link for the free test PDF
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
                
                // Trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = freeTestPdfUrl;
                downloadLink.download = 'caexam-Free-Test-Paper.pdf'; // Suggested filename
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Close the modal and reset the form
                freeTestModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.reset();

            } else {
                alert('There was an error submitting your details. Please try again.');
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
    
    function showSlide(n) {
        if (!slides.length) return;
        currentSlideIndex = (n + slides.length) % slides.length; // Loop around
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto slide change every 5 seconds
    setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 5000);
    
    // Initial slide show
    if (slides.length > 0) {
        showSlide(0);
    }


    // --- Coupon Code Copy Functionality ---
    const copyCouponBtn = document.getElementById('horizontalCouponBtn');
    if (copyCouponBtn) {
        copyCouponBtn.addEventListener('click', function() {
            const couponCode = 'SAVE100';
            navigator.clipboard.writeText(couponCode).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = 'Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy coupon code: ', err);
                alert('Failed to copy code.');
            });
        });
    }
    

    // --- Language Switching ---
    // (This functionality is kept as it was in the original file)
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
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
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

// Global function for testimonial slider dots (accessible from HTML onclick)
function currentSlide(n) {
    // This is a bridge for the inline onclick handler to the new slider logic.
    // It's better to handle this within the DOMContentLoaded event listener,
    // but this ensures the existing HTML works without modification.
    const event = new CustomEvent('slideChange', { detail: { slideNum: n - 1 } });
    document.dispatchEvent(event);
}

document.addEventListener('slideChange', function(e) {
    const slideIndex = e.detail.slideNum;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[slideIndex]) slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
});
