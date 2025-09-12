//
// 🔴 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE 🔴
//
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxm2yhSbYtwudph3Ba_nxCfT35PV9t1E1txYdPu8ljNeEFRzt0PBdpra5Td2hULakU-Hg/exec'; // Your provided URL

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // --- Google Sheet Submission Logic ---
    async function submitToGoogleSheet(formData, sheetName) {
        // Check if the Google Script URL is set correctly
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
            console.error('Google Script URL is not set. Please update script.js with your Web App URL.');
            alert('Configuration Error: Could not submit data. Please check website setup.');
            return false;
        }

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors', // 'cors' is important for cross-origin requests
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sheet: sheetName,
                    formData: formData // This object's keys must match your Google Sheet headers
                }),
            });
            
            // Check if the fetch itself was successful (e.g., network error)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ status: 'error', message: `HTTP error! status: ${response.status}` }));
                console.error('Network response was not ok:', errorData);
                alert('Error: Could not submit your request. Please try again.');
                return false;
            }

            const result = await response.json(); // Parse the JSON response from the script

            if (result.status === 'success') {
                console.log('Data submitted successfully:', result.message);
                return true;
            } else {
                console.error('Submission failed:', result.message);
                alert(`Error: ${result.message}`); // Display the error message from the script
                return false;
            }
        } catch (error) {
            console.error('Error submitting to Google Sheet:', error);
            alert('An unexpected error occurred. Please try again.');
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
    const loginModal = document.getElementById('loginModal');
    const freeTestModal = document.getElementById('freeTestModal');
    const closeModal = document.getElementById('closeModal');
    const closeFreeTestModal = document.getElementById('closeFreeTestModal');

    // Function to close both modals and reset overflow
    function closeAllModals() {
        if (loginModal) loginModal.style.display = 'none';
        if (freeTestModal) freeTestModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Open Login Modal
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Login Modal
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close Free Test Modal
    if (closeFreeTestModal && freeTestModal) {
        closeFreeTestModal.addEventListener('click', function() {
            freeTestModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === freeTestModal) {
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
                alert('There was an error registering. Please try again.');
            }
            submitButton.textContent = 'Register';
            submitButton.disabled = false;
        });
    }


    // --- Free Test Modal & Form Logic ---
    const openFreeTestModalBtns = document.querySelectorAll('.open-free-test-modal');
    
    openFreeTestModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (freeTestModal) {
                freeTestModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
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
                closeFreeTestModal.click(); // Trigger closing the modal
                this.reset(); // Reset the form fields

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
    let autoSlideInterval = setInterval(() => {
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
    const slideIndex = n - 1;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
    }
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}
