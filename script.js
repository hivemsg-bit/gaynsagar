// 🔴 YAHAN APNA NAYA GOOGLE SCRIPT URL PASTE KAREIN 🔴
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFctXxeiTWBnftWRehWrtEF9iQlg7EMYMo1ibVjd4xrS_leODRdICS6fZzEV96SE4Lhw/exec'; // ← PASTE YOUR REAL URL HERE!

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Google Sheet Submission Logic (Corrected) ---
    async function submitToGoogleSheet(formData, sheetName) {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_NEW_GOOGLE_SCRIPT_URL_HERE')) {
            console.error('Google Script URL is not set. Please update it in script.js with your deployed GAS URL.');
            alert('Form submission is not configured correctly. Please add the Google Script URL in script.js');
            return false;
        }

        // Basic client-side validation for form data
        if (!formData || Object.keys(formData).length === 0) {
            console.error('No form data provided');
            alert('Please fill in the required fields.');
            return false;
        }
        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (formData.EmailOrMobile && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EmailOrMobile) && !/^\d{10}$/.test(formData.EmailOrMobile)) {
            alert('Please enter a valid email or 10-digit mobile number.');
            return false;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            // 🟢 CORRECTED FETCH REQUEST 🟢
            // 'mode' aur 'headers' ko hata diya gaya hai taaki data sahi se submit ho.
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
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

    // --- Baki ka poora JavaScript code neeche hai ---

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
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
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', () => {
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
            document.getElementById(tab)?.classList.add('active');
        });
    });

    // Form Submissions (Login & Register)
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
                FullName: document.getElementById('regName')?.value.trim(),
                Email: document.getElementById('regEmail')?.value.trim()
            };
            const success = await submitToGoogleSheet(formData, 'Registrations');

            if (success) {
                alert('Registration successful! You can now log in.');
                this.reset();
                document.querySelector('.tab-btn[data-tab="login"]')?.click();
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
        btn.addEventListener('click', () => {
            if (freeTestModal) {
                freeTestModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    if (closeFreeTestModal && freeTestModal) {
        closeFreeTestModal.addEventListener('click', () => {
            freeTestModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    if (freeTestForm) {
        freeTestForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            const formData = {
                EmailOrMobile: document.getElementById('freeTestEmail')?.value.trim()
            };
            const success = await submitToGoogleSheet(formData, 'Free_Test_Signups');

            if (success) {
                alert('Thank you! Your free test paper will begin downloading now.');
                const freeTestPdfUrl = 'https://drive.google.com/uc?export=download&id=1ztptHMUr3KXA_vq8It1bGsDQrc8d5rNG';
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

    // ... (Aapka baki ka code jaise pricing tabs, slider, etc. yahan se aage continue hoga)
});
