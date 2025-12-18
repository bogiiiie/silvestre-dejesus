// Progress bar animation
window.addEventListener('load', function () {
    // Select all progress bars and percentage text
    const progressBars = document.querySelectorAll('.progress-fill');

    // Animation function for single progress bar
    const animateProgressBar = (bar) => {
        const target = parseInt(bar.getAttribute('data-target')); // Target percentage
        const duration = 1500; // Animation duration (1.5 seconds)
        const increment = target / (duration / 16); // Per-frame increment
        let current = 0; // Start from 0

        const parent = bar.parentElement; // Get parent for ARIA updates
        const percentElement = bar.parentElement.parentElement.querySelector('.progress-percent'); // Find percentage text

        const timer = setInterval(() => {
            current += increment; // Increase current value

            if (current >= target) {
                // Final state: Set to target value
                bar.style.width = target + '%';
                percentElement.textContent = target + '%';
                parent.setAttribute('aria-valuenow', target);
                clearInterval(timer); // Stop animation
            } else {
                // During animation: Update progressively
                const display = Math.floor(current);
                bar.style.width = current + '%';
                percentElement.textContent = display + '%';
                parent.setAttribute('aria-valuenow', display);
            }
        }, 16); // 60 FPS (16ms per frame)
    };

    // Scroll-triggered animation using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target); // Start animation
                observer.unobserve(entry.target); // Run only once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    // Start observing all progress bars
    progressBars.forEach(bar => observer.observe(bar));


    // Check if all progress-fill elements have data-target
    document.querySelectorAll('.progress-fill').forEach((bar, index) => {
        const hasTarget = bar.hasAttribute('data-target');
        console.log(`Bar ${index + 1}: ${hasTarget ? 'OK' : 'MISSING data-target'}`);
    });
});

