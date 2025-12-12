// Privacy Modal Functions
function openPrivacyModal() {
    // Stop Lenis scrolling when modal opens
    if (window.lenis) {
        window.lenis.stop();
    }
    
    const modal = document.getElementById('privacyModal');
    if (modal) {
        // Add modal-open class to body
        document.body.classList.add('modal-open');
        
        // Prevent scroll events from bubbling to Lenis
        modal.addEventListener('wheel', stopPropagation, { passive: false });
        modal.addEventListener('touchmove', stopPropagation, { passive: false });
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Set focus for accessibility
        modal.focus();
    }
}

function closePrivacyModal() {
    // Resume Lenis scrolling when modal closes
    if (window.lenis) {
        window.lenis.start();
    }
    
    const modal = document.getElementById('privacyModal');
    if (modal) {
        // Remove event listeners
        modal.removeEventListener('wheel', stopPropagation);
        modal.removeEventListener('touchmove', stopPropagation);
        
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Terms Modal Functions
function openTermsModal() {
    // Stop Lenis scrolling when modal opens
    if (window.lenis) {
        window.lenis.stop();
    }
    
    const modal = document.getElementById('termsModal');
    if (modal) {
        // Add modal-open class to body
        document.body.classList.add('modal-open');
        
        // Prevent scroll events from bubbling to Lenis
        modal.addEventListener('wheel', stopPropagation, { passive: false });
        modal.addEventListener('touchmove', stopPropagation, { passive: false });
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Set focus for accessibility
        modal.focus();
    }
}

function closeTermsModal() {
    // Resume Lenis scrolling when modal closes
    if (window.lenis) {
        window.lenis.start();
    }
    
    const modal = document.getElementById('termsModal');
    if (modal) {
        // Remove event listeners
        modal.removeEventListener('wheel', stopPropagation);
        modal.removeEventListener('touchmove', stopPropagation);
        
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Helper function to stop event propagation
function stopPropagation(e) {
    e.stopPropagation();
}

// Generic modal utilities
function isModalOpen(modalId) {
    const modal = document.getElementById(modalId);
    return modal && !modal.classList.contains('hidden');
}

function closeAllModals() {
    // Check which modal is open and close it
    if (isModalOpen('privacyModal')) {
        closePrivacyModal();
    } else if (isModalOpen('termsModal')) {
        closeTermsModal();
    } else if (document.getElementById('projectModal') && 
               !document.getElementById('projectModal').classList.contains('hidden')) {
        // Close project modal if exists
        if (typeof closeModal === 'function') {
            closeModal();
        }
    }
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
    const projectModal = document.getElementById('projectModal');

    if (privacyModal) {
        privacyModal.addEventListener('click', function (e) {
            if (e.target === this || e.target.classList.contains('modal-backdrop')) {
                closePrivacyModal();
            }
        });
    }

    if (termsModal) {
        termsModal.addEventListener('click', function (e) {
            if (e.target === this || e.target.classList.contains('modal-backdrop')) {
                closeTermsModal();
            }
        });
    }
    
    if (projectModal) {
        projectModal.addEventListener('click', function (e) {
            if (e.target === this || e.target.classList.contains('modal-backdrop')) {
                if (typeof closeModal === 'function') {
                    closeModal();
                }
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', setupModalEvents);