import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, Instagram, Facebook, ChevronLeft, ChevronRight, Music, Anchor, Wine, ArrowRight } from 'lucide';

gsap.registerPlugin(ScrollTrigger);

// BABEL - STUDIO LEVEL JS
// No longer need DOMContentLoaded as this is a module


    // 0. Loader Animation
    const loaderTl = gsap.timeline();
    
    loaderTl.to('.loader-bar', {
        width: '100%',
        duration: 2,
        ease: 'power4.inOut'
    })
    .to('.loader-logo', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
    })
    .to('.loader-progress', {
        scaleX: 0,
        duration: 0.5,
        ease: 'power2.in'
    }, '-=0.3')
    .to('.loader', {
        height: 0,
        duration: 1,
        ease: 'expo.inOut'
    })
    .from('.header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
    }, '-=0.5')
    .call(() => {
        initHero(); // Start hero animations only after loader is done
    });

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

    // Hover effect for links
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.5, background: 'rgba(229, 195, 166, 0.2)', border: 'none' }));
        el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, background: 'transparent', border: '1px solid var(--accent)' }));
    });

    // 2. Fullscreen Menu Toggle
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
        clearProps: 'all'
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

    // 3. Hero Animations
    function initHero() {
        const heroTl = gsap.timeline();
        
        heroTl.from('#heroImg', {
            scale: 1.5,
            filter: 'blur(20px)',
            duration: 2.5,
            ease: 'expo.out'
        })
        .from('.split-text', {
            y: 100,
            opacity: 0,
            rotateX: -45,
            stagger: 0.1,
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
    }

    // 4. Parallax Mouse Effect
    document.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 40;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 40;
        
        gsap.to('.parallax-bg img', {
            x: xPercent,
            y: yPercent,
            duration: 1.5,
            ease: 'power2.out'
        });
    });

    // 5. 3D Carousel Logic
    const carouselCards = gsap.utils.toArray('.carousel-card');
    let currentIndex = 0;
    const radius = 700; 
    const angleStep = 360 / carouselCards.length;

    function updateCarousel() {
        carouselCards.forEach((card, index) => {
            const angle = (index - currentIndex) * angleStep;
            const rad = angle * (Math.PI / 180);
            
            const z = Math.cos(rad) * radius - radius;
            const x = Math.sin(rad) * radius;
            const opacity = Math.max(0.1, (z + radius) / radius);
            const scale = Math.max(0.6, (z + radius) / radius);
            
            gsap.to(card, {
                x: x,
                z: z,
                rotationY: angle,
                opacity: opacity,
                scale: scale,
                duration: 1.2,
                ease: 'expo.out',
                zIndex: Math.round(z)
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

    // 6. ScrollTrigger reveals
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.from(elem, {
            y: 100,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 95%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    gsap.from('.visual-mask img', {
        scale: 1.6,
        filter: 'blur(15px)',
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.reveal-image',
            start: 'top 80%',
            scrub: 1
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
        onEnter: () => gsap.to('.header', { padding: '1.5rem 0', background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)', duration: 0.4 }),
        onLeaveBack: () => gsap.to('.header', { padding: '4rem 0', background: 'transparent', backdropFilter: 'blur(0px)', duration: 0.4 }),
    });

    // 9. Initialize Lucide Icons
    createIcons({
        icons: {
            Instagram,
            Facebook,
            ChevronLeft,
            ChevronRight,
            Music,
            Anchor,
            Wine,
            ArrowRight
        }
    });

