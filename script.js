// ================================
// ALI TEC CORPORATION
// Main JavaScript
// ================================

const menuBtn = document.getElementById("menuBtn");
const navbar = document.querySelector(".navbar");

// Mobile Menu
menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});

// Close mobile menu after clicking a link
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
});


// Scroll Reveal Animation
const revealElements = document.querySelectorAll(
    ".section-title, .about-content, .service-card, .project-card, .contact-text"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
});
// ================================
// CONTACT FORM
// ================================

// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        project: document.getElementById("project").value,
        message: document.getElementById("message").value.trim()
    };

    try {

     const response = await fetch("https://ali-tec-corporation.onrender.com/send-message", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
});

        const result = await response.json();

        if (result.success) {

            formMessage.textContent = result.message;
            contactForm.reset();

        } else {

            formMessage.textContent =
                result.message || "Message could not be sent.";

        }

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "Server connection failed. Please try again.";

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Send Message →";
    }
});
