document.addEventListener("DOMContentLoaded", function () {
    // ---------- GLOBAL ASSET PRELOADER ----------
    const preloader = document.getElementById("preloader");
    const loadingBar = document.getElementById("loading-bar");
    const loadingPct = document.getElementById("loading-percentage");

    if (preloader && loadingBar && loadingPct) {
        document.body.style.overflow = "hidden"; // Prevent scrolling while loading

        const imgLoad = imagesLoaded(document.body);
        const totalImages = imgLoad.images.length;
        let loadedCount = 0;

        const finishLoading = () => {
            loadingBar.style.width = "100%";
            loadingPct.innerText = "100%";

            setTimeout(() => {
                const meteorAnim = document.querySelector(".meteor-anim");
                if (meteorAnim) {
                    meteorAnim.classList.add("meteor-fly-away");
                }

                // Wait for the fly-away animation to almost finish before fading
                setTimeout(() => {
                    preloader.classList.add("preloader-hidden");
                    document.body.style.overflow = ""; // Restore scrolling logic safely
                }, 700);
            }, 600); // Brief hang at 100% start so progress isn't jolted
        };

        if (totalImages === 0) {
            finishLoading();
        } else {
            imgLoad.on('progress', function (instance, image) {
                loadedCount++;
                const p = Math.floor((loadedCount / totalImages) * 100);
                loadingBar.style.width = p + "%";
                loadingPct.innerText = p + "%";
            });

            imgLoad.on('always', finishLoading);

            // Fallback in case imagesLoaded stalls on a dead link
            setTimeout(finishLoading, 8000);
        }
    }

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

    // ---------- RANDOM PORTFOLIO IMAGES ----------
    const randomThumbnails = document.querySelectorAll('.random-thumbnail');
    randomThumbnails.forEach(img => {
        const folder = img.closest('.portfolio-item-inner').getAttribute('data-gallery-folder');
        const count = parseInt(img.closest('.portfolio-item-inner').getAttribute('data-gallery-count'), 10);
        if (folder && count) {
            const randomNum = Math.floor(Math.random() * count) + 1;
            const formattedNum = randomNum.toString().padStart(2, '0');
            img.src = `images/albums/${folder}/${folder} ${formattedNum}.jpeg`;
        }
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
    const galleryPrevBtn = document.getElementById("gallery-prev");
    const galleryNextBtn = document.getElementById("gallery-next");
    const lightboxThumbnails = document.getElementById("lightbox-thumbnails");

    let currentGalleryFolder = "";
    let currentGalleryCount = 0;
    let currentGalleryIndex = 1;

    const updateGalleryImage = () => {
        const formattedNum = currentGalleryIndex.toString().padStart(2, '0');
        lightboxImg.src = `images/albums/${currentGalleryFolder}/${currentGalleryFolder} ${formattedNum}.jpeg`;
        
        if (lightboxThumbnails) {
            const thumbs = lightboxThumbnails.querySelectorAll('.lightbox-thumbnail');
            thumbs.forEach((thumb, idx) => {
                if (idx + 1 === currentGalleryIndex) {
                    thumb.classList.add('active');
                    // Scroll active thumbnail into horizontal view nicely
                    thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                } else {
                    thumb.classList.remove('active');
                }
            });
        }
    };

    if (galleryPrevBtn && galleryNextBtn) {
        galleryPrevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentGalleryIndex = currentGalleryIndex > 1 ? currentGalleryIndex - 1 : currentGalleryCount;
            updateGalleryImage();
        });
        galleryNextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentGalleryIndex = currentGalleryIndex < currentGalleryCount ? currentGalleryIndex + 1 : 1;
            updateGalleryImage();
        });
    }

    if (portfolioItems.length > 0 && lightbox) {
        portfolioItems.forEach(item => {
            item.addEventListener("click", () => {
                const img = item.querySelector("img").src;
                const title = item.querySelector("h3").innerText;
                const category = item.querySelector("p").innerText;
                const descElem = item.querySelector(".portfolio-desc");
                const description = descElem ? descElem.innerText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
                const videoId = item.getAttribute("data-video-id");
                const galleryFolder = item.getAttribute("data-gallery-folder");
                const galleryCount = parseInt(item.getAttribute("data-gallery-count") || "0", 10);

                const lightboxVideo = document.getElementById("lightbox-video");
                const lightboxDesc = document.getElementById("lightbox-description");

                lightboxTitle.innerText = title;
                lightboxCategory.innerText = category;
                lightboxDesc.innerText = description;

                if (videoId) {
                    lightboxImg.style.display = "none";
                    lightboxVideo.style.display = "block";
                    lightboxVideo.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`;
                    if (galleryPrevBtn) galleryPrevBtn.style.display = "none";
                    if (galleryNextBtn) galleryNextBtn.style.display = "none";
                } else if (galleryFolder && galleryCount > 0) {
                    if (lightboxVideo) {
                        lightboxVideo.style.display = "none";
                        lightboxVideo.src = "";
                    }
                    lightboxImg.style.display = "block";
                    lightboxImg.src = img;
                    
                    currentGalleryFolder = galleryFolder;
                    currentGalleryCount = galleryCount;
                    
                    const match = img.match(/(\d+)\.jpeg$/);
                    currentGalleryIndex = match ? parseInt(match[1], 10) : 1;
                    
                    if (lightboxThumbnails) {
                        lightboxThumbnails.innerHTML = '';
                        lightboxThumbnails.style.display = 'flex';
                        for (let i = 1; i <= currentGalleryCount; i++) {
                            const formatted = i.toString().padStart(2, '0');
                            const thumbSrc = `images/albums/${currentGalleryFolder}/${currentGalleryFolder} ${formatted}.jpeg`;
                            const imgElem = document.createElement("img");
                            imgElem.src = thumbSrc;
                            imgElem.className = "lightbox-thumbnail";
                            if (i === currentGalleryIndex) {
                                imgElem.classList.add("active");
                                // We ensure it scrolls into view after UI renders
                                setTimeout(() => {
                                    imgElem.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
                                }, 10);
                            }
                            imgElem.addEventListener("click", (e) => {
                                e.stopPropagation();
                                currentGalleryIndex = i;
                                updateGalleryImage();
                            });
                            lightboxThumbnails.appendChild(imgElem);
                        }
                    }

                    if (galleryPrevBtn) galleryPrevBtn.style.display = "block";
                    if (galleryNextBtn) galleryNextBtn.style.display = "block";
                } else {
                    if (lightboxVideo) {
                        lightboxVideo.style.display = "none";
                        lightboxVideo.src = "";
                    }
                    lightboxImg.style.display = "block";
                    lightboxImg.src = img;
                    if (lightboxThumbnails) lightboxThumbnails.style.display = "none";
                    if (galleryPrevBtn) galleryPrevBtn.style.display = "none";
                    if (galleryNextBtn) galleryNextBtn.style.display = "none";
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

    // ---------- ABOUT IMAGES LIGHTBOX ----------
    const aboutImages = document.querySelectorAll(".about-img-left, .about-img-right");
    if (aboutImages.length > 0 && lightbox) {
        aboutImages.forEach(imgElement => {
            imgElement.addEventListener("click", () => {
                const imgInfoWrap = document.querySelector(".lightbox-info");
                if (imgInfoWrap) imgInfoWrap.style.display = "none"; // Hide info text for raw images

                lightboxImg.style.display = "block";
                lightboxImg.src = imgElement.src;

                const lightboxVideo = document.getElementById("lightbox-video");
                if (lightboxVideo) {
                    lightboxVideo.style.display = "none";
                    lightboxVideo.src = "";
                }

                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });
    }

    // Restore info display when launching portfolio items
    if (portfolioItems.length > 0 && lightbox) {
        portfolioItems.forEach(item => {
            item.addEventListener("click", () => {
                const imgInfoWrap = document.querySelector(".lightbox-info");
                if (imgInfoWrap) imgInfoWrap.style.display = "block"; // Always ensure it's visible for portfolio
            });
        });
    }

    // ---------- INDIVIDUAL SKILLS PROGRESS BAR ANIMATION ----------
    const skillItems = document.querySelectorAll(".skill-item");

    if (skillItems.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillItem = entry.target;
                    const bar = skillItem.querySelector(".progress-bar");

                    if (bar) {
                        const targetWidth = bar.getAttribute("data-progress");
                        bar.style.width = targetWidth; // Triggers CSS transition
                    }

                    observer.unobserve(skillItem); // Only animate once
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of the individual item is visible

        skillItems.forEach(item => {
            skillsObserver.observe(item);
        });
    }

    // ---------- GLOWING ORBS BACKGROUND ----------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let orbs = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        class Orb {
            constructor() {
                // Mix of small stars and larger planets
                this.radius = Math.random() * 60 + 5;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Very slow drift
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;

                // Theme colors: Pink, middle purple/blue, Cyan
                const colors = [
                    { r: 176, g: 78, b: 157 },
                    { r: 57, g: 197, b: 237 },
                    { r: 117, g: 136, b: 196 }
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.4 + 0.1; // Subtle transparency so it isn't distracting
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Seamless screen wrapping
                if (this.x < -this.radius) this.x = width + this.radius;
                else if (this.x > width + this.radius) this.x = -this.radius;

                if (this.y < -this.radius) this.y = height + this.radius;
                else if (this.y > height + this.radius) this.y = -this.radius;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

                // Draw as a glowing radial gradient
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );

                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        const initOrbs = () => {
            orbs = [];
            // Responsive number of orbs based on available screen space
            const numOrbs = Math.floor((width * height) / 35000);
            for (let i = 0; i < numOrbs; i++) {
                orbs.push(new Orb());
            }
        };

        initOrbs();
        // Re-initialize softly on screen rotation/resize
        window.addEventListener('resize', initOrbs);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            orbs.forEach(orb => {
                orb.update();
                orb.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();
    }
});
