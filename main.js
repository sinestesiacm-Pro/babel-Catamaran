// BABEL - STUDIO LEVEL JS
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX - 15,
            y: e.clientY - 15,
            duration: 0.2,
            ease: 'power2.out'
        });
    });

    // 2. Fullscreen Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const fsMenu = document.getElementById('fsMenu');
    let isMenuOpen = false;

    const menuTl = gsap.timeline({ paused: true });
    
    // Define menu animation
    menuTl.set(fsMenu, { display: 'block' }) // Force display block
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
        clearProps: 'all' // Ensure no stuck opacity issues
    }, '-=0.4');
    
    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active');
        
        if (isMenuOpen) {
            menuTl.play();
            document.body.style.overflow = 'hidden';
        } else {
            menuTl.reverse().then(() => {
                gsap.set(fsMenu, { display: 'none' }); // Clean up after reverse
            });
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu on link click
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

    // 3. Hero Animations (Studio Level)
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

    // 4. Parallax Mouse Effect (Subtle)
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

    // 5. 3D Carousel Logic
    const carouselCards = gsap.utils.toArray('.carousel-card');
    let currentIndex = 0;
    const radius = 600; // Radius of 3D cylinder
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
                zIndex: Math.round(z)
            });
            
            card.classList.toggle('active', index === currentIndex);
        });
    }

    // Initial position
    updateCarousel();

    document.getElementById('nextBtn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carouselCards.length;
        updateCarousel();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carouselCards.length) % carouselCards.length;
        updateCarousel();
    });

    // 6. ScrollTrigger reveals
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.from(elem, {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Visual Mask Image reveal
    gsap.from('.reveal-image img', {
        scale: 1.4,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.reveal-image',
            start: 'top 80%',
        }
    });

    // 7. Time Update
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

    // 8. Header Shrink on Scroll
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => gsap.to('.header', { padding: '1.5rem 0', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', duration: 0.3 }),
        onLeaveBack: () => gsap.to('.header', { padding: '2.5rem 0', background: 'transparent', backdropFilter: 'blur(0px)', duration: 0.3 }),
    });
});
