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

    // Before/After Case Switcher
    const caseTabs = document.querySelectorAll('.case-tab');
    const beforeImg = document.querySelector('.slider-before');
    const afterImgElement = document.getElementById('slider-after-img');

    if (caseTabs.length > 0 && beforeImg && afterImgElement && handle && afterImg) {
      caseTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          // Remove active class from all tabs
          caseTabs.forEach(t => t.classList.remove('active'));
          // Add active class to current tab
          tab.classList.add('active');

          // Get image URLs from data-attributes
          const beforeUrl = tab.getAttribute('data-before');
          const afterUrl = tab.getAttribute('data-after');

          // Update image sources
          beforeImg.setAttribute('src', beforeUrl);
          afterImgElement.setAttribute('src', afterUrl);

          // Reset slider handle position back to 50%
          handle.style.left = '50%';
          afterImg.style.clipPath = 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';
        });
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

    // 5. TREATMENT CALCULATOR (SMILE JOURNEY) LOGIC
    const goalChecks = document.querySelectorAll('.calc-goal-check');
    const methodBtns = document.querySelectorAll('.calc-method-btn');
    
    const complexityText = document.getElementById('complexity-pct');
    const complexityTier = document.getElementById('complexity-tier');
    const durationText = document.getElementById('duration-val');
    const durationBars = document.getElementById('duration-bars');
    const costText = document.getElementById('cost-val');
    const costProgressBar = document.getElementById('cost-progress-bar');
    const whatsappBtn = document.getElementById('calculator-whatsapp-btn');
    const gaugePath = document.getElementById('gauge-path');

    if (goalChecks.length > 0 && methodBtns.length > 0) {
      let activeMethod = 'aligners';
      let methodTimeMult = 1.1;
      let methodCostAdd = 35000;

      // Handle Method buttons click
      methodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          methodBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeMethod = btn.getAttribute('data-method');
          methodTimeMult = parseFloat(btn.getAttribute('data-time-mult'));
          methodCostAdd = parseFloat(btn.getAttribute('data-cost-add'));
          updateCalculator();
        });
      });

      // Handle Checkbox changes
      goalChecks.forEach(check => {
        check.addEventListener('change', updateCalculator);
      });

      function updateCalculator() {
        let baseComplexity = 0;
        let baseTime = 0;
        let baseCost = 0;
        let selectedGoalsText = [];

        goalChecks.forEach(check => {
          if (check.checked) {
            baseComplexity += parseInt(check.getAttribute('data-complexity'));
            baseTime += parseInt(check.getAttribute('data-time'));
            baseCost += parseInt(check.getAttribute('data-cost'));
            
            // Get label text
            const labelNode = check.parentElement.querySelector('strong');
            if (labelNode) {
              selectedGoalsText.push(labelNode.textContent.trim());
            }
          }
        });

        // If no goals selected, reset
        if (selectedGoalsText.length === 0) {
          complexityText.textContent = '0';
          complexityTier.textContent = 'Select Goals';
          durationText.textContent = '0 months';
          costText.textContent = '₹0';
          if (costProgressBar) costProgressBar.style.width = '0%';
          if (durationBars) durationBars.innerHTML = '';
          if (gaugePath) gaugePath.style.strokeDashoffset = '125.6';
          
          if (whatsappBtn) {
            whatsappBtn.setAttribute('href', '#');
            whatsappBtn.addEventListener('click', preventEmptyClick);
          }
          return;
        }

        // Apply method modifiers
        let finalComplexity = Math.min(baseComplexity, 100);
        let finalTime = Math.round(baseTime * methodTimeMult);
        let finalCost = baseCost + methodCostAdd;

        // Update values in UI
        complexityText.textContent = finalComplexity;

        // Gauge update (perimeter is 125.6)
        if (gaugePath) {
          const dashoffset = 125.6 - (125.6 * finalComplexity) / 100;
          gaugePath.style.strokeDashoffset = dashoffset;
        }

        // Complexity tier rating text
        let tierName = 'Mild Correction';
        if (finalComplexity > 65) {
          tierName = 'Complex Redesign';
        } else if (finalComplexity > 35) {
          tierName = 'Moderate Correction';
        }
        complexityTier.textContent = tierName;

        // Duration text
        durationText.textContent = `${finalTime} months`;

        // Render duration segments (up to 10 segment bars)
        if (durationBars) {
          durationBars.innerHTML = '';
          const maxBars = 10;
          // Scale finalTime to bars (each bar ~2 months, min 1 bar filled if finalTime > 0)
          const filledBarsCount = Math.max(1, Math.min(maxBars, Math.round(finalTime / 1.5)));
          for (let i = 0; i < maxBars; i++) {
            const segment = document.createElement('div');
            segment.className = `bar-segment ${i < filledBarsCount ? 'filled' : ''}`;
            durationBars.appendChild(segment);
          }
        }

        // Cost text range display
        const costMin = Math.round(finalCost * 0.9);
        const costMax = Math.round(finalCost * 1.15);
        costText.textContent = `₹${costMin.toLocaleString('en-IN')} - ₹${costMax.toLocaleString('en-IN')}`;

        // Cost bar progress percent (scale up to max possible cost ₹180,000)
        if (costProgressBar) {
          const maxCostScale = 160000;
          const costPercent = Math.min(100, Math.round((finalCost / maxCostScale) * 100));
          costProgressBar.style.width = `${costPercent}%`;
        }

        // Sync WhatsApp CTA button link
        if (whatsappBtn) {
          whatsappBtn.removeEventListener('click', preventEmptyClick);
          
          let methodLabel = 'Invisalign Clear Aligners';
          if (activeMethod === 'braces') methodLabel = 'Ceramic Braces';
          else if (activeMethod === 'implants') methodLabel = 'Implants / Restorations';

          const goalsStr = selectedGoalsText.join(', ');
          const messageText = `Hello Dr. Suryawanshi's Clinic, I planned my treatment using your Smile Journey Calculator. Here are my preferences:
Goals: ${goalsStr}
Method: ${methodLabel}
Estimated Complexity: ${finalComplexity}% (${tierName})
Estimated Duration: ${finalTime} months
Approximate Cost: ₹${costMin.toLocaleString('en-IN')} - ₹${costMax.toLocaleString('en-IN')}

I would like to book a clinical examination to verify this plan.`;

          const waUrl = `https://wa.me/917972067931?text=${encodeURIComponent(messageText)}`;
          whatsappBtn.setAttribute('href', waUrl);
          whatsappBtn.setAttribute('target', '_blank');
        }
      }

      function preventEmptyClick(e) {
        e.preventDefault();
        alert('Please select at least one treatment goal first to view your projection!');
      }

      // Initialize update once on load
      updateCalculator();
    }
  });
})();
