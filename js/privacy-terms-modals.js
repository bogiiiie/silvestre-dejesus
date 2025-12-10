// Privacy Modal Functions
function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Terms Modal Functions
function openTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Generic modal utilities
function isModalOpen(modalId) {
    const modal = document.getElementById(modalId);
    return modal && !modal.classList.contains('hidden');
}

function closeAllModals() {
    // Close project modal (if exists in your code)
    if (typeof closeModal === 'function') {
        closeModal();
    }
    
    // Close privacy modal
    closePrivacyModal();
    
    // Close terms modal
    closeTermsModal();
}

// Setup modal event listeners
function setupModalEvents() {
    // Single Escape key handler for all modals
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Close modals on backdrop click
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');

    if (privacyModal) {
        privacyModal.addEventListener('click', function (e) {
            if (e.target.id === 'privacyModal') {
                closePrivacyModal();
            }
        });
    }

    if (termsModal) {
        termsModal.addEventListener('click', function (e) {
            if (e.target.id === 'termsModal') {
                closeTermsModal();
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', setupModalEvents);