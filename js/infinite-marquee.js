// infinite-marquee.js - Updated to import JSON data with original speed logic
document.addEventListener('DOMContentLoaded', function() {
    let marqueeData = {
        projects: [],
        clients: []
    };

    // Function to create marquee items from data
    function createMarqueeItems(containerId, data, isProjects = true) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ''; // Clear any existing content
        
        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'featured-work__marquee-item flex items-center px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 whitespace-nowrap';
            li.setAttribute('role', 'listitem'); // Always add role
            
            if (isProjects && item.icon) {
                // Projects have icons
                li.classList.add('justify-start');
                li.innerHTML = `
                    <i class="fa-solid fa-${item.icon} text-base sm:text-xl mr-2 sm:mr-3" aria-hidden="true"></i>
                    <span class="featured-work__marquee-text text-sm sm:text-lg font-semibold">${item.text}</span>
                `;
            } else {
                // Clients are centered text only
                li.classList.add('justify-center');
                const text = isProjects ? item.text : item;
                li.innerHTML = `
                    <span class="featured-work__marquee-text text-sm sm:text-lg font-semibold">${text}</span>
                `;
            }
            
            container.appendChild(li);
        });
    }
    
    // Function to initialize a marquee - KEEPING ORIGINAL SPEED LOGIC
    function initMarquee(marqueeContent, speed = 40) {
        const content = marqueeContent.querySelector('.featured-work__marquee-list');
        const items = Array.from(content.children);
        
        if (items.length === 0) return; // No items to animate
        
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
        
        // Adjust animation speed based on content length - ORIGINAL LOGIC
        const totalItems = items.length * (duplicatesNeeded + 1);
        const animationDuration = speed * (totalItems / items.length);
        
        // Apply animation duration - ORIGINAL LOGIC
        if (marqueeContent.classList.contains('featured-work__marquee-content--reverse')) {
            marqueeContent.style.animationDuration = `${animationDuration}s`;
        } else {
            marqueeContent.style.animationDuration = `${animationDuration}s`;
        }
        
        // Pause animation on hover - ORIGINAL LOGIC
        marqueeContent.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        marqueeContent.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Handle visibility changes for performance - ORIGINAL LOGIC
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
    
    // Load JSON data and initialize marquees
    async function loadMarqueeData() {
        try {
            // Load the JSON file
            const response = await fetch('../data/marquee-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading marquee data:', error);
            // Fallback data in case JSON fails to load
            return {
                projects: [
                    { icon: 'bridge', text: 'Sydney Gateway Stage 1' },
                    { icon: 'road', text: 'Prospect Highway Upgrade' },
                    { icon: 'building', text: 'ICD-Brookfield Place' }
                ],
                clients: [
                    'John Holland & Seymour Whyte',
                    'Investment Corporation of Dubai',
                    'Macfab Engineering'
                ]
            };
        }
    }
    
    // Initialize all marquees - KEEPING ORIGINAL INIT LOGIC
    async function initializeAllMarquees() {
        // Load data from JSON file
        marqueeData = await loadMarqueeData();
        
        // Create marquee items
        createMarqueeItems('projects-marquee', marqueeData.projects, true);
        createMarqueeItems('clients-marquee', marqueeData.clients, false);
        
        // Wait for fonts and images to load for accurate measurements - ORIGINAL LOGIC
        const marqueeContents = document.querySelectorAll('.featured-work__marquee-content, .featured-work__marquee-content--reverse');
        
        // Slightly different speeds for visual interest - ORIGINAL SPEED VALUES
        marqueeContents.forEach((content, index) => {
            const speed = index === 0 ? 40 : 45;
            setTimeout(() => initMarquee(content, speed), 100);
        });
    }
    
    // Initialize on window load - ORIGINAL LOGIC
    window.addEventListener('load', function() {
        initializeAllMarquees();
    });
    
    // Fallback in case load event already fired - ORIGINAL LOGIC
    if (document.readyState === 'complete') {
        marqueeContents.forEach((content, index) => {
            const speed = index === 0 ? 40 : 45;
            setTimeout(() => initMarquee(content, speed), 100);
        });
    }
    
    // Handle window resize - ORIGINAL LOGIC
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Remove all duplicates and reinitialize - ORIGINAL LOGIC
            const marqueeContents = document.querySelectorAll('.featured-work__marquee-content, .featured-work__marquee-content--reverse');
            marqueeContents.forEach(content => {
                const list = content.querySelector('.featured-work__marquee-list');
                const originalItems = Array.from(list.children).slice(0, marqueeData.projects.length || 6); // Keep only original items
                list.innerHTML = '';
                originalItems.forEach(item => list.appendChild(item));
            });
            
            // Reinitialize with new measurements - ORIGINAL LOGIC
            marqueeContents.forEach((content, index) => {
                const speed = index === 0 ? 40 : 45;
                setTimeout(() => initMarquee(content, speed), 100);
            });
        }, 250);
    });
});