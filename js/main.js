/* ==========================================================================
   MAIN.JS - Preloader, Sticky Navigation & Interactive UI elements
   ========================================================================== */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. PRELOADER ANIMATION
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 650);
      });
      // Fallback if load event has already fired
      if (document.readyState === 'complete') {
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 650);
      }
    }

    // 2. SCROLL PROGRESS INDICATOR & STICKY NAV SCROLL CLASS
    const progressIndicator = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      if (progressIndicator) {
        progressIndicator.style.width = `${progress}%`;
      }
      
      const header = document.querySelector('header.sticky-nav');
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Parallax scroll effects for visual depth
      const scrolled = window.scrollY;
      const heroLeft = document.querySelector('.hero-left');
      if (heroLeft && window.innerWidth > 768) {
        heroLeft.style.transform = `translateY(${scrolled * 0.15}px)`;
      }

      const canvas = document.getElementById('bg-canvas');
      if (canvas) {
        if (window.innerWidth > 768) {
          canvas.style.transform = `translateY(${scrolled * 0.22}px)`;
        }
        
        // Hide fixed 3D canvas in Hero section to let the slider images shine, and in the footer to prevent overlapping
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (scrolled > window.innerHeight * 0.65 && scrolled < maxScroll - 400) {
          canvas.style.opacity = '0.9';
          canvas.style.pointerEvents = 'auto';
        } else {
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
        }
      }
    });

    // 3. RESPONSIVE HAMBURGER NAVIGATION DRAWER
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
      const toggleMenu = () => {
        const isOpen = navLinks.classList.contains('active');
        if (isOpen) {
          navLinks.classList.remove('active');
          document.body.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        } else {
          navLinks.classList.add('active');
          document.body.classList.add('menu-open');
          hamburger.setAttribute('aria-expanded', 'true');
        }
      };

      hamburger.addEventListener('click', toggleMenu);

      navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          document.body.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // 4. ACTIVE LINK STATE ON SCROLL
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (activeLink) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            activeLink.classList.add('active');
          } else {
            activeLink.classList.remove('active');
          }
        }
      });
    });

    // 5. CUSTOM CURSOR & FOLLOWER
    // Create cursor elements dynamically if they do not exist
    let cursor = document.querySelector('.custom-cursor');
    let follower = document.querySelector('.custom-cursor-follower');

    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
    }
    if (!follower) {
      follower = document.createElement('div');
      follower.className = 'custom-cursor-follower';
      document.body.appendChild(follower);
    }

    document.addEventListener('mousemove', (e) => {
      // Update small cursor immediately
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      // Update follower with delay (handled in CSS transition or animation frame)
      setTimeout(() => {
        follower.style.left = `${e.clientX}px`;
        follower.style.top = `${e.clientY}px`;
      }, 30);
    });

    // Add hover effects for interactive elements
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .service-card, .accordion-trigger, .tech-card, .slider-handle, .calc-checkmark, #calc-3d-canvas');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        follower.classList.add('hovering');
      });
      item.addEventListener('mouseleave', () => {
        follower.classList.remove('hovering');
      });
    });

    // 6. MAGNETIC BUTTONS EFFECT
    const magneticBtns = document.querySelectorAll('.btn, .logo, .social-btn');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull the button slightly towards mouse
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        // Reset transformation position
        btn.style.transform = 'translate(0px, 0px)';
      });
    });

    // 7. SERVICES DETAILS COLLAPSIBLE ACCORDION CARDS
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Only toggle if they click card, description, or the button
        const btn = card.querySelector('.btn-learn-more');
        const isActive = card.classList.contains('active');
        
        // Close all other cards
        serviceCards.forEach(c => {
          if (c !== card) {
            c.classList.remove('active');
            const b = c.querySelector('.btn-learn-more');
            if (b) b.textContent = 'Learn More';
          }
        });
        
        // Toggle current card
        if (!isActive) {
          card.classList.add('active');
          if (btn) btn.textContent = 'Show Less';
        } else {
          card.classList.remove('active');
          if (btn) btn.textContent = 'Learn More';
        }
      });
    });

    // 8. TESTIMONIALS CAROUSEL SLIDER LOGIC
    const testimonialTrack = document.querySelector('.testimonials-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.slider-dot');
    
    if (testimonialTrack && testimonialSlides.length > 0) {
      let currentIndex = 0;
      
      const showSlide = (index) => {
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        if (testimonialDots[index]) {
          testimonialDots[index].classList.add('active');
        }
        currentIndex = index;
      };

      testimonialDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const slideIndex = parseInt(dot.getAttribute('data-slide'));
          showSlide(slideIndex);
        });
      });

      // Auto-play interval (6 seconds)
      let autoPlayInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % testimonialSlides.length;
        showSlide(nextIndex);
      }, 6000);

      // Reset interval when user clicks a dot navigation button
      testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
          clearInterval(autoPlayInterval);
          autoPlayInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % testimonialSlides.length;
            showSlide(nextIndex);
          }, 6000);
        });
      });
    }

    // 9. HERO BACKGROUND CAROUSEL AUTO-PLAY LOGIC
    const heroSlides = document.querySelectorAll('.hero-bg-carousel .slide');
    if (heroSlides.length > 0) {
      let currentHeroIndex = 0;
      setInterval(() => {
        heroSlides[currentHeroIndex].classList.remove('active');
        currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
        heroSlides[currentHeroIndex].classList.add('active');
      }, 5000);
    }
  });
})();
