    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false,
        offset: 100,
        delay: 0,
        // Disable AOS if user prefers reduced motion
        disable: prefersReducedMotion.matches
    });
    
    // Listen for changes in reduced motion preference
    prefersReducedMotion.addEventListener('change', () => {
        AOS.refresh();
    });