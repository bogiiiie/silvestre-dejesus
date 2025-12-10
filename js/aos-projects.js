// AOS initialization for Projects page only
if (document.querySelector('.project-card__wrapper')) {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Calculate 1/8th viewport trigger specifically for projects
    const viewportHeight = window.innerHeight;
    const triggerOffset = -viewportHeight * 0.875; // Negative means trigger early

    AOS.init({
        duration: 800, // Faster for projects
        easing: 'ease-out', // Quicker easing
        once: false,
        mirror: true,
        offset: triggerOffset, // Trigger when just 1/8th is visible
        delay: 0, // No delay for projects
        throttleDelay: 50, // More responsive
        debounceDelay: 10, // Quicker response
        startEvent: 'DOMContentLoaded',
        // Disable AOS if user prefers reduced motion
        disable: prefersReducedMotion.matches,
        // Only animate elements on projects page
        selector: '.project-card__wrapper, .filter-tab, #no-results, .text-center a[href="contacts.html"]'
    });

    // Listen for changes in reduced motion preference
    prefersReducedMotion.addEventListener('change', () => {
        AOS.refresh({
            offset: triggerOffset,
            duration: 800,
            once: false,
            mirror: true
        });
    });
}