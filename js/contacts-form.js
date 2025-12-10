
// ========================================
// EmailJS Configuration
// ========================================
const EMAILJS_PUBLIC_KEY = "XIx4yzNGmtFd3URfR";
const EMAILJS_SERVICE_ID = "service_ds832xf";
const EMAILJS_TEMPLATE_ID = "template_epiofmn";
const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_bbpoktj";

// Initialize EmailJS
(function () {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// ========================================
// Set Current Year in Footer
// ========================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========================================
// Form Submission Handler with EmailJS
// ========================================
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const submitButton = contactForm.querySelector('button[type="submit"]');
const submitButtonText = submitButton.querySelector('span');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // CRITICAL: Prevent form from refreshing the page
    e.stopPropagation(); // Stop event from bubbling up

    // Validate required fields first
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-500');
        } else {
            field.classList.remove('border-red-500');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
        return false; // Stop execution
    }

    // Show loading state
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true; // Disable button to prevent double submission
    const originalText = submitButtonText.textContent;
    submitButtonText.innerHTML = '<span class="flex items-center gap-2"><span class="spinner"></span>Sending...</span>';

    // Hide previous messages
    successMessage.setAttribute('hidden', 'true');
    successMessage.classList.remove('show');
    errorMessage.setAttribute('hidden', 'true');
    errorMessage.classList.remove('show');

    // Get form data
    const formData = {
        name: contactForm.querySelector('#name').value,
        email: contactForm.querySelector('#email').value,
        phone: contactForm.querySelector('#phone').value || 'Not provided',
        subject: contactForm.querySelector('#subject').value,
        message: contactForm.querySelector('#message').value
    };

    // Send main email to yourself
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
        .then(function (response) {
            console.log('Main email sent successfully!', response.status);

            // Send auto-reply to sender
            return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, formData);
        })
        .then(function (response) {
            console.log('Auto-reply sent successfully!', response.status);

            // Reset button state
            submitButton.classList.remove('btn-loading');
            submitButton.disabled = false;
            submitButtonText.textContent = originalText;

            // Show success message
            successMessage.removeAttribute('hidden');
            successMessage.classList.add('show');

            // Reset form
            contactForm.reset();

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                successMessage.setAttribute('hidden', 'true');
            }, 5000);
        })
        .catch(function (error) {
            console.log('Failed to send email:', error);

            // Reset button state
            submitButton.classList.remove('btn-loading');
            submitButton.disabled = false;
            submitButtonText.textContent = originalText;

            // Show error message
            errorMessage.removeAttribute('hidden');
            errorMessage.classList.add('show');

            // Auto-hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
                errorMessage.setAttribute('hidden', 'true');
            }, 5000);
        });

    return false; // Extra safety to prevent form submission
});

// ========================================
// Real-time Form Validation
// ========================================
const formRequiredFields = contactForm.querySelectorAll('[required]');

formRequiredFields.forEach(field => {
    // Validation on blur (when user leaves field)
    field.addEventListener('blur', function () {
        if (!this.value.trim()) {
            this.classList.add('border-red-500');
        } else {
            this.classList.remove('border-red-500');
        }
    });

    // Remove error styling when user types
    field.addEventListener('input', function () {
        if (this.value.trim()) {
            this.classList.remove('border-red-500');
        }
    });
});