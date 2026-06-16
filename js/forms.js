/* ==========================================================================
   FORMS.JS - Form Validation, Exit Intent Modal & Before/After Slider
   ========================================================================== */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. BEFORE & AFTER IMAGE SLIDER
    const slider = document.querySelector('.slider-container');
    const handle = document.querySelector('.slider-handle');
    const afterImg = document.querySelector('.slider-after');

    if (slider && handle && afterImg) {
      let isDragging = false;

      const setSliderPosition = (x) => {
        const rect = slider.getBoundingClientRect();
        let posX = x - rect.left;
        
        // Boundaries check
        if (posX < 0) posX = 0;
        if (posX > rect.width) posX = rect.width;

        const percentage = (posX / rect.width) * 100;
        
        handle.style.left = `${percentage}%`;
        afterImg.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
      };

      // Mouse Events
      slider.addEventListener('mousedown', () => {
        isDragging = true;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e.clientX);
      });

      // Touch Events (Mobile)
      slider.addEventListener('touchstart', () => {
        isDragging = true;
      });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });

      slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e.touches[0].clientX);
      });
    }

    // 2. LEAD CAPTURE FORM SUBMISSION (Hero Form)
    const leadForm = document.getElementById('consultation-form');
    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success animation overlay
        const overlay = leadForm.querySelector('.form-success-overlay');
        if (overlay) {
          overlay.classList.add('active');

          // Retrieve form details for WhatsApp redirection
          const nameInput = document.getElementById('form-name');
          const phoneInput = document.getElementById('form-phone');
          const timeSelect = document.getElementById('form-time');
          const treatmentSelect = document.getElementById('form-treatment');
          const msgArea = document.getElementById('form-message');
          
          const name = nameInput ? nameInput.value : '';
          const phone = phoneInput ? phoneInput.value : '';
          const preferredTime = timeSelect ? timeSelect.value : '';
          const treatment = treatmentSelect ? treatmentSelect.value : '';
          const msg = msgArea ? msgArea.value : '';

          const waButton = overlay.querySelector('.success-wa-btn');
          if (waButton) {
            const message = `Hello Dr. Suryawanshi's Clinic, my name is ${name}. I would like to book a free consultation for ${treatment}. Phone: ${phone}. Preferred time slot: ${preferredTime}. ${msg ? 'My concern: ' + msg : ''}`;
            const waUrl = `https://wa.me/917972067931?text=${encodeURIComponent(message)}`;
            waButton.setAttribute('href', waUrl);
          }

          // Reset form fields
          setTimeout(() => {
            leadForm.reset();
          }, 1000);
        }
      });
    }

    // Modal success close button
    const closeSuccessBtns = document.querySelectorAll('.close-success-btn');
    closeSuccessBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = btn.closest('.form-success-overlay');
        if (overlay) overlay.classList.remove('active');
      });
    });

    // 3. EXIT INTENT POPUP MODAL
    const exitModal = document.getElementById('exit-intent-modal');
    const closeModalBtn = document.getElementById('close-exit-modal');
    
    if (exitModal) {
      let shown = false;

      // Trigger exit intent when mouse leaves the top boundary of the viewport
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 20 && !shown) {
          shown = true;
          exitModal.classList.add('modal-active');
        }
      });

      // Close modal events
      if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
          exitModal.classList.remove('modal-active');
        });
      }

      // Close when clicking overlay backdrop
      exitModal.addEventListener('click', (e) => {
        if (e.target === exitModal) {
          exitModal.classList.remove('modal-active');
        }
      });
    }

    // 4. FAQ ACCORDION INTERACTION
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    accordionTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isActive = item.classList.contains('active');
        
        // Collapse all items first
        document.querySelectorAll('.accordion-item').forEach(accItem => {
          accItem.classList.remove('active');
        });

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  });
})();
