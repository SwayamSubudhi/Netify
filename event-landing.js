// Event Creation Platform JavaScript (cleaned)

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const eventNameInput = document.getElementById('eventName');
    const eventDateInput = document.getElementById('eventDate');
    const eventTimeInput = document.getElementById('eventTime');
    const venueInput = document.getElementById('venue');
    const descriptionInput = document.getElementById('description');
    const brandColorInput = document.getElementById('brandColor');
    const ticketPriceInput = document.getElementById('ticketPrice');
    const eventImageInput = document.getElementById('eventImage');
    const createEventBtn = document.getElementById('createEventBtn');

    // Get file upload elements
    const fileUploadArea = document.getElementById('fileUploadArea');
    const uploadContent = document.getElementById('uploadContent');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const imageError = document.getElementById('imageError');

    // Get preview elements
    const previewTitle = document.getElementById('previewTitle');
    const previewDate = document.getElementById('previewDate');
    const previewVenue = document.getElementById('previewVenue');
    const previewDescription = document.getElementById('previewDescription');
    const previewBackground = document.getElementById('previewBackground');
    const registerBtn = document.getElementById('registerBtn');

    // File upload settings
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    let currentImage = null;

    // Set default values
    if (ticketPriceInput && !ticketPriceInput.value) ticketPriceInput.value = '0.1';
    if (brandColorInput && !brandColorInput.value) brandColorInput.value = '#20b8cd';

    // Initialize preview immediately
    initializePreview();

    // Event listeners for real-time preview updates
    if (eventNameInput) {
      ['input', 'keyup', 'change'].forEach((t) => eventNameInput.addEventListener(t, updatePreviewTitle));
    }

    if (eventDateInput) {
      ['change', 'input'].forEach((t) => eventDateInput.addEventListener(t, updatePreviewDate));
    }

    if (eventTimeInput) {
      ['change', 'input'].forEach((t) => eventTimeInput.addEventListener(t, updatePreviewDate));
    }

    if (venueInput) {
      ['input', 'keyup', 'change'].forEach((t) => venueInput.addEventListener(t, updatePreviewVenue));
    }

    if (descriptionInput) {
      ['input', 'keyup', 'change'].forEach((t) => descriptionInput.addEventListener(t, updatePreviewDescription));
    }

    if (brandColorInput) {
      ['change', 'input'].forEach((t) => brandColorInput.addEventListener(t, updateBrandColor));
    }

    // File upload event listeners
    if (fileUploadArea && eventImageInput) {
      fileUploadArea.addEventListener('click', () => eventImageInput.click());
      eventImageInput.addEventListener('change', handleFileSelect);

      // Drag and drop functionality
      fileUploadArea.addEventListener('dragover', handleDragOver);
      fileUploadArea.addEventListener('dragleave', handleDragLeave);
      fileUploadArea.addEventListener('drop', handleDrop);

      // Prevent default drag behaviors
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
      });
    }

    if (removeFileBtn) removeFileBtn.addEventListener('click', removeFile);

    // Form submission handler
    if (createEventBtn) createEventBtn.addEventListener('click', handleFormSubmit);

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function handleDragOver() {
      if (fileUploadArea) fileUploadArea.classList.add('dragover');
    }

    function handleDragLeave() {
      if (fileUploadArea) fileUploadArea.classList.remove('dragover');
    }

    function handleDrop(e) {
      if (fileUploadArea) fileUploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files && files.length > 0) validateAndProcessFile(files[0]);
    }

    function handleFileSelect(e) {
      const file = e.target.files && e.target.files[0];
      if (file) validateAndProcessFile(file);
    }

    function validateAndProcessFile(file) {
      hideError();

      if (!ALLOWED_TYPES.includes(file.type)) {
        showError('Invalid file format. Please upload JPG or PNG images only.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showError('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }

      currentImage = file;
      displayFileInfo(file);
      previewImage(file);
    }

    function displayFileInfo(file) {
      if (!fileName || !fileSize || !uploadContent || !fileInfo) return;
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      fileName.textContent = file.name;
      fileSize.textContent = `${sizeInMB} MB`;
      uploadContent.classList.add('hidden');
      fileInfo.classList.remove('hidden');
    }

    function previewImage(file) {
      if (!previewBackground) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        previewBackground.style.backgroundImage = `url(${e.target.result})`;
        previewBackground.style.backgroundSize = 'cover';
        previewBackground.style.backgroundPosition = 'center';
      };
      reader.readAsDataURL(file);
    }

    function removeFile() {
      currentImage = null;
      if (eventImageInput) eventImageInput.value = '';
      if (previewBackground) {
        previewBackground.style.backgroundImage = '';
        previewBackground.style.background = 'linear-gradient(135deg, #20b8cd 0%, #764ba2 100%)';
      }
      if (uploadContent) uploadContent.classList.remove('hidden');
      if (fileInfo) fileInfo.classList.add('hidden');
      hideError();
    }

    function showError(message) {
      if (imageError) {
        imageError.textContent = message;
        imageError.classList.remove('hidden');
      }
    }

    function hideError() {
      if (imageError) {
        imageError.classList.add('hidden');
        imageError.textContent = '';
      }
    }

    function updatePreviewTitle() {
      if (!previewTitle || !eventNameInput) return;
      const eventName = eventNameInput.value.trim();
      previewTitle.textContent = eventName || 'Your Event Name';
    }

    function updatePreviewDate() {
      if (!previewDate || !eventDateInput) return;
      const date = eventDateInput.value;
      const time = eventTimeInput ? eventTimeInput.value : '';

      let dateText = 'Select date';
      if (date) {
        try {
          const dateObj = new Date(`${date}T00:00:00`);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          dateText = dateObj.toLocaleDateString('en-US', options);
          if (time) {
            const [hours, minutes] = time.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            const timeString = timeObj.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            dateText += ` at ${timeString}`;
          }
        } catch (_) {
          dateText = date + (time ? ` at ${time}` : '');
        }
      }
      previewDate.textContent = dateText;
    }

    function updatePreviewVenue() {
      if (!previewVenue || !venueInput) return;
      const venue = venueInput.value.trim();
      previewVenue.textContent = venue || 'Add venue';
    }

    function updatePreviewDescription() {
      if (!previewDescription || !descriptionInput) return;
      const description = descriptionInput.value.trim();
      previewDescription.textContent = description || 'Add description...';
    }

    function updateBrandColor() {
      if (!brandColorInput) return;
      const color = brandColorInput.value || '#20b8cd';
      if (registerBtn) {
        registerBtn.style.backgroundColor = color;
        registerBtn.setAttribute('data-brand-color', color);
      }
      if (!currentImage && previewBackground) {
        previewBackground.style.background = `linear-gradient(135deg, ${color} 0%, #764ba2 100%)`;
      }
    }

    // Update hero image scan card (guarded)
    (function initScanCard() {
      const card = document.getElementById('scanCard');
      if (!card) return; // safe exit if not present
      const btn = card.querySelector('.scan-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        card.classList.add('scanning');
        setTimeout(() => card.classList.remove('scanning'), 2500);
      });
    })();

    function handleFormSubmit(event) {
      if (event) event.preventDefault();
      const formData = {
        eventName: eventNameInput ? eventNameInput.value.trim() : '',
        date: eventDateInput ? eventDateInput.value : '',
        time: eventTimeInput ? eventTimeInput.value : '',
        venue: venueInput ? venueInput.value.trim() : '',
        description: descriptionInput ? descriptionInput.value.trim() : '',
        brandColor: brandColorInput ? brandColorInput.value : '#20b8cd',
        ticketPrice: ticketPriceInput ? ticketPriceInput.value : '0.1',
        eventImage: currentImage,
      };

      const errors = [];
      if (!formData.eventName) {
        errors.push('Event name is required');
        if (eventNameInput) eventNameInput.style.borderColor = '#ff5459';
      } else if (eventNameInput) eventNameInput.style.borderColor = '#555555';

      if (!formData.date) {
        errors.push('Event date is required');
        if (eventDateInput) eventDateInput.style.borderColor = '#ff5459';
      } else if (eventDateInput) eventDateInput.style.borderColor = '#555555';

      if (!formData.venue) {
        errors.push('Venue is required');
        if (venueInput) venueInput.style.borderColor = '#ff5459';
      } else if (venueInput) venueInput.style.borderColor = '#555555';

      if (!formData.description) {
        errors.push('Description is required');
        if (descriptionInput) descriptionInput.style.borderColor = '#ff5459';
      } else if (descriptionInput) descriptionInput.style.borderColor = '#555555';

      if (errors.length > 0) {
        alert('Please fill in all required fields:\n\n' + errors.join('\n'));
        return;
      }

      console.log('Creating event with data:', formData);
      let successMessage = `Event created successfully!\n\nEvent: ${formData.eventName}\nDate: ${formData.date}${formData.time ? ' ' + formData.time : ''}\nVenue: ${formData.venue}`;
      if (formData.eventImage) {
        successMessage += `\nImage: ${formData.eventImage.name} (${(formData.eventImage.size / (1024 * 1024)).toFixed(2)} MB)`;
      }
      alert(successMessage);
    }

    function initializePreview() {
      setTimeout(() => {
        updatePreviewTitle();
        updatePreviewDate();
        updatePreviewVenue();
        updatePreviewDescription();
        updateBrandColor();
      }, 100);
    }

    function setupInputValidation() {
      const inputs = [eventNameInput, eventDateInput, eventTimeInput, venueInput, descriptionInput].filter(Boolean);
      inputs.forEach((input) => {
        input.addEventListener('focus', function () {
          this.style.borderColor = '#20b8cd';
        });
        input.addEventListener('blur', function () {
          this.style.borderColor = '#555555';
        });
      });
    }

    setupInputValidation();

    if (registerBtn) {
      registerBtn.addEventListener('mouseenter', function () {
        const brandColor = this.getAttribute('data-brand-color') || '#20b8cd';
        this.style.backgroundColor = brandColor + 'cc';
      });
      registerBtn.addEventListener('mouseleave', function () {
        const brandColor = this.getAttribute('data-brand-color') || '#20b8cd';
        this.style.backgroundColor = brandColor;
      });
    }
  });
})();

// Netify Landing Page JavaScript (cleaned)
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScrolling();
    initFeatureCardAnimations();
    initSocialLinkInteractions();
    initScrollAnimations();
    initTechTagAnimations();
    initSponsorInteractions();
  });

  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initFeatureCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
      card.addEventListener('click', function (e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        ripple.classList.add('ripple-effect');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
    const style = document.createElement('style');
    style.textContent = `
      .ripple-effect{position:absolute;border-radius:50%;background:rgba(0,212,255,.3);transform:scale(0);animation:ripple-animation .6s linear;pointer-events:none}
      @keyframes ripple-animation{to{transform:scale(4);opacity:0}}
      .feature-card{position:relative;overflow:hidden;cursor:pointer}
    `;
    document.head.appendChild(style);
  }

  function initSocialLinkInteractions() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          this.style.animation = 'pulse 0.3s ease-in-out';
          setTimeout(() => (this.style.animation = ''), 300);
          console.log(`${this.getAttribute('aria-label')} clicked!`);
        }
      });
      link.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px) scale(1.1)';
      });
      link.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
    const style = document.createElement('style');
    style.textContent = `@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}`;
    document.head.appendChild(style);
  }

  function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          if (entry.target.classList.contains('feature-card')) {
            const cards = document.querySelectorAll('.feature-card');
            const index = Array.from(cards).indexOf(entry.target);
            entry.target.style.animationDelay = `${index * 0.1}s`;
          }
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.feature-card, .section-title, .verbwire-content, .sponsor-item');
    elementsToAnimate.forEach((el) => observer.observe(el));

    const style = document.createElement('style');
    style.textContent = `
      .feature-card,.section-title,.verbwire-content,.sponsor-item{opacity:0;transform:translateY(30px);transition:all .6s ease-out}
      .animate-in{opacity:1!important;transform:translateY(0)!important}
    `;
    document.head.appendChild(style);
  }

  function initTechTagAnimations() {
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.opacity = '1';
        tag.style.transform = 'scale(1)';
      }, index * 100);
      tag.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => (this.style.transform = 'scale(1.05)'), 100);
        setTimeout(() => (this.style.transform = 'scale(1)'), 200);
      });
      tag.addEventListener('mouseenter', function () {
        this.style.background = '#ffffff';
        this.style.color = '#000000';
        this.style.borderColor = '#00d4ff';
        this.style.transform = 'scale(1.05)';
      });
      tag.addEventListener('mouseleave', function () {
        this.style.background = '#1a1a1a';
        this.style.color = '#ffffff';
        this.style.borderColor = '#00d4ff';
        this.style.transform = 'scale(1)';
      });
    });
    const style = document.createElement('style');
    style.textContent = `.tech-tag{opacity:0;transform:scale(.8);transition:all .3s ease-out;cursor:pointer}`;
    document.head.appendChild(style);
  }

  function initSponsorInteractions() {
    const sponsorItems = document.querySelectorAll('.sponsor-item');
    sponsorItems.forEach((item) => {
      item.addEventListener('click', function () {
        this.style.transform = 'translateY(-5px) scale(1.02)';
        setTimeout(() => (this.style.transform = ''), 200);
      });
      const logo = item.querySelector('.sponsor-logo');
      if (logo) {
        item.addEventListener('mouseenter', function () {
          logo.style.transform = 'scale(1.1) rotate(5deg)';
        });
        item.addEventListener('mouseleave', function () {
          logo.style.transform = 'scale(1) rotate(0deg)';
        });
      }
    });
  }

  // Keyboard navigation helpers
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.activeElement.blur();
    if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
  });
  document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
  });
  (function addFocusStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus{outline:2px solid #00d4ff!important;outline-offset:2px!important}
      .keyboard-navigation .social-link:focus{transform:scale(1.1);background:linear-gradient(135deg,#00d4ff 0%,#00a8cc 100%);color:#000}
      .keyboard-navigation .tech-tag:focus{background:#fff!important;color:#000!important;transform:scale(1.05)}
    `;
    document.head.appendChild(style);
  })();

  // Page load fade-in
  window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => (document.body.style.opacity = '1'), 100);
  });

  // Footer links interaction (safe for placeholders)
  document.addEventListener('DOMContentLoaded', function () {
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          const original = this.style.color;
          this.style.color = '#00d4ff';
          setTimeout(() => (this.style.color = original), 300);
        }
      });
    });
  });

  // Parallax effect (guarded)
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Intersection observer for tech tags entrance animation (guarded)
  (function observeTechTags() {
    const techTagsContainer = document.querySelector('.tech-tags');
    if (!techTagsContainer) return;
    const techTagObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const techTags = entry.target.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
              setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    techTagObserver.observe(techTagsContainer);
  })();
})();

// Event Page JavaScript - Countdown (cleaned & robust)
(function () {
  // Countdown target date (September 9, 2025, 11:26 PM IST)
  const countdownTarget = new Date('2025-09-09T23:26:00+05:30').getTime();

  // DOM Elements
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
    console.error('Countdown elements not found. Please check your HTML structure.');
    return; // stop initializing countdown if elements are missing
  }

  function updateCountdown() {
    const now = Date.now();
    const timeLeft = countdownTarget - now;
    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      const pad = (n) => n.toString().padStart(2, '0');
      daysElement.textContent = pad(days);
      hoursElement.textContent = pad(hours);
      minutesElement.textContent = pad(minutes);
      secondsElement.textContent = pad(seconds);
    } else {
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      clearInterval(countdownInterval);
      onCountdownComplete();
    }
  }

  function onCountdownComplete() {
    console.log('Countdown completed!');
    // Add additional completion logic here
  }

  // Initialize & loop
  updateCountdown();
  let countdownInterval = setInterval(updateCountdown, 1000);

  // Optional: Pause/Resume
  window.pauseCountdown = function () {
    clearInterval(countdownInterval);
  };
  window.resumeCountdown = function () {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
  };

  // Cleanup on page unload
  window.addEventListener('beforeunload', function () {
    clearInterval(countdownInterval);
  });
})();

// Interactive Elements Handlers (guarded selectors)
(function () {
  window.handleOngoingClick = function () {
    console.log('On-going status clicked');
    alert('Event is currently ongoing! 🎉');
  };

  window.handleMintTicket = function () {
    console.log('Mint ticket button clicked');
    const button = document.querySelector('.mint-button');
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = 'minting...';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'minted! ✓';
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    }, 2000);
  };

  window.handleViewMoreTickets = function () {
    console.log('View more events clicked');
    alert('Redirecting to events gallery... 🎫');
  };
})();
