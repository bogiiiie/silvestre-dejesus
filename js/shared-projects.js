// shared-projects.js - Works for both home.html and projects.html

// Project Data
const projectsData = [
    {
        title: "One Za'abeel Tower",
        images: [
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/0e126dd91b-c474199562b60b819342.png", caption: "Exterior View - The Link Cantilever" },
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/0e126dd91b-c474199562b60b819342.png", caption: "Shop Drawing - Connection Detail" },
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/0e126dd91b-c474199562b60b819342.png", caption: "Construction Phase Documentation" }
        ],
        specs: {
            "Location": "Dubai, UAE",
            "Client": "One Za'abeel LLC",
            "Year": "2023",
            "Steel Tonnage": "15,000 tons",
            "Duration": "24 months"
        },
        software: ["Tekla Structures", "AutoCAD", "Advance Steel", "Navisworks"],
        description: "One Za'abeel represents one of the most challenging structural steel projects in the Middle East. The development features 'The Link' - the world's longest cantilever structure spanning 226 meters between two towers. Our team provided comprehensive steel detailing services including complex connection designs, cantilever support systems, and coordination with architectural facade elements. The project required precise calculations for load distribution and innovative solutions for the massive cantilever structure that defies conventional engineering approaches."
    },
    {
        title: "Sydney Gateway Stage 1",
        images: [
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/879261b099-a3ac9d62a0fda37edc0a.png", caption: "Bridge Structure Overview" }
        ],
        specs: {
            "Location": "Sydney, Australia",
            "Client": "John Holland & Seymour Whyte",
            "Year": "2022",
            "Steel Tonnage": "8,500 tons",
            "Duration": "18 months"
        },
        software: ["Tekla Structures", "AutoCAD", "Bentley MicroStation"],
        description: "The Sydney Gateway project is a critical infrastructure development connecting Sydney Airport to the broader motorway network. Our scope included detailed steel design for multiple bridge structures, including main girders, cross-beams, and support systems. The project demanded strict adherence to Australian standards and required extensive coordination with civil engineering teams. We delivered comprehensive shop drawings, erection sequences, and material specifications that ensured seamless fabrication and installation across all project phases."
    },
    {
        title: "ICD-Brookfield Place",
        images: [
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/a2ec33d0eb-834d9887859e203b3f93.png", caption: "Building Facade" },
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/a2ec33d0eb-834d9887859e203b3f93.png", caption: "Structural Steel Framework" }
        ],
        specs: {
            "Location": "Dubai, UAE - DIFC",
            "Client": "Investment Corporation of Dubai",
            "Year": "2021",
            "Steel Tonnage": "6,200 tons",
            "Duration": "16 months"
        },
        software: ["Tekla Structures", "AutoCAD", "Revit", "Navisworks"],
        description: "ICD-Brookfield Place stands as a premium office development within Dubai International Financial Centre. The project featured intricate steel framework systems supporting modern facade designs and open-plan floor layouts. Our detailing services covered primary structural steel members, secondary framing elements, and specialized facade support systems. The project required extensive BIM coordination to ensure seamless integration with MEP systems and architectural elements, delivering precision-engineered solutions that met the highest international standards."
    },
    {
        title: "Concourse B Platform Steelworks",
        images: [
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/4e82fb47f5-1e7d0afa7ad9ce3f0070.png", caption: "Platform Canopy Structure" },
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/4e82fb47f5-1e7d0afa7ad9ce3f0070.png", caption: "Support Column Details" },
            { url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/4e82fb47f5-1e7d0afa7ad9ce3f0070.png", caption: "Connection Assemblies" }
        ],
        specs: {
            "Location": "Dubai, UAE",
            "Client": "Dubai Aviation Corporation",
            "Year": "2020",
            "Steel Tonnage": "4,800 tons",
            "Duration": "14 months"
        },
        software: ["Tekla Structures", "AutoCAD", "Advance Steel"],
        description: "This large-scale airport infrastructure project involved precision steel detailing for platform canopies and extensive support structures at Dubai International Airport's Concourse B. The project presented unique challenges including strict aviation safety requirements, minimal disruption to ongoing airport operations, and coordination with multiple stakeholders. We delivered detailed shop drawings for canopy structures, column supports, and complex connection details that ensured structural integrity while maintaining the architectural vision of creating a light, airy passenger experience."
    }
];

let currentProject = null;
let currentImageIndex = 0;

function openModal(projectIndex) {
    currentProject = projectsData[projectIndex];
    currentImageIndex = 0;
    
    const modal = document.getElementById('projectModal');
    if (!modal) {
        console.error('Project modal not found');
        return;
    }
    
    document.getElementById('modalTitle').textContent = currentProject.title;
    
    // Display images
    updateImage();
    
    // Show/hide navigation based on image count
    const hasMultipleImages = currentProject.images.length > 1;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn && nextBtn) {
        prevBtn.classList.toggle('hidden', !hasMultipleImages);
        nextBtn.classList.toggle('hidden', !hasMultipleImages);
    }
    
    // Generate thumbnails
    const thumbnailsContainer = document.getElementById('thumbnails');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = '';
        if (hasMultipleImages) {
            thumbnailsContainer.classList.remove('hidden');
            currentProject.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.url;
                thumb.className = `size-18 sm:size-24 object-cover rounded cursor-pointer border-2 transition-all ${index === 0 ? 'border-black' : 'border-gray-300 opacity-60 hover:opacity-100'}`;
                thumb.onclick = () => {
                    currentImageIndex = index;
                    updateImage();
                };
                thumbnailsContainer.appendChild(thumb);
            });
        } else {
            thumbnailsContainer.classList.add('hidden');
        }
    }
    
    // Display specs
    const specsContainer = document.getElementById('specs');
    if (specsContainer) {
        specsContainer.innerHTML = '';
        Object.entries(currentProject.specs).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'flex justify-between';
            specItem.innerHTML = `
                <span class="text-xs sm:text-sm font-medium text-gray-600">${key}:</span>
                <span class="text-xs sm:text-sm font-bold">${value}</span>
            `;
            specsContainer.appendChild(specItem);
        });
    }
    
    // Display software
    const softwareContainer = document.getElementById('software');
    if (softwareContainer) {
        softwareContainer.innerHTML = '';
        currentProject.software.forEach(sw => {
            const badge = document.createElement('span');
            badge.className = 'px-3 py-1 bg-black text-white text-[10px] sm:text-xs font-medium rounded';
            badge.textContent = sw;
            softwareContainer.appendChild(badge);
        });
    }
    
    // Display description
    const descriptionContainer = document.getElementById('description');
    if (descriptionContainer) {
        descriptionContainer.innerHTML = `<p>${currentProject.description}</p>`;
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function updateImage() {
    if (!currentProject) return;
    
    const img = currentProject.images[currentImageIndex];
    const mainImage = document.getElementById('mainImage');
    const imageCaption = document.getElementById('imageCaption');
    
    if (mainImage) mainImage.src = img.url;
    if (imageCaption) imageCaption.textContent = img.caption;
    
    // Update thumbnail borders
    const thumbnails = document.querySelectorAll('#thumbnails img');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.remove('border-gray-300', 'opacity-60');
            thumb.classList.add('border-black', 'opacity-100');
        } else {
            thumb.classList.remove('border-black', 'opacity-100');
            thumb.classList.add('border-gray-300', 'opacity-60');
        }
    });
}

function changeImage(direction) {
    if (!currentProject) return;
    
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = currentProject.images.length - 1;
    if (currentImageIndex >= currentProject.images.length) currentImageIndex = 0;
    updateImage();
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Close modal on backdrop click
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') closeModal();
        });
    }

    // Initialize filter functionality if on projects page
    initializeFilters();
});

// Filter functionality (only used on projects.html)
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');
    
    // Exit if filter elements don't exist (we're on home.html)
    if (filterTabs.length === 0 || projectCards.length === 0) return;
    
    let activeCategory = 'all';
    let activeLocation = 'all';

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');
            const filterType = this.getAttribute('data-type');

            if (filterType === 'category') {
                activeCategory = filterValue;
                // Reset all category buttons
                document.querySelectorAll('[data-type="category"]').forEach(t => {
                    t.classList.remove('bg-black', 'text-white', 'ring-black');
                    t.classList.add('ring-border');
                });
            } else {
                activeLocation = filterValue;
                // Reset all location buttons
                document.querySelectorAll('[data-type="location"]').forEach(t => {
                    t.classList.remove('bg-black', 'text-white', 'ring-black');
                    t.classList.add('ring-border');
                });
            }

            // Activate clicked button
            this.classList.remove('ring-border');
            this.classList.add('bg-black', 'text-white', 'ring-black');

            filterProjects();
        });
    });

    function filterProjects() {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLocation = card.getAttribute('data-location');

            const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
            const locationMatch = activeLocation === 'all' || cardLocation === activeLocation;

            if (categoryMatch && locationMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    }
}