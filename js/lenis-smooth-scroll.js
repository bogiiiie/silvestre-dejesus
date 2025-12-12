// SLIDIER / GLIDE MODE Lenis Setup
window.lenis = new Lenis({
    duration: 0.7,
    easing: (t) => 1 - Math.pow(1 - t, 3), // smooth, buttery, not slow
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 1.8, // more slide on mouse wheel
    syncTouch: false,
    gestureDirection: 'vertical',
    direction: 'vertical',
});



// RAF Loop (only one!)
function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// FIX: AOS should NOT refresh on scroll – causes shakiness
window.addEventListener('load', function () {
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.refresh(); // refresh only once after load
        }, 300);
    }
});

// Helper: Get header offset (static cleaner offset)
function getHeaderOffset() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight + 10 : 80; // smoother offset
}

// Smooth scroll handler
function scrollToElement(element) {
    if (element && window.lenis) {
        window.lenis.scrollTo(element, {
            offset: -getHeaderOffset(),
            duration: 1.2,
        });
    }
}

// Anchor click handler
document.addEventListener('DOMContentLoaded', function () {
    const anchors = document.querySelectorAll('a[href*="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const [path, hash] = href.split('#');

            if (!path || path === '' || path === window.location.pathname.split('/').pop()) {
                const targetElement = document.getElementById(hash);

                if (targetElement) {
                    e.preventDefault();
                    scrollToElement(targetElement);

                    // Update URL quietly
                    if (history.pushState) {
                        history.pushState(null, null, '#' + hash);
                    }
                }
            }
        });
    });

    // Scroll to hash on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            setTimeout(() => {
                scrollToElement(targetElement);
            }, 800);
        }
    }
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (window.lenis) {
        window.lenis.destroy();
    }
});
