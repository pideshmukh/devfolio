// Typed.js initialization for auto-typing effect
var typed = new Typed('.auto-type', {
    strings: ['Developer', 'CS Grad', 'Innovator'],
    typeSpeed: 40,
    backSpeed: 40,
    smartBackspace: true,
    showCursor: false,
    loop: true
});

// --- Additional JavaScript that would likely be in the original script.js ---
// This section is based on common patterns for elements like the navbar and drawer.
// You will need to fill in the actual logic if it was in the original script.js file.

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const openDrawerBtn = document.querySelector('.open-drawer-btn');
    const drawer = document.querySelector('.drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const dragHandle = document.querySelector('.drag-handle');
    const emailTextElement = document.getElementById('email-text');
    const copyIcon = document.getElementById('copy-icon');
    const contactForm = document.getElementById('form');
    const resultDiv = document.getElementById('result');

    // --- Navbar Toggle for Mobile ---
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            // Close mobile nav after clicking a link
            navLinks.classList.remove('open');

            // Remove active class from all links
            navLinkItems.forEach(item => item.classList.remove('active'));
            // Add active class to the clicked link
            link.classList.add('active');
        });
    });

    // --- Drawer (Bottom Sheet) Functionality ---
    function openDrawer() {
        drawer.classList.add('open');
        drawerOverlay.classList.add('show');
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('show');
    }

    openDrawerBtn.addEventListener('click', openDrawer);
    drawerOverlay.addEventListener('click', closeDrawer); // Close when clicking overlay

    // Basic drag functionality for the drawer (for demonstration, can be more robust)
    let isDragging = false;
    let startY;
    let startBottom;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startBottom = parseFloat(getComputedStyle(drawer).bottom);
        drawer.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        let newBottom = startBottom - deltaY;

        // Prevent dragging above the bottom of the screen (or a maximum height)
        if (newBottom < 0) newBottom = 0;
        // Optionally, set a max height for the drawer if it should not go full screen
        // if (newBottom > window.innerHeight * 0.8) newBottom = window.innerHeight * 0.8;

        drawer.style.bottom = `${newBottom}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            drawer.style.transition = 'bottom 0.3s ease'; // Re-enable transition

            // If dragged down far enough, close the drawer
            const currentBottom = parseFloat(getComputedStyle(drawer).bottom);
            if (currentBottom < 50) { // If less than 50px from bottom, close it
                closeDrawer();
            } else {
                drawer.classList.add('open'); // Snap back open if not closed
            }
        }
    });

    // Handle touch events for dragging on mobile
    dragHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        startBottom = parseFloat(getComputedStyle(drawer).bottom);
        drawer.style.transition = 'none';
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaY = e.touches[0].clientY - startY;
        let newBottom = startBottom - deltaY;

        if (newBottom < 0) newBottom = 0;
        drawer.style.bottom = `${newBottom}px`;
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            drawer.style.transition = 'bottom 0.3s ease';
            const currentBottom = parseFloat(getComputedStyle(drawer).bottom);
            if (currentBottom < 50) {
                closeDrawer();
            } else {
                drawer.classList.add('open');
            }
        }
    });


    // --- Copy Email Functionality ---
    if (emailTextElement && copyIcon) {
        emailTextElement.addEventListener('click', async () => {
            const emailAddress = emailTextElement.querySelector('a').innerText;
            try {
                await navigator.clipboard.writeText(emailAddress);
                copyIcon.classList.remove('ti-copy');
                copyIcon.classList.add('ti-check');
                setTimeout(() => {
                    copyIcon.classList.remove('ti-check');
                    copyIcon.classList.add('ti-copy');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    }

    // --- Contact Form Submission (using formspree/web3forms style endpoint) ---
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: json
                });
                const responseData = await response.json();
                if (response.status === 200) {
                    resultDiv.innerHTML = "Message sent successfully!";
                    contactForm.reset();
                    setTimeout(() => {
                        resultDiv.innerHTML = "";
                        closeDrawer(); // Close drawer after successful submission
                    }, 3000);
                } else {
                    console.log(response);
                    resultDiv.innerHTML = responseData.message || "Something went wrong!";
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                resultDiv.innerHTML = "Error sending message. Please try again later.";
            }
        });
    }
    
    // --- Active Navbar Link on Scroll (Example, requires more robust logic for full page sections) ---
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - navbar.clientHeight - 50) { // Adjust offset as needed
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });
});
