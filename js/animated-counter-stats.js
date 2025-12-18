// Animated statistics counter
window.addEventListener('load', function () {
    // Select all stat number elements
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Counter animation function
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target')); // Target number
        const duration = 2000; // 2 second animation
        const increment = target / (duration / 16); // Per-frame increment
        let current = 0; // Start from 0
        
        const timer = setInterval(() => {
            current += increment; // Increase value
            
            if (current >= target) {
                // Final value with plus sign
                element.textContent = target + '+';
                clearInterval(timer); // Stop animation
            } else {
                // Update with current whole number
                element.textContent = Math.floor(current);
            }
        }, 16); // 60 FPS animation
    };
    
    // Scroll-triggered animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target); // Start animation
                observer.unobserve(entry.target); // Run once only
            }
        });
    }, { threshold: 0.5 }); // 50% visibility trigger
    
    // Observe all stat numbers
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Optional: Fade in animations
    const fadeElements = document.querySelectorAll('.animate-fadeInUp');
    fadeElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1'; // Fade in element
        }, index * 200); // Staggered delay
    });
});