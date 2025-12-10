// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true, // Changed from false to true
    offset: 0, // CHANGED: from 100 to 0 for immediate visibility
    delay: 50, // CHANGED: from 0 to 50 for better timing
    throttleDelay: 99,
    debounceDelay: 50,
    startEvent: 'DOMContentLoaded',
    // Disable AOS if user prefers reduced motion
    disable: prefersReducedMotion.matches
});

// Listen for changes in reduced motion preference
prefersReducedMotion.addEventListener('change', () => {
    AOS.refresh({
        offset: 0, // Added: ensure offset remains 0 on refresh
        duration: 800,
        once: false,
        mirror: true
    });
});