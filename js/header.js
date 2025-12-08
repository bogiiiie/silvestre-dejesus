// Mobile menu toggle - Tailwind only approach
const hamburgerToggle = document.getElementById('header-hamburger-toggle');
const mobileMenu = document.getElementById('header-mobile-menu');
const hamburgerLines = hamburgerToggle.querySelectorAll('.header-hamburger__line');

hamburgerToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('max-h-[500px]');

    if (isOpen) {
        // Close menu
        mobileMenu.classList.remove('max-h-[500px]', 'opacity-100');
        mobileMenu.classList.add('max-h-0', 'opacity-0');

        // Reset hamburger
        hamburgerLines[0].classList.remove('rotate-45', 'translate-y-2');
        hamburgerLines[1].classList.remove('opacity-0');
        hamburgerLines[2].classList.remove('-rotate-45', '-translate-y-2');

        hamburgerToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
        // Open menu
        mobileMenu.classList.remove('max-h-0', 'opacity-0');
        mobileMenu.classList.add('max-h-[500px]', 'opacity-100');

        // Animate to X
        hamburgerLines[0].classList.add('rotate-45', 'translate-y-2');
        hamburgerLines[1].classList.add('opacity-0');
        hamburgerLines[2].classList.add('-rotate-45', '-translate-y-2');

        hamburgerToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    }
});

// Close menu when clicking links
const mobileLinks = document.querySelectorAll('.header-mobile-nav__link');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('max-h-[500px]', 'opacity-100');
        mobileMenu.classList.add('max-h-0', 'opacity-0');

        hamburgerLines[0].classList.remove('rotate-45', 'translate-y-2');
        hamburgerLines[1].classList.remove('opacity-0');
        hamburgerLines[2].classList.remove('-rotate-45', '-translate-y-2');

        hamburgerToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    });
});