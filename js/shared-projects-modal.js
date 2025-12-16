/**
 * ============================================
 * PROJECT PORTFOLIO SYSTEM - CARD GENERATOR & MODAL
 * ============================================
 * This file handles:
 * 1. Loading project data from JSON
 * 2. Generating project cards dynamically
 * 3. Modal functionality with Lenis scroll control
 * 
 * NOTE: Filtering system is handled separately in filter.js
 * 
 * Features:
 * - Home page shows only 4 featured projects
 * - Projects page shows ALL projects
 * - Lenis smooth scroll integration (stops on modal open, resumes on close)
 * - Responsive design
 * - Accessible modal system
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

let projectsData = [];      // Stores all projects loaded from JSON
let currentProject = null;  // Project currently open in modal
let currentImageIndex = 0;  // Current image index in modal gallery

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

/**
 * Load projects data from JSON file
 * Called when the page loads to fetch project data
 */
async function loadProjectsData() {
    try {
        console.log('📥 Loading projects data from data/projects.json...');
        
        // Fetch data from the JSON file
        const response = await fetch('../data/projects.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        projectsData = data.projects || [];
        
        console.log(`✅ Successfully loaded ${projectsData.length} projects from JSON`);
        
        // Initialize the page with the loaded data
        initializePage();
        
    } catch (error) {
        console.error('❌ Error loading projects data:', error);
        
        // Show error message to user
        showDataLoadError();
    }
}

/**
 * Show error message if data fails to load
 */
function showDataLoadError() {
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="inline-block p-6 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-red-600 font-medium mb-2">Unable to load projects data</p>
                    <p class="text-gray-600 text-sm mb-4">Please check if the data/projects.json file exists.</p>
                    <button onclick="location.reload()" 
                            class="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
                        ↻ Reload Page
                    </button>
                </div>
            </div>
        `;
    }
}

// ============================================
// PAGE INITIALIZATION
// ============================================

/**
 * Initialize the page after data is loaded
 * Determines which page we're on and sets up accordingly
 */
function initializePage() {
    // Check if we're on home page
    const isHomePage = document.body.classList.contains('home-page') || 
                      window.location.pathname.includes('index.html') ||
                      window.location.pathname === '/' ||
                      document.querySelector('body.home') !== null;
    
    console.log(`🏠 Page detected: ${isHomePage ? 'Home Page' : 'Projects Page'}`);
    
    // Generate project cards for this page
    generateProjectCards(isHomePage);
    
    // Initialize modal event listeners
    initializeModalEvents();
    
    // Refresh AOS animations if library is loaded (once, not on scroll)
    if (typeof AOS !== 'undefined') {
        // Use setTimeout to ensure AOS runs after DOM is fully rendered
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }
}

// ============================================
// PROJECT CARD GENERATION
// ============================================

/**
 * Generate and display project cards based on current page
 * @param {boolean} isHomePage - True if on home page, false if on projects page
 */
function generateProjectCards(isHomePage = false) {
    const projectsGrid = document.getElementById('projects-grid');
    
    // Exit if grid doesn't exist on this page
    if (!projectsGrid) {
        console.warn('⚠️ Projects grid element (#projects-grid) not found on this page');
        return;
    }
    
    // Clear any existing content
    projectsGrid.innerHTML = '';
    
    // Determine which projects to show
    let projectsToShow = [];
    let pageDescription = '';
    
    if (isHomePage) {
        // HOME PAGE: Show only featured projects, limited to 4
        projectsToShow = projectsData
            .filter(project => project.featured === true)
            .slice(0, 4); // Maximum 4 projects on home page
        
        pageDescription = `Home page: Showing ${projectsToShow.length} featured projects`;
        
    } else {
        // PROJECTS PAGE: Show ALL projects
        projectsToShow = projectsData;
        pageDescription = `Projects page: Showing all ${projectsToShow.length} projects`;
    }
    
    console.log(`📊 ${pageDescription}`);
    
    // Show message if no projects to display
    if (projectsToShow.length === 0) {
        projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 italic">No projects to display at the moment.</p>
            </div>
        `;
        return;
    }
    
    // Generate HTML for each project card
    projectsToShow.forEach((project, index) => {
        const cardHTML = createProjectCardHTML(project, index, isHomePage);
        projectsGrid.innerHTML += cardHTML;
    });
    
    console.log(`✅ Generated ${projectsToShow.length} project cards`);
    
    // If on home page and there are more projects, log a note
    if (isHomePage && projectsData.length > 4) {
        const nonFeaturedCount = projectsData.filter(p => !p.featured).length;
        console.log(`💡 Note: ${projectsData.length - 4} more projects available on Projects page`);
        console.log(`   - ${nonFeaturedCount} non-featured projects not shown on home page`);
    }
}

/**
 * Create HTML for a single project card
 * @param {Object} project - The project data object
 * @param {number} index - Index of project in array
 * @param {boolean} isHomePage - Whether this is for home page
 * @returns {string} HTML string for the card
 */
function createProjectCardHTML(project, index, isHomePage) {
    // Format category for display (convert "high-rise" to "High-Rise")
    const categoryDisplay = formatCategory(project.category);
    
    // Only add AOS animation on home page (if project has animation property)
    const animationAttr = isHomePage && project.animation ? 
        `data-aos="${project.animation}" data-aos-delay="${index * 100}"` : '';
    
    // Different schema markup for home vs projects page
    const schemaAttr = isHomePage ? 
        'itemscope itemtype="https://schema.org/CreativeWork"' : 
        'itemprop="itemListElement" itemscope itemtype="https://schema.org/CreativeWork"';
    
    // Different class for home page cards
    const featuredClass = isHomePage ? 'project-card--featured' : '';
    
    return `
        <!-- Project Card ${index + 1}: ${project.title} -->
        <div class="project-card__wrapper" ${animationAttr} role="listitem">
            <article
                class="project-card ${featuredClass} bg-white border border-gray-300 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:-translate-y-2 active:shadow-2xl group cursor-pointer"
                data-category="${project.category}"
                data-location="${project.location}"
                onclick="openModal(${index})"
                ${schemaAttr}
                tabindex="0"
                aria-label="${project.title} project - Click to view details">
                
                <!-- Image Section -->
                <div class="h-64 sm:h-80 overflow-hidden relative" itemscope itemtype="https://schema.org/ImageObject">
                    <img class="project-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-110"
                        src="${project.cardImage}"
                        alt="${project.altText}"
                        loading="lazy"
                        width="800"
                        height="600"
                        itemprop="image">
                    <div class="project-card__overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 ${isHomePage ? '' : 'group-active:opacity-100'} transition-opacity duration-300"
                        aria-hidden="true">
                    </div>
                </div>
                
                <!-- Content Section -->
                <div class="project-card__content p-6 sm:p-8">
                    <!-- Category & Location Tags -->
                    <div class="project-card__meta flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                        <span class="project-card__category px-2 sm:px-3 py-1 bg-black text-white text-xs font-medium"
                            itemprop="genre">
                            ${categoryDisplay}
                        </span>
                        <span class="project-card__location text-xs sm:text-sm text-gray-500"
                            itemprop="locationCreated">
                            ${project.specs.Location}
                        </span>
                    </div>
                    
                    <!-- Project Title -->
                    <h3 class="project-card__title text-xl sm:text-2xl font-bold mb-2 sm:mb-3" itemprop="name">
                        ${project.title}
                    </h3>
                    
                    <!-- Short Description -->
                    <p class="project-card__description text-sm sm:text-base text-gray-600 mb-3 sm:mb-4"
                        itemprop="description">
                        ${project.shortDescription}
                    </p>
                    
                    <!-- Client & Arrow -->
                    <div class="project-card__footer flex items-center justify-between">
                        <span class="project-card__client text-xs sm:text-sm font-medium"
                            itemprop="publisher">
                            ${project.client}
                        </span>
                        <i class="fa-solid fa-arrow-right project-card__arrow text-lg sm:text-xl transition-transform group-hover:translate-x-2 group-active:translate-x-2"
                            aria-hidden="true" role="presentation"></i>
                    </div>
                </div>
            </article>
        </div>
    `;
}

/**
 * Format category names for display
 * Converts "high-rise" to "High-Rise", "uae" to "UAE", etc.
 * @param {string} category - The category string from data
 * @returns {string} Formatted category name
 */
function formatCategory(category) {
    const categoryMap = {
        'high-rise': 'High-Rise',
        'infrastructure': 'Infrastructure',
        'commercial': 'Commercial',
        'aviation': 'Aviation',
        'residential': 'Residential',
        'industrial': 'Industrial',
        'uae': 'UAE',
        'australia': 'Australia',
        'singapore': 'Singapore',
        'uk': 'United Kingdom'
    };
    
    // Return mapped value or capitalize each word
    return categoryMap[category] || 
           category.split('-').map(word => 
               word.charAt(0).toUpperCase() + word.slice(1)
           ).join(' ');
}

// ============================================
// MODAL SYSTEM WITH LENIS INTEGRATION
// ============================================

/**
 * Initialize modal event listeners
 * Sets up keyboard and click events for modal
 */
function initializeModalEvents() {
    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            closeModal();
        }
    });
    
    // Close modal when clicking on backdrop
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this || e.target.classList.contains('modal-backdrop')) {
                closeModal();
            }
        });
    }
}

/**
 * Open the project detail modal with Lenis scroll control
 * @param {number} projectIndex - Index of the project in projectsData array
 */
function openModal(projectIndex) {
    // Validate project index
    if (projectIndex < 0 || projectIndex >= projectsData.length) {
        console.error(`Invalid project index: ${projectIndex}`);
        return;
    }
    
    // Set current project and reset image index
    currentProject = projectsData[projectIndex];
    currentImageIndex = 0;
    
    console.log(`📂 Opening modal for project #${projectIndex + 1}: ${currentProject.title}`);
    
    // ============================================
    // CRITICAL: STOP LENIS SMOOTH SCROLLING
    // This prevents background scrolling while modal is open
    // ============================================
    if (window.lenis) {
        console.log('⏸️  Stopping Lenis smooth scrolling for modal');
        window.lenis.stop();
    }
    
    // Add modal-open class to body for CSS control
    document.body.classList.add('modal-open');
    
    // Get modal element
    const modal = document.getElementById('projectModal');
    if (!modal) {
        console.error('❌ Project modal element (#projectModal) not found in HTML');
        return;
    }
    
    // Set modal state attribute
    modal.setAttribute('data-modal-open', 'true');
    
    // Prevent scroll events from bubbling (important for modal scrolling)
    // This stops wheel/touch events from reaching Lenis
    modal.addEventListener('wheel', stopPropagation, { passive: false });
    modal.addEventListener('touchmove', stopPropagation, { passive: false });
    
    // Update all modal content
    updateModalContent();
    
    // Show the modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
    
    // Set focus for accessibility
    modal.setAttribute('tabindex', '-1');
    modal.focus();
}

/**
 * Update all content inside the modal
 */
function updateModalContent() {
    if (!currentProject) return;
    
    // Update title
    updateModalTitle();
    
    // Update images
    updateModalImage();
    
    // Update thumbnails
    updateThumbnails();
    
    // Update specifications
    updateSpecifications();
    
    // Update software badges
    updateSoftwareBadges();
    
    // Update description
    updateDescription();
}

/**
 * Update the modal title
 */
function updateModalTitle() {
    if (!currentProject) return;
    
    const titleElement = document.getElementById('modalTitle');
    if (titleElement) {
        titleElement.textContent = currentProject.title;
    }
}

/**
 * Update the main image in the modal
 */
function updateModalImage() {
    if (!currentProject || !currentProject.images || currentProject.images.length === 0) return;
    
    const currentImage = currentProject.images[currentImageIndex];
    const mainImage = document.getElementById('mainImage');
    const imageCaption = document.getElementById('imageCaption');
    
    if (mainImage) {
        mainImage.src = currentImage.url;
        mainImage.alt = currentImage.caption;
    }
    
    if (imageCaption) {
        imageCaption.textContent = currentImage.caption;
    }
    
    // Show/hide navigation buttons based on number of images
    const hasMultipleImages = currentProject.images.length > 1;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        prevBtn.classList.toggle('hidden', !hasMultipleImages);
        nextBtn.classList.toggle('hidden', !hasMultipleImages);
    }
}

/**
 * Update thumbnail images in the modal
 */
function updateThumbnails() {
    if (!currentProject) return;
    
    const thumbnailsContainer = document.getElementById('thumbnails');
    if (!thumbnailsContainer) return;
    
    // Clear existing thumbnails
    thumbnailsContainer.innerHTML = '';
    
    const hasMultipleImages = currentProject.images.length > 1;
    
    if (hasMultipleImages) {
        thumbnailsContainer.classList.remove('hidden');
        
        currentProject.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img.url;
            thumb.alt = `Thumbnail ${index + 1}: ${img.caption}`;
            thumb.className = `size-18 sm:size-24 object-cover cursor-pointer border-2 transition-all ${
                index === currentImageIndex ? 
                'border-black opacity-100' : 
                'border-gray-300 opacity-60 hover:opacity-100 hover:border-gray-400'
            }`;
            thumb.onclick = () => {
                currentImageIndex = index;
                updateModalImage();
                updateThumbnails(); // Update borders
            };
            thumbnailsContainer.appendChild(thumb);
        });
    } else {
        thumbnailsContainer.classList.add('hidden');
    }
}

/**
 * Update specifications table in modal
 */
function updateSpecifications() {
    if (!currentProject || !currentProject.specs) return;
    
    const specsContainer = document.getElementById('specs');
    if (!specsContainer) return;
    
    specsContainer.innerHTML = '';
    
    Object.entries(currentProject.specs).forEach(([key, value]) => {
        const specItem = document.createElement('div');
        specItem.className = 'flex justify-between';
        specItem.innerHTML = `
            <span class="text-xs sm:text-sm font-medium text-gray-600">${key}:</span>
            <span class="text-xs sm:text-sm font-bold text-right">${value}</span>
        `;
        specsContainer.appendChild(specItem);
    });
}

/**
 * Update software badges in modal
 */
function updateSoftwareBadges() {
    if (!currentProject || !currentProject.software) return;
    
    const softwareContainer = document.getElementById('software');
    if (!softwareContainer) return;
    
    softwareContainer.innerHTML = '';
    
    currentProject.software.forEach(sw => {
        const badge = document.createElement('span');
        badge.className = 'px-3 py-1 bg-black text-white text-[10px] sm:text-xs font-medium rounded inline-block mr-2 mb-2';
        badge.textContent = sw;
        softwareContainer.appendChild(badge);
    });
}

/**
 * Update project description in modal
 */
function updateDescription() {
    if (!currentProject || !currentProject.description) return;
    
    const descriptionContainer = document.getElementById('description');
    if (!descriptionContainer) return;
    
    descriptionContainer.innerHTML = `<p class="text-sm sm:text-base leading-relaxed">${currentProject.description}</p>`;
}

/**
 * Navigate to next/previous image in modal
 * @param {number} direction - 1 for next, -1 for previous
 */
function changeImage(direction) {
    if (!currentProject || !currentProject.images) return;
    
    currentImageIndex += direction;
    
    // Loop around if at ends
    if (currentImageIndex < 0) {
        currentImageIndex = currentProject.images.length - 1;
    }
    if (currentImageIndex >= currentProject.images.length) {
        currentImageIndex = 0;
    }
    
    updateModalImage();
    updateThumbnails();
}

/**
 * Close the project detail modal with Lenis scroll control
 */
function closeModal() {
    console.log('📕 Closing modal');
    
    // ============================================
    // CRITICAL: RESTART LENIS SMOOTH SCROLLING
    // This resumes your buttery smooth scrolling
    // ============================================
    if (window.lenis) {
        console.log('▶️  Restarting Lenis smooth scrolling');
        window.lenis.start();
    }
    
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    // Remove event listeners
    modal.removeEventListener('wheel', stopPropagation);
    modal.removeEventListener('touchmove', stopPropagation);
    
    // Remove modal classes and attributes
    document.body.classList.remove('modal-open');
    modal.removeAttribute('data-modal-open');
    modal.removeAttribute('tabindex');
    
    // Hide modal
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Restore body scrolling
    
    // Reset current project
    currentProject = null;
    currentImageIndex = 0;
}

/**
 * Helper function to stop event propagation
 * Prevents scroll events from reaching Lenis while modal is open
 * @param {Event} e - The event object
 */
function stopPropagation(e) {
    // Only stop propagation so Lenis (or the page) doesn't receive the event.
    // Do NOT call preventDefault here — that blocks the browser's native
    // scrolling inside the modal. Leaving the default lets the modal's
    // scroll container handle the scroll as expected on desktop and touch.
    e.stopPropagation();
}

// ============================================
// EVENT DELEGATION FOR DYNAMIC CARDS
// ============================================

/**
 * Handle clicks on dynamically generated cards
 * This is needed because cards are generated after page load
 */
document.addEventListener('click', function (e) {
    // Check if click was on a project card or its child
    const projectCard = e.target.closest('.project-card');
    if (projectCard) {
        // Find the onclick attribute value
        const onclickValue = projectCard.getAttribute('onclick');
        if (onclickValue) {
            // Extract project index from onclick="openModal(X)"
            const match = onclickValue.match(/openModal\((\d+)\)/);
            if (match) {
                const projectIndex = parseInt(match[1]);
                console.log(`🎯 Card clicked, opening project index: ${projectIndex}`);
                openModal(projectIndex);
            }
        }
    }
});

// ============================================
// STARTUP AND GLOBAL EXPORTS
// ============================================

/**
 * Initialize everything when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM loaded, starting project portfolio system...');
    loadProjectsData();
});

/**
 * Expose functions to global scope for HTML onclick attributes
 * This allows onclick="openModal(0)" to work in dynamically generated cards
 */
window.openModal = openModal;
window.closeModal = closeModal;
window.changeImage = changeImage;