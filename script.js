document.addEventListener('DOMContentLoaded', function () {

    // --- 1. INITIALIZE LUCIDE ICONS ---
    lucide.createIcons();

    // --- 2. HERO SECTION ANIMATION ---
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // --- 3. NAVIGATION & SMOOTH SCROLL ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const navLinks = document.querySelectorAll('.nav-link, .btn-glow-hero');

    // Mobile menu toggle
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('is-open');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Smooth scroll functionality
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Calculate offset for fixed navbar
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            if (mobileMenu.classList.contains('is-open')) {
                mobileMenu.classList.remove('is-open');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }
    };

    // Attach event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                scrollToSection(targetId);
            }
        });
    });

    // --- 4. DYNAMIC SKILLS GENERATION ---
    const skills = [
        { name: "Java", icon: "☕", color: "var(--electric-green)" },
        { name: "Python", icon: "🐍", color: "var(--neon-blue)" },
        { name: "MySQL", icon: "🗄️", color: "var(--cyber-purple)" },
        { name: "HTML", icon: "🌐", color: "var(--electric-green)" },
        { name: "CSS", icon: "🎨", color: "var(--neon-blue)" },
        { name: "Machine Learning", icon: "🧠", color: "var(--cyber-purple)" },
        { name: "OpenCV", icon: "👁️", color: "var(--electric-green)" },
        { name: "TensorFlow", icon: "🤖", color: "var(--neon-blue)" },
        { name: "Power BI", icon: "📊", color: "var(--cyber-purple)" }
    ];

    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skills.forEach((skill, index) => {
            const skillElement = document.createElement('span');
            skillElement.className = "skill-tag";
            skillElement.style.transitionDelay = `${index * 0.05}s`;
            skillElement.innerHTML = `
                <span class="skill-icon" style="color: ${skill.color};">${skill.icon}</span>
                <span>${skill.name}</span>
            `;
            skillsContainer.appendChild(skillElement);
        });
    }

    // --- 5. SCROLL-TRIGGERED ANIMATIONS (INTERSECTION OBSERVER) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // Add visibility class to the elements themselves or their containers
                if (target.id === 'skills-section-observer' || target.id === 'projects-section-observer' || target.id === 'contact-section-observer') {
                    target.querySelector('.section-heading').classList.add('is-visible');
                    target.querySelector('.skills-grid, .projects-grid, .contact-grid').classList.add('is-visible');
                } else {
                    target.classList.add('is-visible');
                }

                observer.unobserve(target); // Animate only once
            }
        });
    }, { threshold: 0.15 });

    // Observe all elements that need to be animated on scroll
    document.querySelectorAll('.animate-on-scroll, #skills-section-observer, #projects-section-observer, #contact-section-observer').forEach(el => {
        animationObserver.observe(el);
    });

    // --- 6. CONTACT FORM & EMAILJS ---
    const serviceId = 'service_8o0wean';
    const templateId = 'template_xa9kxcv';
    const publicKey = '_mgA3eIJUqyyzd_HH';
    emailjs.init(publicKey);

    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const toastContainer = document.getElementById('toast-container');

    // Toast notification function
    function showToast({ title, description, variant = 'success' }) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${variant}`;
        const iconName = variant === 'success' ? 'check-circle' : 'alert-circle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <p class="toast-description">${description}</p>
            </div>
        `;

        toastContainer.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 5000);
    }

    // Button state management
    function setButtonState(state) {
        if (state === 'loading') {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <div class="animate-spin" style="width:16px; height:16px; border:2px solid transparent; border-top-color:white; border-radius:50%; margin-right:8px;"></div>
                Sending...
            `;
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = `<i data-lucide="send"></i> Send Message`;
            lucide.createIcons();
        }
    }

    setButtonState('default'); // Initial state

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showToast({ title: "Validation Error", description: "Please fill out all fields.", variant: "destructive" });
                return;
            }

            setButtonState('loading');
            const templateParams = {
                from_name: nameInput.value,
                from_email: emailInput.value,
                message: messageInput.value,
                to_name: 'Sivanesan R',
            };

            emailjs.send(serviceId, templateId, templateParams)
                .then(() => {
                    showToast({
                        title: "Message Sent!",
                        description: "Thank you for reaching out. I'll get back to you soon.",
                        variant: "success"
                    });
                    form.reset();
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showToast({
                        title: "Send Error",
                        description: "Something went wrong. Please try again or email me directly.",
                        variant: "destructive"
                    });
                })
                .finally(() => {
                    setButtonState('default');
                });
        });
    }
});