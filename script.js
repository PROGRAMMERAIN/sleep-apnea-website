document.addEventListener('DOMContentLoaded', () => {
    const langFrBtn = document.getElementById('lang-fr-btn');
    const langArBtn = document.getElementById('lang-ar-btn');
    const htmlTag = document.documentElement;
    const navLinks = document.querySelectorAll('header nav ul li a'); // Used for active state, not critical for lang switch

    // Function to set the language
    function setLanguage(lang) {
        htmlTag.setAttribute('lang', lang);
        htmlTag.setAttribute('data-lang', lang); // For CSS targeting

        // Hide all language-specific elements first
        document.querySelectorAll('.lang-fr, .lang-ar').forEach(el => {
            el.style.display = 'none';
        });

        // Show elements for the selected language
        document.querySelectorAll(`.lang-${lang}`).forEach(el => {
            // Determine appropriate display style based on element type, classes, or parent
            let displayStyle = 'inline'; // Default for span, a, strong etc.

            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'SECTION', 'ARTICLE', 'ASIDE', 'FOOTER', 'HEADER', 'MAIN', 'NAV', 'UL'].includes(el.tagName)) {
                displayStyle = 'block';
            } else if (el.tagName === 'LI') {
                // Check parent context for LI
                if (el.closest && (el.closest('ul.tech-list') || el.closest('.intro-section ul') || el.closest('.expertise-list') || el.closest('.symptoms-list') || el.closest('.consequences-list'))) {
                    displayStyle = 'list-item'; // Or 'flex' if li itself is a flex container
                     if (el.classList.contains('lang-fr') || el.classList.contains('lang-ar')) { // If the li itself has lang class
                        // if its children are also lang specific, they'll be handled recursively.
                        // if the li's display needs to be flex to arrange its internal items:
                        if (getComputedStyle(el).display === 'flex' && !el.style.display) { // preserve original flex if set by CSS
                             displayStyle = 'flex';
                        } else {
                             displayStyle = 'list-item'; // Default for li
                        }
                    }
                } else if (el.closest && el.closest('header nav ul')) {
                     displayStyle = 'inline-block'; // Or default if CSS handles it
                } else {
                    displayStyle = 'list-item'; // Default for other LIs
                }
            } else if (el.classList.contains('symptom-item') || el.classList.contains('cta-button') || el.classList.contains('learn-more-button') || el.classList.contains('address-text') || el.classList.contains('feature-item')) {
                 displayStyle = 'inline-block'; // Or 'block' or 'flex' depending on CSS
                 // Re-check based on CSS:
                 if(el.classList.contains('symptom-item') && getComputedStyle(el).display === 'block' && !el.style.display) displayStyle = 'block';
                 if(el.classList.contains('feature-item') && getComputedStyle(el).display === 'block' && !el.style.display) displayStyle = 'block';


            } else if (el.closest && el.closest('.symptoms-grid')) { // For direct children of grid that need to be block
                displayStyle = 'block';
            } else if (el.closest && el.closest('.logo a')) { // For spans inside the logo link
                displayStyle = 'inline';
            }


            el.style.display = displayStyle;
        });
        
        // Special handling for list items that are direct children of ULs with language classes
        // This ensures that if a UL itself is toggled, its LI children (if also lang-specific) are correctly shown.
        // The above logic for LI generally covers this, but this is an extra check.
        document.querySelectorAll(`ul.lang-${lang} > li, ul > li.lang-${lang}`).forEach(li => {
            if (getComputedStyle(li).display === 'none' || !li.style.display) { // if it was hidden or no inline style
                 if (li.closest && (li.closest('ul.tech-list') || li.closest('.intro-section ul') || li.closest('.expertise-list') || li.closest('.symptoms-list') || li.closest('.consequences-list'))) {
                    li.style.display = 'list-item'; // or 'flex' if they are flex containers
                    if (getComputedStyle(li).display === 'flex' && !li.style.display.includes('flex')) { // preserve original flex
                         li.style.display = 'flex';
                    } else {
                         li.style.display = 'list-item';
                    }
                 } else {
                    li.style.display = 'list-item'; // Default for other LIs
                 }
            }
        });


        // Store preference
        localStorage.setItem('preferredLang', lang);
        updateActiveNavLinks(lang); // Pass current language
    }

    // Update active state for nav links based on current language
    function updateActiveNavLinks(currentLang) {
        const currentPath = window.location.pathname.split("/").pop(); // Get current file name e.g., index.html

        navLinks.forEach(link => {
            const linkLangClass = Array.from(link.classList).find(cls => cls.startsWith('lang-'));
            const linkPath = link.getAttribute('href').split("/").pop();

            if (linkLangClass === `lang-${currentLang}`) {
                link.style.display = ''; // Show the link for the current language
                if (linkPath === currentPath && link.classList.contains('active')) {
                    // Already marked active in HTML, ensure it's visible
                } else if (linkPath === currentPath) {
                    // link.classList.add('active'); // Dynamically add active if not set - this is more complex with static HTML active states
                } else {
                    // link.classList.remove('active');
                }
            } else {
                link.style.display = 'none'; // Hide the link not matching current language
            }
        });
    }


    // Event listeners for language buttons
    if (langFrBtn) {
        langFrBtn.addEventListener('click', () => setLanguage('fr'));
    }
    if (langArBtn) {
        langArBtn.addEventListener('click', () => setLanguage('ar'));
    }

    // Check for stored language preference or default to French
    const preferredLang = localStorage.getItem('preferredLang') || htmlTag.getAttribute('lang') || 'fr';
    setLanguage(preferredLang);

    // Update copyright year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
