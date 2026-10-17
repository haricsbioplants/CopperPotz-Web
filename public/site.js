document.querySelector("#year").textContent = new Date().getFullYear();
const toggle = document.querySelector("#menu-toggle");
const links = document.querySelector("#nav-links");
toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  links.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
}));
const currentPage = location.pathname.split("/").pop() || "index.html";
links?.querySelectorAll("a[data-page]").forEach(a => {
  if (a.dataset.page === currentPage) a.classList.add("active");
});

const dateInput = document.querySelector("#date");
if (dateInput) {
  const now = new Date();
  dateInput.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
}
async function submitEmailForm(form, endpoint, successMessage) {
  const button = form.querySelector("button[type=submit]");
  const label = form.querySelector("#button-label");
  const status = form.querySelector("#status");
  button.disabled = true;
  if (label) label.textContent = "Sending...";
  status.textContent = "";
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch(endpoint, {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Unable to send your message.");
    status.style.color = "#bfe9ca";
    status.textContent = successMessage || result.message;
    form.reset();
  } catch (err) {
    status.style.color = "#ffd0c9";
    status.textContent = err.message || "Something went wrong. Please try again.";
  } finally {
    button.disabled = false;
    if (label) label.textContent = form.id === "contact-form" ? "Send message" : "Send reservation request";
  }
}
document.querySelector("#reservation-form")?.addEventListener("submit", e => {
  e.preventDefault();
  submitEmailForm(e.currentTarget, "/api/reservation", "Your request has been sent. The restaurant will contact you to confirm your table.");
});
document.querySelector("#contact-form")?.addEventListener("submit", e => {
  e.preventDefault();
  submitEmailForm(e.currentTarget, "/api/contact", "Thank you for your message. Our team will get back to you.");
});


document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("heroImageCarousel");
    if (!box) return;

    const slides = [...box.querySelectorAll(".hero-slide")];
    const dots = [...box.querySelectorAll(".image-carousel-dots button")];
    const prev = box.querySelector(".image-carousel-prev");
    const next = box.querySelector(".image-carousel-next");

    let index = 0;
    let timer;

    function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    function stopCarousel() {
        clearInterval(timer);
    }

    function startCarousel() {
        stopCarousel();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        timer = setInterval(() => {
            if (!box.matches(":hover") &&
                !box.contains(document.activeElement)) {
                showSlide(index + 1);
            }
        }, 2000);
    }

    prev.addEventListener("click", () => {
        showSlide(index - 1);
        startCarousel();
    });

    next.addEventListener("click", () => {
        showSlide(index + 1);
        startCarousel();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            showSlide(i);
            startCarousel();
        });
    });

    box.addEventListener("mouseenter", stopCarousel);
    box.addEventListener("mouseleave", startCarousel);
    box.addEventListener("focusin", stopCarousel);
    box.addEventListener("focusout", startCarousel);

    showSlide(0);
    startCarousel();
});



document.addEventListener("DOMContentLoaded", () => {
    const items = [...document.querySelectorAll(".gallery-item")];
    const lightbox = document.getElementById("galleryLightbox");

    if (!items.length || !lightbox) return;

    const viewerImage = document.getElementById("galleryLightboxImage");
    const counter = document.getElementById("galleryCounter");
    const closeButton = lightbox.querySelector(".gallery-close");
    const prevButton = lightbox.querySelector(".gallery-prev");
    const nextButton = lightbox.querySelector(".gallery-next");

    let currentIndex = 0;
    let previousFocus = null;

    function showPhoto(index) {
        currentIndex = (index + items.length) % items.length;

        const item = items[currentIndex];
        const thumbnail = item.querySelector("img");

        viewerImage.src = item.dataset.full || thumbnail.src;
        viewerImage.alt = thumbnail.alt;
        counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    function openViewer(index) {
        previousFocus = document.activeElement;
        showPhoto(index);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("gallery-open");

        closeButton.focus();
    }

    function closeViewer() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("gallery-open");
        viewerImage.removeAttribute("src");

        if (previousFocus) previousFocus.focus();
    }

    items.forEach((item, index) => {
        item.addEventListener("click", () => openViewer(index));
    });

    closeButton.addEventListener("click", closeViewer);
    prevButton.addEventListener("click", () => showPhoto(currentIndex - 1));
    nextButton.addEventListener("click", () => showPhoto(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeViewer();
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") closeViewer();
        if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
        if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
    });
});
