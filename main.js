document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Theme Switcher
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        body.classList.remove('light-theme');
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
        lucide.createIcons();
        ScrollTrigger.refresh();
    });

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const xTo = gsap.quickTo(cursor, "x", {duration: 0.1, ease: "power3"});
    const yTo = gsap.quickTo(cursor, "y", {duration: 0.1, ease: "power3"});

    window.addEventListener("mousemove", e => {
        xTo(e.clientX - 15);
        yTo(e.clientY - 15);
    });

    document.querySelectorAll('a, button, .service-card, .carousel-controls button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 3. Video Background Toggle
    const video = document.querySelector('.hero-video');
    const heroImg = document.querySelector('.hero-bg img');
    const videoToggle = document.getElementById('videoToggle');
    let isVideoActive = false;

    if (video && videoToggle) {
        videoToggle.addEventListener('click', () => {
            isVideoActive = !isVideoActive;
            if (isVideoActive) {
                video.classList.add('active');
                heroImg.classList.add('video-active');
                video.play();
                videoToggle.innerHTML = '<i data-lucide="pause"></i> Pausar';
            } else {
                video.classList.remove('active');
                heroImg.classList.remove('video-active');
                video.pause();
                videoToggle.innerHTML = '<i data-lucide="play"></i> Ver experiencia';
            }
            lucide.createIcons();
        });
    }

    // 4. Fullscreen Menu
    const menuToggle = document.getElementById('menuToggle');
    const fsMenu = document.getElementById('fsMenu');
    let isMenuOpen = false;

    const menuTl = gsap.timeline({ paused: true });

    menuTl.set(fsMenu, { display: 'block' })
    .to(fsMenu, {
        visibility: 'visible',
        duration: 0
    })
    .to('.fs-menu-bg', {
        height: '100%',
        duration: 0.8,
        ease: 'expo.inOut'
    })
    .to('.fs-menu-content', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.3')
    .from('.menu-item', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
    }, '-=0.4');

    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active');

        if (isMenuOpen) {
            menuTl.play();
            document.body.style.overflow = 'hidden';
        } else {
            menuTl.reverse().then(() => {
                gsap.set(fsMenu, { display: 'none' });
            });
            document.body.style.overflow = 'auto';
        }
    });

    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            menuTl.reverse().then(() => {
                gsap.set(fsMenu, { display: 'none' });
            });
            document.body.style.overflow = 'auto';
        });
    });

    // 5. Hero Animations
    const heroTl = gsap.timeline();

    heroTl.from('#heroImg', {
        scale: 1.5,
        duration: 2.5,
        ease: 'expo.out'
    })
    .from('.split-text', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out'
    }, '-=1.8')
    .from('.reveal-studio', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
    }, '-=1.2');

    // 6. Parallax Mouse Effect
    document.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.parallax-bg img', {
            x: xPercent,
            y: yPercent,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // 7. 3D Carousel
    const carouselCards = gsap.utils.toArray('.carousel-card');
    let currentIndex = 0;
    const radius = 800;
    const angleStep = 360 / carouselCards.length;

    function updateCarousel() {
        carouselCards.forEach((card, index) => {
            const angle = (index - currentIndex) * angleStep;
            const rad = angle * (Math.PI / 180);

            const z = Math.cos(rad) * radius - radius;
            const x = Math.sin(rad) * radius;
            const opacity = Math.max(0.2, (z + radius) / radius);

            gsap.to(card, {
                x: x,
                z: z,
                rotationY: angle,
                opacity: opacity,
                duration: 1,
                ease: 'power3.out',
                zIndex: Math.round(z) + radius
            });

            card.classList.toggle('active', index === currentIndex);
        });
    }

    updateCarousel();

    document.getElementById('nextBtn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carouselCards.length;
        updateCarousel();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carouselCards.length) % carouselCards.length;
        updateCarousel();
    });

    // Auto-rotate carousel
    let autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % carouselCards.length;
        updateCarousel();
    }, 5000);

    document.querySelector('.carousel-3d-wrapper').addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    document.querySelector('.carousel-3d-wrapper').addEventListener('mouseleave', () => {
        autoRotate = setInterval(() => {
            currentIndex = (currentIndex + 1) % carouselCards.length;
            updateCarousel();
        }, 5000);
    });

    // 8. ScrollTrigger Reveals
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.from(elem, {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    gsap.from('.reveal-image img', {
        scale: 1.4,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.reveal-image',
            start: 'top 80%',
        }
    });

    // 9. Stat Counter Animation - FP Style
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                stat.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }

            setTimeout(() => {
                requestAnimationFrame(updateCounter);
            }, 300);
        });
    }

    if (statNumbers.length > 0) {
        ScrollTrigger.create({
            trigger: '.stats-section',
            start: 'top 80%',
            once: true,
            onEnter: animateStats
        });
    }

    // 10. Time Update
    function updateTime() {
        const timeSpan = document.getElementById('localTime');
        if (timeSpan) {
            const now = new Date();
            timeSpan.innerText = now.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    // 11. Header Shrink on Scroll
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => gsap.to('.header', {
            padding: '1rem 0',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            duration: 0.3
        }),
        onLeaveBack: () => gsap.to('.header', {
            padding: '1.5rem 0',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(8px)',
            duration: 0.3
        }),
    });

    // 12. Service Cards stagger reveal
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // 13. Newsletter form handler
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value) {
                const btn = newsletterForm.querySelector('button');
                const original = btn.textContent;
                btn.textContent = '¡Gracias!';
                input.value = '';
                setTimeout(() => { btn.textContent = original; }, 3000);
            }
        });
    }
});
