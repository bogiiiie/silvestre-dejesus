/**
 * FILTER-PROJECTS.JS
 * This file handles filtering of dynamically generated project cards.
 * Now with dynamic filter tabs loaded from JSON.
 */

// Global variables
let filterData = {
    categories: [],
    locations: []
};

let activeFilters = {
    category: 'all',
    location: 'all'
};

// Load filter data from JSON
async function loadFilterData() {
    try {
        const response = await fetch('../data/filter-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading filter data:', error);
        // Fallback data
        return {
            categories: [
                { id: 'all', label: 'All Projects', type: 'category', default: true, order: 0 }
            ],
            locations: [
                { id: 'all', label: 'All Countries', type: 'location', flag: '', default: true, order: 0 }
            ]
        };
    }
}

// Create filter tabs dynamically
function createFilterTabs() {
    console.log('🎯 Creating dynamic filter tabs...');
    
    // Find the filter tabs container
    let filterControls = document.querySelector('[aria-label="Project filter controls"]');
    
    // If no existing container, create one
    if (!filterControls) {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) {
            console.error('❌ No projects-grid found');
            return;
        }
        
        // Create new filter container
        filterControls = document.createElement('div');
        filterControls.className = 'mb-12 space-y-6';
        filterControls.setAttribute('aria-label', 'Project filter controls');
        projectsGrid.parentNode.insertBefore(filterControls, projectsGrid);
    }
    
    // Clear existing content
    filterControls.innerHTML = '';
    
    // Create category filter section
    const categorySection = createFilterSection(
        'Filter by Category:', 
        'Project category filters',
        filterData.categories,
        'category-tabs'
    );
    
    // Create location filter section
    const locationSection = createFilterSection(
        'Filter by Location:', 
        'Project location filters',
        filterData.locations,
        'location-tabs'
    );
    
    filterControls.appendChild(categorySection);
    filterControls.appendChild(locationSection);
    
    // Initialize tab click handlers
    initializeTabHandlers();
}

// Create a filter section
function createFilterSection(title, ariaLabel, items, containerId) {
    const section = document.createElement('div');
    
    const titleEl = document.createElement('h2');
    titleEl.className = 'text-xs font-medium uppercase tracking-wider mb-2';
    titleEl.textContent = title;
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'flex flex-wrap gap-2';
    tabsContainer.setAttribute('role', 'tablist');
    tabsContainer.setAttribute('aria-label', ariaLabel);
    tabsContainer.id = containerId;
    
    // Sort items by order
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    
    sortedItems.forEach(item => {
        const button = document.createElement('button');
        button.className = `filter-tab px-4 py-2 ring-2 ${item.default ? 'ring-black bg-black text-white' : 'ring-border'} text-xs font-medium hover:ring-black active:ring-black transition-all duration-300 cursor-pointer`;
        button.setAttribute('data-filter', item.id);
        button.setAttribute('data-type', item.type);
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', item.default ? 'true' : 'false');
        button.setAttribute('aria-controls', 'projects-grid');
        
        // Add flag if present
        if (item.flag) {
            button.innerHTML = `<span aria-label="${item.label} flag" role="img">${item.flag}</span> ${item.label}`;
        } else {
            button.textContent = item.label;
        }
        
        tabsContainer.appendChild(button);
    });
    
    section.appendChild(titleEl);
    section.appendChild(tabsContainer);
    
    return section;
}

// Initialize tab click handlers
function initializeTabHandlers() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    console.log(`🎯 Found ${filterTabs.length} filter tabs`);
    
    filterTabs.forEach(tab => {
        // Remove existing listeners to prevent duplicates
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        
        newTab.addEventListener('click', function() {
            const filterType = this.getAttribute('data-type');
            const filterValue = this.getAttribute('data-filter');
            
            console.log(`🔍 Filter clicked: ${filterType} = ${filterValue}`);
            
            // Update active tab styling for this filter type
            document.querySelectorAll(`.filter-tab[data-type="${filterType}"]`).forEach(t => {
                t.classList.remove('ring-black', 'bg-black', 'text-white');
                t.classList.add('ring-border');
                t.setAttribute('aria-selected', 'false');
            });
            
            this.classList.remove('ring-border');
            this.classList.add('ring-black', 'bg-black', 'text-white');
            this.setAttribute('aria-selected', 'true');
            
            // Update active filters
            activeFilters[filterType] = filterValue;
            
            // Filter projects
            filterProjects();
        });
        
        // Keyboard navigation for tabs
        newTab.addEventListener('keydown', function(e) {
            const tabs = document.querySelectorAll(`.filter-tab[data-type="${this.getAttribute('data-type')}"]`);
            const currentIndex = Array.from(tabs).indexOf(this);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabs.length;
                tabs[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                tabs[prevIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                tabs[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                tabs[tabs.length - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Wait for cards to be generated before initializing filters
function initializeFilters() {
    console.log('🎯 Initializing project filters...');
    
    // Check if we're on projects page (has filter tabs)
    const filterTabs = document.querySelectorAll('.filter-tab');
    const noResults = document.getElementById('no-results');
    
    if (filterTabs.length === 0) {
        console.log('ℹ️ No filter tabs found - not on projects page');
        return;
    }
    
    // Function to get ALL current project card wrappers
    function getProjectCards() {
        return document.querySelectorAll('.project-card__wrapper');
    }
    
    // Filter function - gets fresh cards each time
    function filterProjects() {
        const projectCards = getProjectCards();
        let visibleCount = 0;
        
        console.log(`🔍 Filtering ${projectCards.length} projects...`);
        console.log(`Active filters: Category=${activeFilters.category}, Location=${activeFilters.location}`);
        
        projectCards.forEach(wrapper => {
            // Get the project card inside the wrapper
            const card = wrapper.querySelector('.project-card');
            if (!card) {
                console.warn('⚠️ No .project-card found in wrapper');
                return;
            }
            
            const category = card.getAttribute('data-category');
            const location = card.getAttribute('data-location');
            
            const categoryMatch = activeFilters.category === 'all' || activeFilters.category === category;
            const locationMatch = activeFilters.location === 'all' || activeFilters.location === location;
            
            if (categoryMatch && locationMatch) {
                wrapper.style.display = 'block';
                wrapper.setAttribute('aria-hidden', 'false');
                visibleCount++;
            } else {
                wrapper.style.display = 'none';
                wrapper.setAttribute('aria-hidden', 'true');
            }
        });
        
        console.log(`✅ ${visibleCount} projects visible after filtering`);
        
        // Show/hide no results message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
                noResults.setAttribute('aria-hidden', 'false');
                console.log('📭 No results found');
            } else {
                noResults.classList.add('hidden');
                noResults.setAttribute('aria-hidden', 'true');
            }
        }
        
        // Announce filter results for screen readers
        const resultsMessage = `${visibleCount} projects found matching your filters.`;
        announceResults(resultsMessage);
        
        // Update keyboard navigation for newly visible cards
        updateKeyboardNavigation();
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
    
    // Update keyboard navigation for visible cards
    function updateKeyboardNavigation() {
        const projectCards = getProjectCards();
        const visibleCards = Array.from(projectCards).filter(wrapper => 
            wrapper.style.display !== 'none'
        );
        
        visibleCards.forEach((wrapper, index) => {
            const card = wrapper.querySelector('.project-card');
            if (!card) return;
            
            card.setAttribute('tabindex', '0');
            
            // Remove existing listeners to prevent duplicates
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Add new listeners
            newCard.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const onclickValue = this.getAttribute('onclick');
                    if (onclickValue) {
                        const match = onclickValue.match(/openModal\((\d+)\)/);
                        if (match) {
                            const projectIndex = parseInt(match[1]);
                            if (window.openModal) {
                                window.openModal(projectIndex);
                            }
                        }
                    }
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % visibleCards.length;
                    const nextCard = visibleCards[nextIndex].querySelector('.project-card');
                    if (nextCard) nextCard.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + visibleCards.length) % visibleCards.length;
                    const prevCard = visibleCards[prevIndex].querySelector('.project-card');
                    if (prevCard) prevCard.focus();
                }
            });
        });
    }
    
    // Initial filter (show all projects)
    console.log('🎯 Running initial filter...');
    filterProjects();
    
    // Export filterProjects for manual refreshing if needed
    window.filterProjects = filterProjects;
}

// Wait for DOM and cards to be ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🏠 DOM loaded, loading filter data...');
    
    // Load filter data from JSON
    filterData = await loadFilterData();
    console.log('✅ Filter data loaded:', filterData);
    
    // Create dynamic filter tabs
    createFilterTabs();
    
    // Wait for cards to be generated by shared-projects.js
    // We'll check every 100ms for up to 5 seconds
    let checkCount = 0;
    const maxChecks = 50; // 5 seconds max
    const checkInterval = 100; // ms
    
    const checkForCards = setInterval(() => {
        const cardsExist = document.querySelectorAll('.project-card__wrapper').length > 0;
        const hasFilterTabs = document.querySelectorAll('.filter-tab').length > 0;
        
        if (cardsExist && hasFilterTabs) {
            console.log('✅ Project cards found, initializing filters...');
            clearInterval(checkForCards);
            initializeFilters();
        } else if (checkCount >= maxChecks) {
            console.log('⏰ Timeout waiting for project cards');
            clearInterval(checkForCards);
            if (hasFilterTabs) {
                console.log('⚠️ No cards found but filter tabs exist');
            }
        }
        
        checkCount++;
    }, checkInterval);
});

// Export for manual initialization if needed
window.initializeFilters = initializeFilters;
window.createFilterTabs = createFilterTabs;