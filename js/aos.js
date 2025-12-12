// Initialize AOS with settings that work with Lenis
AOS.init({
    duration: 800,
    once: false,
    mirror: false,
    offset: 100,
    // IMPORTANT: Disable AOS's scroll listener since Lenis handles it
    disable: false,
});

// Update AOS on Lenis scroll
if (window.lenis) {
    window.lenis.on('scroll', AOS.refresh);
}