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

// Close modals on ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closePrivacyModal();
        closeTermsModal();
    }
});

// Close modals on backdrop click
document.addEventListener('DOMContentLoaded', function () {
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
});