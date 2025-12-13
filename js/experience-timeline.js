document.addEventListener('DOMContentLoaded', function () {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineTrack = document.getElementById('timeline-track');
    const prevBtnMobile = document.getElementById('timeline-prev-mobile');
    const nextBtnMobile = document.getElementById('timeline-next-mobile');
    const dots = document.querySelectorAll('.timeline-dot');
    const currentPeriodMobile = document.getElementById('current-period-mobile');
    const currentPositionMobile = document.getElementById('current-position-mobile');

    let currentIndex = 0;
    const totalItems = timelineItems.length;
    let cardWidth = timelineItems[0].offsetWidth;

    // Initialize
    updateNavigation();
    updateCurrentInfo();
    updateActiveDot();
    updateActiveCard();

    // Handle window resize
    window.addEventListener('resize', () => {
        cardWidth = timelineItems[0].offsetWidth;
        updateTimeline();
    });

    // Mobile navigation
    if (prevBtnMobile) prevBtnMobile.addEventListener('click', goPrev);
    if (nextBtnMobile) nextBtnMobile.addEventListener('click', goNext);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateTimeline();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goPrev();
        } else if (e.key === 'ArrowRight') {
            goNext();
        }
    });

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateTimeline();
        }
    }

    function goNext() {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateTimeline();
        }
    }

    function updateTimeline() {
        const translateX = -currentIndex * cardWidth;
        timelineTrack.style.transform = `translateX(${translateX}px)`;

        updateNavigation();
        updateCurrentInfo();
        updateActiveDot();
        updateActiveCard();
    }

    function updateNavigation() {
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === totalItems - 1;

        if (prevBtnMobile) prevBtnMobile.disabled = isFirst;
        if (nextBtnMobile) nextBtnMobile.disabled = isLast;
    }

    function updateCurrentInfo() {
        const activeItem = timelineItems[currentIndex];
        const period = activeItem.getAttribute('data-period');

        // Use the custom class
        const positionElement = activeItem.querySelector('.timeline-company');

        const position = positionElement ? positionElement.textContent : '';

        if (currentPeriodMobile) currentPeriodMobile.textContent = period;
        if (currentPositionMobile) currentPositionMobile.textContent = position;
    }

    function updateActiveDot() {
        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;
            dot.setAttribute('aria-selected', isActive);

            if (isActive) {
                dot.classList.add('active', 'bg-black');
                dot.classList.remove('bg-border');
                dot.style.width = '8px';
                dot.style.height = '8px';
            } else {
                dot.classList.remove('active', 'bg-black');
                dot.classList.add('bg-border');
                dot.style.width = '8px';
                dot.style.height = '8px';
            }
        });
    }

    function updateActiveCard() {
        timelineItems.forEach((item, index) => {
            // Use the custom class
            const card = item.querySelector('.timeline-card');

            if (index === currentIndex) {
                card.classList.add('active-card');
                card.classList.add('border-2', 'border-black');
                card.classList.remove('border-border');
            } else {
                card.classList.remove('active-card');
                card.classList.remove('border-2', 'border-black');
                card.classList.add('border-border');
            }
        });
    }

    // Touch/swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    timelineTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    timelineTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < totalItems - 1) {
                // Swipe left - next
                goNext();
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous
                goPrev();
            }
        }
    }
});