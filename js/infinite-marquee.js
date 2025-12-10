// Infinite Marquee with JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Function to initialize a marquee
    function initMarquee(marqueeContent, speed = 40) {
        const content = marqueeContent.querySelector('.featured-work__marquee-list');
        const items = Array.from(content.children);
        
        // Calculate how many duplicates we need
        const containerWidth = marqueeContent.parentElement.offsetWidth;
        const contentWidth = content.offsetWidth;
        
        // We need enough duplicates to fill at least 2x the container width
        let duplicatesNeeded = Math.ceil((containerWidth * 2) / contentWidth);
        
        // Minimum of 3 duplicates for smoothness
        duplicatesNeeded = Math.max(duplicatesNeeded, 3);
        
        // Create duplicates
        for (let i = 0; i < duplicatesNeeded; i++) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                // Remove aria-hidden from clones if present
                clone.removeAttribute('aria-hidden');
                // Set role for accessibility
                clone.setAttribute('role', 'listitem');
                content.appendChild(clone);
            });
        }
        
        // Adjust animation speed based on content length
        const totalItems = items.length * (duplicatesNeeded + 1);
        const animationDuration = speed * (totalItems / items.length);
        
        // Apply animation duration
        if (marqueeContent.classList.contains('featured-work__marquee-content--reverse')) {
            marqueeContent.style.animationDuration = `${animationDuration}s`;
        } else {
            marqueeContent.style.animationDuration = `${animationDuration}s`;
        }
        
        // Pause animation on hover
        marqueeContent.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        marqueeContent.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Handle visibility changes for performance
        let timeout;
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                marqueeContent.style.animationPlayState = 'paused';
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    marqueeContent.style.animationPlayState = 'running';
                }, 100);
            }
        });
    }
    
    // Initialize all marquees
    const marqueeContents = document.querySelectorAll('.featured-work__marquee-content, .featured-work__marquee-content--reverse');
    
    // Wait for fonts and images to load for accurate measurements
    window.addEventListener('load', function() {
        marqueeContents.forEach((content, index) => {
            // Slightly different speeds for visual interest
            const speed = index === 0 ? 40 : 45;
            setTimeout(() => initMarquee(content, speed), 100);
        });
    });
    
    // Fallback in case load event already fired
    if (document.readyState === 'complete') {
        marqueeContents.forEach((content, index) => {
            const speed = index === 0 ? 40 : 45;
            setTimeout(() => initMarquee(content, speed), 100);
        });
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Remove all duplicates and reinitialize
            marqueeContents.forEach(content => {
                const list = content.querySelector('.featured-work__marquee-list');
                const originalItems = Array.from(list.children).slice(0, 6); // Keep only first 6 original items
                list.innerHTML = '';
                originalItems.forEach(item => list.appendChild(item));
            });
            
            // Reinitialize with new measurements
            marqueeContents.forEach((content, index) => {
                const speed = index === 0 ? 40 : 45;
                setTimeout(() => initMarquee(content, speed), 100);
            });
        }, 250);
    });
});