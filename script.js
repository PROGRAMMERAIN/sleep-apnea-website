document.addEventListener('DOMContentLoaded', () => {
    const langFrBtn = document.getElementById('lang-fr-btn');
    const langArBtn = document.getElementById('lang-ar-btn');
    const htmlTag = document.documentElement;
    const navLinks = document.querySelectorAll('header nav ul li a');

    // Function to set the language
    function setLanguage(lang) {
        htmlTag.setAttribute('lang', lang);
        htmlTag.setAttribute('data-lang', lang); // For CSS targeting

        // Hide all language-specific elements
        document.querySelectorAll('.lang-fr, .lang-ar').forEach(el => {
            el.style.display = 'none';
        });

        // Show elements for the selected language
        document.querySelectorAll(`.lang-${lang}`).forEach(el => {
            // Default display style; can be overridden below
            let displayStyle = 'inline';

            // Determine appropriate display style based on element type or class
            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'SECTION', 'LI', 'UL', 'NAV', 'HEADER', 'FOOTER', 'MAIN', 'ARTICLE', 'ASIDE'].includes(el.tagName)) {
                displayStyle = 'block';
            }
            if (el.classList.contains('symptom-item') || el.classList.contains('cta-button') || el.classList.contains('learn-more-button') || el.classList.contains('address-text')) {
                 displayStyle = 'inline-block';
            }
             if (el.closest && el.closest('.symptoms-grid')) { // For direct children of grid
                displayStyle = 'block';
            }
            if (el.closest && el.closest('.logo')) {
                displayStyle = 'inline';
            }


            el.style.display = displayStyle;
        });

        // Special handling for list items within ULs to ensure they are block/list-item
         document.querySelectorAll(`ul.tech-list li.lang-${lang}, .intro-section ul li.lang-${lang}`).forEach(el => {
            el.style.display = 'list-item'; // Or 'block' if list-style-type is handled by CSS
        });


        // Store preference
        localStorage.setItem('preferredLang', lang);
        updateActiveNavLinks();
    }

    // Update active state for nav links based on current language
    function updateActiveNavLinks() {
        const currentLang = htmlTag.getAttribute('data-lang');
        navLinks.forEach(link => {
            if (link.classList.contains(`lang-${currentLang}`)) {
                // This part is more for visual cues on the nav items themselves
                // The actual showing/hiding is done by the general .lang-xx selectors
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
    const preferredLang = localStorage.getItem('preferredLang') || 'fr';
    setLanguage(preferredLang);

    // Update copyright year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});