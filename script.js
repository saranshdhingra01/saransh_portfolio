
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


document.getElementById("year").textContent = new Date().getFullYear();


const revealTargets = document.querySelectorAll(
  ".section-heading, .about-lead, .about-detail, .timeline-item, " +
  ".project-card, .skills-intro, .skill-group, .education-item, " +
  ".cert-item, .contact-panel"
);

revealTargets.forEach((element) => element.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("visible"));
}

// Contact form submission through FormSubmit
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );
    const formNote = document.getElementById("formNote");
    const honeypot = contactForm.querySelector('[name="_honey"]');

    // Basic spam-trap field
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    formNote.className = "form-note";
    formNote.textContent = "Sending your message...";

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/saransh.dhingra03@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        String(result.success).toLowerCase() === "false"
      ) {
        throw new Error(
          result.message || "The message could not be sent."
        );
      }

      formNote.className = "form-note success";
      formNote.textContent =
        "Thank you! Your message was submitted. If this is your first submission, check the receiving inbox for an activation email.";

      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      formNote.className = "form-note error";
      formNote.textContent =
        "Your message could not be sent. Please email saranshdhingra03@gmail.com directly.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send message <span>↗</span>';
    }
  });
}
