// Event Creation Platform JavaScript

document.addEventListener('DOMContentLoaded', function() {
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
    const previewCard = document.getElementById('previewCard');
    const previewBackground = document.getElementById('previewBackground');
    const registerBtn = document.getElementById('registerBtn');

    // File upload settings
    const MAX_FILE_SIZE = 5242880; // 5MB in bytes
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    
    let currentImage = null;

    // Set default values
    if (ticketPriceInput) ticketPriceInput.value = '0.1';
    if (brandColorInput) brandColorInput.value = '#20b8cd';

    // Initialize preview immediately
    initializePreview();

    // Event listeners for real-time preview updates - using multiple event types for better compatibility
    if (eventNameInput) {
        eventNameInput.addEventListener('input', updatePreviewTitle);
        eventNameInput.addEventListener('keyup', updatePreviewTitle);
        eventNameInput.addEventListener('change', updatePreviewTitle);
    }

    if (eventDateInput) {
        eventDateInput.addEventListener('change', updatePreviewDate);
        eventDateInput.addEventListener('input', updatePreviewDate);
    }

    if (eventTimeInput) {
        eventTimeInput.addEventListener('change', updatePreviewDate);
        eventTimeInput.addEventListener('input', updatePreviewDate);
    }

    if (venueInput) {
        venueInput.addEventListener('input', updatePreviewVenue);
        venueInput.addEventListener('keyup', updatePreviewVenue);
        venueInput.addEventListener('change', updatePreviewVenue);
    }

    if (descriptionInput) {
        descriptionInput.addEventListener('input', updatePreviewDescription);
        descriptionInput.addEventListener('keyup', updatePreviewDescription);
        descriptionInput.addEventListener('change', updatePreviewDescription);
    }

    if (brandColorInput) {
        brandColorInput.addEventListener('change', updateBrandColor);
        brandColorInput.addEventListener('input', updateBrandColor);
    }

    // File upload event listeners
    if (fileUploadArea && eventImageInput) {
        fileUploadArea.addEventListener('click', () => {
            eventImageInput.click();
        });
        eventImageInput.addEventListener('change', handleFileSelect);
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', removeFile);
    }

    // Drag and drop functionality
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('dragleave', handleDragLeave);
        fileUploadArea.addEventListener('drop', handleDrop);

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });
    }

    // Form submission handler
    if (createEventBtn) {
        createEventBtn.addEventListener('click', handleFormSubmit);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDragOver(e) {
        if (fileUploadArea) {
            fileUploadArea.classList.add('dragover');
        }
    }

    function handleDragLeave(e) {
        if (fileUploadArea) {
            fileUploadArea.classList.remove('dragover');
        }
    }

    function handleDrop(e) {
        if (fileUploadArea) {
            fileUploadArea.classList.remove('dragover');
        }
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndProcessFile(files[0]);
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            validateAndProcessFile(file);
        }
    }

    function validateAndProcessFile(file) {
        // Clear previous errors
        hideError();

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            showError('Invalid file format. Please upload JPG or PNG images only.');
            return;
        }

        // Validate file size (5MB = 5,242,880 bytes)
        if (file.size > MAX_FILE_SIZE) {
            showError('File size exceeds 5MB limit. Please choose a smaller image.');
            return;
        }

        // Process valid file
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
        reader.onload = function(e) {
            previewBackground.style.backgroundImage = `url(${e.target.result})`;
            previewBackground.style.backgroundSize = 'cover';
            previewBackground.style.backgroundPosition = 'center';
        };
        reader.readAsDataURL(file);
    }

    function removeFile() {
        currentImage = null;
        if (eventImageInput) eventImageInput.value = '';
        
        // Reset to default gradient background
        if (previewBackground) {
            previewBackground.style.backgroundImage = '';
            previewBackground.style.background = 'linear-gradient(135deg, #20b8cd 0%, #764ba2 100%)';
        }
        
        // Show upload content, hide file info
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

    // Update preview title
    function updatePreviewTitle() {
        if (!previewTitle || !eventNameInput) return;
        
        const eventName = eventNameInput.value.trim();
        previewTitle.textContent = eventName || 'Your Event Name';
    }

    // Update preview date with proper formatting
    function updatePreviewDate() {
        if (!previewDate || !eventDateInput) return;
        
        const date = eventDateInput.value;
        const time = eventTimeInput ? eventTimeInput.value : '';
        
        let dateText = 'Select date';
        
        if (date) {
            try {
                // Format date to a more readable format
                const dateObj = new Date(date + 'T00:00:00');
                const options = { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                };
                dateText = dateObj.toLocaleDateString('en-US', options);
                
                if (time) {
                    // Format time to 12-hour format
                    const [hours, minutes] = time.split(':');
                    const timeObj = new Date();
                    timeObj.setHours(parseInt(hours), parseInt(minutes));
                    const timeString = timeObj.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                    dateText += ` at ${timeString}`;
                }
            } catch (error) {
                dateText = date + (time ? ` at ${time}` : '');
            }
        }
        
        previewDate.textContent = dateText;
    }

    // Update preview venue
    function updatePreviewVenue() {
        if (!previewVenue || !venueInput) return;
        
        const venue = venueInput.value.trim();
        previewVenue.textContent = venue || 'Add venue';
    }

    // Update preview description
    function updatePreviewDescription() {
        if (!previewDescription || !descriptionInput) return;
        
        const description = descriptionInput.value.trim();
        previewDescription.textContent = description || 'Add description...';
    }

    // Update brand color
    function updateBrandColor() {
        if (!brandColorInput) return;
        
        const color = brandColorInput.value;
        
        // Update register button color
        if (registerBtn) {
            registerBtn.style.backgroundColor = color;
            // Store the color for hover effects
            registerBtn.setAttribute('data-brand-color', color);
        }
        
        // If no custom image is uploaded, update the gradient
        if (!currentImage && previewBackground) {
            const gradient = `linear-gradient(135deg, ${color} 0%, #764ba2 100%)`;
            previewBackground.style.background = gradient;
        }
    }

    // Handle form submission with proper validation
    function handleFormSubmit(event) {
        if (event) event.preventDefault();
        
        // Get all form data
        const formData = {
            eventName: eventNameInput ? eventNameInput.value.trim() : '',
            date: eventDateInput ? eventDateInput.value : '',
            time: eventTimeInput ? eventTimeInput.value : '',
            venue: venueInput ? venueInput.value.trim() : '',
            description: descriptionInput ? descriptionInput.value.trim() : '',
            brandColor: brandColorInput ? brandColorInput.value : '#20b8cd',
            ticketPrice: ticketPriceInput ? ticketPriceInput.value : '0.1',
            eventImage: currentImage
        };

        // Validate required fields
        const errors = [];
        
        if (!formData.eventName) {
            errors.push('Event name is required');
            if (eventNameInput) eventNameInput.style.borderColor = '#ff5459';
        } else {
            if (eventNameInput) eventNameInput.style.borderColor = '#555555';
        }

        if (!formData.date) {
            errors.push('Event date is required');
            if (eventDateInput) eventDateInput.style.borderColor = '#ff5459';
        } else {
            if (eventDateInput) eventDateInput.style.borderColor = '#555555';
        }

        if (!formData.venue) {
            errors.push('Venue is required');
            if (venueInput) venueInput.style.borderColor = '#ff5459';
        } else {
            if (venueInput) venueInput.style.borderColor = '#555555';
        }

        if (!formData.description) {
            errors.push('Description is required');
            if (descriptionInput) descriptionInput.style.borderColor = '#ff5459';
        } else {
            if (descriptionInput) descriptionInput.style.borderColor = '#555555';
        }

        // Show validation errors
        if (errors.length > 0) {
            alert('Please fill in all required fields:\n\n' + errors.join('\n'));
            return;
        }

        // Simulate successful event creation
        console.log('Creating event with data:', formData);
        
        let successMessage = `Event created successfully!\n\nEvent: ${formData.eventName}\nDate: ${formData.date}\nVenue: ${formData.venue}`;
        if (formData.eventImage) {
            successMessage += `\nImage: ${formData.eventImage.name} (${(formData.eventImage.size / (1024 * 1024)).toFixed(2)} MB)`;
        }
        
        alert(successMessage);
    }

    // Initialize preview with default values
    function initializePreview() {
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            updatePreviewTitle();
            updatePreviewDate();
            updatePreviewVenue();
            updatePreviewDescription();
            updateBrandColor();
        }, 100);
    }

    // Enhanced input validation styling
    function setupInputValidation() {
        const inputs = [eventNameInput, eventDateInput, eventTimeInput, venueInput, descriptionInput].filter(Boolean);
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#20b8cd';
            });
            
            input.addEventListener('blur', function() {
                this.style.borderColor = '#555555';
            });
        });
    }

    // Setup input validation
    setupInputValidation();

    // Add register button hover effect
    if (registerBtn) {
        registerBtn.addEventListener('mouseenter', function() {
            const brandColor = this.getAttribute('data-brand-color') || '#20b8cd';
            this.style.backgroundColor = brandColor + 'cc'; // Add slight transparency
        });

        registerBtn.addEventListener('mouseleave', function() {
            const brandColor = this.getAttribute('data-brand-color') || '#20b8cd';
            this.style.backgroundColor = brandColor;
        });
    }
});