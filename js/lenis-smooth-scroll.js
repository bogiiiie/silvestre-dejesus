// Initialize Lenis
window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
})

// Animation frame loop
function raf(time) {
    window.lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Integrate with AOS - do this AFTER AOS is loaded
window.addEventListener('load', function () {
    if (typeof AOS !== 'undefined') {
        // Sync Lenis scroll with AOS
        window.lenis.on('scroll', () => {
            AOS.refresh();
        });
    }
});

// Helper function to get header height
function getHeaderOffset() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight + 20 : 100;
}

// Helper function to scroll to element
function scrollToElement(element) {
    if (element && window.lenis) {
        window.lenis.scrollTo(element, {
            offset: -getHeaderOffset(),
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
    }
}

// Handle anchor link clicks
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for ALL links that contain anchors
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            // Check if it's a same-page anchor or cross-page anchor
            const [path, hash] = href.split('#');

            // If there's no path or it's the current page
            if (!path || path === '' || path === window.location.pathname.split('/').pop()) {
                const targetElement = document.getElementById(hash);

                if (targetElement) {
                    e.preventDefault();
                    scrollToElement(targetElement);
                    history.pushState(null, null, '#' + hash);
                }
            }
        });
    });

    // Handle hash on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            setTimeout(() => {
                scrollToElement(targetElement);
            }, 500);
        }
    }
});