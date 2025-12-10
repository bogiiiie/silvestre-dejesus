// Filter functionality
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card__wrapper'); // CHANGED: target wrapper divs
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

    projectCards.forEach(wrapper => {
        // Get the project card inside the wrapper
        const card = wrapper.querySelector('.project-card');
        const category = card.getAttribute('data-category');
        const location = card.getAttribute('data-location');

        const categoryMatch = activeFilters.category === 'all' || activeFilters.category === category;
        const locationMatch = activeFilters.location === 'all' || activeFilters.location === location;

        if (categoryMatch && locationMatch) {
            wrapper.style.display = 'block'; // Show the wrapper
            visibleCount++;
        } else {
            wrapper.style.display = 'none'; // Hide the wrapper
        }
    });

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