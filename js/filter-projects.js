// Filter functionality
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card__wrapper');
const noResults = document.getElementById('no-results');

let activeFilters = {
    category: 'all',
    location: 'all'
};

// Initialize filter tabs
filterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const filterType = this.getAttribute('data-type');
        const filterValue = this.getAttribute('data-filter');

        // Update active tab styling
        filterTabs.forEach(t => {
            if (t.getAttribute('data-type') === filterType) {
                t.classList.remove('ring-black', 'bg-black', 'text-white');
                t.classList.add('ring-border');
                t.setAttribute('aria-selected', 'false');
            }
        });

        this.classList.remove('ring-border');
        this.classList.add('ring-black', 'bg-black', 'text-white');
        this.setAttribute('aria-selected', 'true');

        // Update active filters
        activeFilters[filterType] = filterValue;

        // Filter projects
        filterProjects();
    });
});

function filterProjects() {
    let visibleCount = 0;

    // Temporarily disable AOS for smoother filtering
    if (typeof AOS !== 'undefined') {
        AOS.disable();
    }

    // First hide all with quick fade out
    projectCards.forEach(wrapper => {
        wrapper.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(10px)';
    });

    // Small delay for smooth transition
    setTimeout(() => {
        projectCards.forEach(wrapper => {
            const card = wrapper.querySelector('.project-card');
            const category = card.getAttribute('data-category');
            const location = card.getAttribute('data-location');

            const categoryMatch = activeFilters.category === 'all' || activeFilters.category === category;
            const locationMatch = activeFilters.location === 'all' || activeFilters.location === location;

            if (categoryMatch && locationMatch) {
                wrapper.style.display = 'block';
                
                // Force immediate visibility with CSS for instant appearance
                setTimeout(() => {
                    wrapper.style.opacity = '1';
                    wrapper.style.transform = 'translateY(0)';
                }, 10);
                
                // Reset AOS attributes for re-animation
                wrapper.setAttribute('data-aos', 'fade-up');
                wrapper.setAttribute('data-aos-offset', '0'); // Trigger immediately
                wrapper.setAttribute('data-aos-duration', '500'); // Faster animation
                visibleCount++;
            } else {
                wrapper.style.display = 'none';
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'translateY(10px)';
            }
        });

        // Force grid reflow for proper left alignment
        const grid = document.getElementById('projects-grid');
        if (grid) {
            const display = grid.style.display;
            grid.style.display = 'none';
            setTimeout(() => {
                grid.style.display = display || 'grid';
            }, 10);
        }

        // Re-enable and refresh AOS with immediate trigger settings
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.enable();
                AOS.refresh({
                    offset: 0, // Trigger immediately when in viewport
                    duration: 500, // Faster animation for filtered items
                    once: false,
                    mirror: true,
                    startEvent: 'load'
                });
            }, 50);
        }

    }, 50); // Initial transition delay

    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.classList.remove('hidden');
        noResults.setAttribute('aria-hidden', 'false');
    } else {
        noResults.classList.add('hidden');
        noResults.setAttribute('aria-hidden', 'true');
    }

    // Announce filter results for screen readers
    const resultsMessage = `${visibleCount} projects found matching your filters.`;
    announceResults(resultsMessage);
}

function announceResults(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Keyboard navigation for filter tabs
filterTabs.forEach((tab, index) => {
    tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextTab = filterTabs[index + 1] || filterTabs[0];
            nextTab.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevTab = filterTabs[index - 1] || filterTabs[filterTabs.length - 1];
            prevTab.focus();
        } else if (e.key === 'Home') {
            e.preventDefault();
            filterTabs[0].focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            filterTabs[filterTabs.length - 1].focus();
        }
    });
});

// Update keyboard navigation for project cards
projectCards.forEach((wrapper, index) => {
    const card = wrapper.querySelector('.project-card');
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const projectIndex = parseInt(card.getAttribute('onclick').match(/\d+/)[0]);
            openModal(projectIndex);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            // Find next visible card
            let nextIndex = index + 1;
            while (nextIndex < projectCards.length && projectCards[nextIndex].style.display === 'none') {
                nextIndex++;
            }
            if (nextIndex < projectCards.length) {
                projectCards[nextIndex].querySelector('.project-card').focus();
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            // Find previous visible card
            let prevIndex = index - 1;
            while (prevIndex >= 0 && projectCards[prevIndex].style.display === 'none') {
                prevIndex--;
            }
            if (prevIndex >= 0) {
                projectCards[prevIndex].querySelector('.project-card').focus();
            }
        }
    });
});

// Initialize filters on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial filter states
    filterTabs.forEach(tab => {
        const filterType = tab.getAttribute('data-type');
        const filterValue = tab.getAttribute('data-filter');
        
        if (filterValue === 'all') {
            tab.classList.add('ring-black', 'bg-black', 'text-white');
            tab.setAttribute('aria-selected', 'true');
        }
    });
    
    // Ensure initial filter is applied
    setTimeout(() => {
        filterProjects();
    }, 100);
});