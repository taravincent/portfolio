document.addEventListener("DOMContentLoaded", function () {
    // ---------- HAMBURGER MENU ----------
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links li a");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("toggle");
    });

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                hamburger.classList.remove("toggle");
            }
        });
    });

    // ---------- NAVBAR & ACTIVE SCROLL STATE ----------
    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        let current = "";

        // Sticky glass effect adjustment
        if (window.scrollY > 50) {
            navbar.style.padding = "0.8rem 5%";
            navbar.style.boxShadow = "var(--glass-shadow)";
        } else {
            navbar.style.padding = "1.5rem 5%";
            navbar.style.boxShadow = "none";
        }

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach((a) => {
            a.classList.remove("active");
            if (a.getAttribute("href") === `#${current}`) {
                a.classList.add("active");
            }
        });
    });

    // ---------- ISOTOPE PORTFOLIO FILTERING ----------
    // Initialize Isotope after images are loaded
    const grid = document.querySelector('.grid');

    if (grid && typeof imagesLoaded === 'function' && typeof Isotope === 'function') {
        imagesLoaded(grid, function () {
            const iso = new Isotope(grid, {
                itemSelector: '.element-item',
                layoutMode: 'fitRows',
                stagger: 30, // animation
                transitionDuration: '0.6s',
                hiddenStyle: {
                    opacity: 0,
                    transform: 'scale(0.8)'
                },
                visibleStyle: {
                    opacity: 1,
                    transform: 'scale(1)'
                }
            });

            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-button-group button');
            filterButtons.forEach(button => {
                button.addEventListener('click', function () {
                    // Remove active class from all
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked
                    this.classList.add('active');

                    const filterValue = this.getAttribute('data-filter');
                    iso.arrange({ filter: filterValue });
                });
            });
        });
    } else {
        console.warn("Isotope or ImagesLoaded failed to load. Please check your internet connection.");
    }

    // ---------- PORTFOLIO LIGHTBOX ----------
    const portfolioItems = document.querySelectorAll(".portfolio-item-inner");
    const lightbox = document.getElementById("portfolio-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxCategory = document.getElementById("lightbox-category");
    const lightboxClose = document.querySelector(".close-lightbox");

    if (portfolioItems.length > 0 && lightbox) {
        portfolioItems.forEach(item => {
            item.addEventListener("click", () => {
                const img = item.querySelector("img").src;
                const title = item.querySelector("h3").innerText;
                const category = item.querySelector("p").innerText;
                const descElem = item.querySelector(".portfolio-desc");
                const description = descElem ? descElem.innerText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
                const videoId = item.getAttribute("data-video-id");

                const lightboxVideo = document.getElementById("lightbox-video");
                const lightboxDesc = document.getElementById("lightbox-description");

                lightboxTitle.innerText = title;
                lightboxCategory.innerText = category;
                lightboxDesc.innerText = description;

                if (videoId) {
                    lightboxImg.style.display = "none";
                    lightboxVideo.style.display = "block";
                    lightboxVideo.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`;
                } else {
                    if (lightboxVideo) {
                        lightboxVideo.style.display = "none";
                        lightboxVideo.src = "";
                    }
                    lightboxImg.style.display = "block";
                    lightboxImg.src = img;
                }

                lightbox.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
            const lightboxVideo = document.getElementById("lightbox-video");
            if (lightboxVideo) lightboxVideo.src = ""; // Stops playback
        };

        lightboxClose.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    // ---------- BACK TO TOP ----------
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // ---------- GLITCH TEXT EFFECT ----------
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                glitchText.style.transform = `translate(0, 0)`;
            }, 50);
        }, 3000); // Glitch every 3 seconds randomly
    }

    // ---------- SKILLS PROGRESS BAR ANIMATION ----------
    const skillsSection = document.getElementById("skills");
    const progressBars = document.querySelectorAll(".progress-bar");

    if (skillsSection && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute("data-progress");
                        bar.style.width = targetWidth; // Triggers CSS transition
                    });
                    skillsObserver.unobserve(skillsSection); // Only animate once
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% visible

        skillsObserver.observe(skillsSection);
    }
});
