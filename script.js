
document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.querySelector('.navbar').offsetHeight;

            window.scrollTo({
                top: targetElement.offsetTop - navbarHeight,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // Contact form handling
    document.addEventListener('DOMContentLoaded', function () {
        const contactForm = document.getElementById('contactForm');
        const successAlert = document.getElementById('success-alert');

        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                if (!validateForm()) {
                    return;
                }

                // If Firebase is initialized, use it
                if (typeof database !== 'undefined') {
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const subject = document.getElementById('subject').value;
                    const message = document.getElementById('message').value;
                    const timestamp = new Date().toISOString();

                    database.ref('messages').push().set({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        timestamp: timestamp,
                        read: false
                    })
                        .then(() => showSuccessMessage())
                        .catch((error) => {
                            console.error("Error saving message: ", error);
                            alert("There was an error sending your message. Please try again.");
                        });
                } else {
                    // Fallback if Firebase isn't configured
                    showSuccessMessage();
                }

                contactForm.reset();
            });
        }

        function showSuccessMessage() {
            if (successAlert) {
                successAlert.classList.remove('d-none');
                successAlert.classList.add('show');

                setTimeout(() => {
                    successAlert.classList.remove('show');
                    setTimeout(() => {
                        successAlert.classList.add('d-none');
                    }, 300);
                }, 5000);
            }
        }

        function validateForm() {
            let isValid = true;
            const fields = ['name', 'email', 'subject', 'message'];

            // Remove previous validation messages
            fields.forEach(field => {
                const input = document.getElementById(field);
                input.classList.remove('is-invalid');
                const feedback = input.nextElementSibling?.classList.contains('invalid-feedback')
                    ? input.nextElementSibling : null;
                if (feedback) {
                    input.parentNode.removeChild(feedback);
                }
            });

            // Check required fields
            fields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    const feedbackDiv = document.createElement('div');
                    feedbackDiv.className = 'invalid-feedback';
                    feedbackDiv.textContent = 'This field is required';
                    input.parentNode.appendChild(feedbackDiv);
                    isValid = false;
                }
            });

            // Validate email format
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() && !emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = 'invalid-feedback';
                feedbackDiv.textContent = 'Please enter a valid email address';
                email.parentNode.appendChild(feedbackDiv);
                isValid = false;
            }

            return isValid;
        }
    });
