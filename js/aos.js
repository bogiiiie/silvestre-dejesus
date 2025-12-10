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
});
