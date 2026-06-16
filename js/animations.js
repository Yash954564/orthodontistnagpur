/* ==========================================================================
   ANIMATIONS.JS - GSAP ScrollTrigger Animations & 3D Parallax Scrolling
   ========================================================================== */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. STATS COUNTER ANIMATION
    const counters = document.querySelectorAll('.counter-value');
    
    function animateCounter(counter) {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = progress * (2 - progress);
        const currentVal = Math.floor(easedProgress * target);
        
        counter.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
    }

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            counters.forEach(counter => animateCounter(counter));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(statsSection);
    }

    // 2. GSAP SCROLLTRIGGER ANIMATIONS
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Tell three-scene.js that GSAP will override tooth animation coordinates
      window.gsapOverrideActive = true;

      // Ensure tooth group is loaded before adding scroll bindings
      const checkToothLoaded = setInterval(() => {
        if (window.toothScene && window.toothScene.toothGroup) {
          clearInterval(checkToothLoaded);
          setupToothScrollAnimations();
        }
      }, 100);

      function setupToothScrollAnimations() {
        const tooth = window.toothScene.toothGroup;

        // Base animation timeline for 3D tooth coordinates
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        });

        // Set initial state
        gsap.set(tooth.position, { x: 6, y: 0, z: -4 });
        gsap.set(tooth.rotation, { x: 0, y: 0, z: 0 });

        // Scroll step 1: Hero -> Why Choose Us
        tl.to(tooth.position, { x: -6, y: -1, z: -5, duration: 1 })
          .to(tooth.rotation, { x: 0.5, y: Math.PI * 1.5, z: 0.2, duration: 1 }, 0)

        // Scroll step 2: Why Choose Us -> Treatments
          .to(tooth.position, { x: 6, y: 2, z: -8, duration: 1 })
          .to(tooth.rotation, { x: -0.2, y: Math.PI * 3.0, z: -0.1, duration: 1 }, 1)

        // Scroll step 3: Treatments -> Before/After
          .to(tooth.position, { x: 0, y: -4, z: -10, duration: 1 })
          .to(tooth.rotation, { x: 0.4, y: Math.PI * 4.5, z: 0.3, duration: 1 }, 2)

        // Scroll step 4: Before/After -> Process
          .to(tooth.position, { x: -7, y: 0, z: -6, duration: 1 })
          .to(tooth.rotation, { x: -0.1, y: Math.PI * 6.0, z: -0.2, duration: 1 }, 3)

        // Scroll step 5: Process -> Doctor
          .to(tooth.position, { x: 5, y: 1, z: -5, duration: 1 })
          .to(tooth.rotation, { x: 0.3, y: Math.PI * 7.5, z: 0.1, duration: 1 }, 4)

        // Scroll step 6: Doctor -> Testimonials
          .to(tooth.position, { x: -5, y: -2, z: -8, duration: 1 })
          .to(tooth.rotation, { x: -0.2, y: Math.PI * 9.0, z: 0.2, duration: 1 }, 5)

        // Scroll step 7: Testimonials -> Tech
          .to(tooth.position, { x: 0, y: 3, z: -12, duration: 1 })
          .to(tooth.rotation, { x: 0.1, y: Math.PI * 10.5, z: 0, duration: 1 }, 6)

        // Scroll step 8: Tech -> Contact
          .to(tooth.position, { x: 0, y: -3, z: -7, duration: 1 })
          .to(tooth.rotation, { x: 0, y: Math.PI * 12.0, z: 0, duration: 1 }, 7);
      }

      // Section Reveals
      const revealTargets = [
        '.hero-left', 
        '.hero-right', 
        '.services-grid', 
        '.why-left', 
        '.why-right', 
        '.doctor-img-wrapper', 
        '.doctor-details', 
        '.testimonial-slide', 
        '.process-step', 
        '.tech-card', 
        '.accordion-item', 
        '.contact-row', 
        '.map-wrapper', 
        '.slider-container'
      ];
      
      revealTargets.forEach(target => {
        const elements = document.querySelectorAll(target);
        elements.forEach(el => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
          });
        });
      });
    }
  });
})();
