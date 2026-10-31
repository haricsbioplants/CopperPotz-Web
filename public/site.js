/* =========================
   Footer Year
========================= */
const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================
   Mobile Navigation
========================= */
const toggle = document.querySelector("#menu-toggle");
const links = document.querySelector("#nav-links");

toggle?.addEventListener("click", () => {
  const open = links?.classList.toggle("open") ?? false;
  toggle.setAttribute("aria-expanded", String(open));
});

links?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

/* =========================
   Active Navigation Link
========================= */
const currentPage = location.pathname.split("/").pop() || "index.html";

links?.querySelectorAll("a[data-page]").forEach((a) => {
  if (a.dataset.page === currentPage) {
    a.classList.add("active");
  }
});

/* =========================
   Reservation Date Validation
========================= */
const dateInput = document.querySelector("#date");

if (dateInput) {
  const now = new Date();

  dateInput.min = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}


/* Copper Potz Contact Form - FormSubmit AJAX */


/* Copper Potz Contact Form - FormSubmit */

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector("#submit-button");
  const buttonLabel = contactForm.querySelector("#button-label");
  const status = contactForm.querySelector("#status");

  const originalLabel = buttonLabel?.textContent || "Send message";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    submitButton.disabled = true;
    if (buttonLabel) buttonLabel.textContent = "Sending...";

    status.textContent = "";
    status.style.color = "#ffd0c9";

    const startedAt = performance.now();

    try {
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      payload._subject =
        `Copper Potz - Contact Message - ${new Date().toLocaleString("en-IN")}`;
      payload._template = "table";

      const response = await fetch(
        "https://formsubmit.co/ajax/copperpotz24@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const elapsed = ((performance.now() - startedAt) / 1000).toFixed(2);
      console.log(`FormSubmit request took ${elapsed} seconds.`);
      console.log("HTTP status:", response.status);

      const result = await response.json();
      console.log("FormSubmit result:", result);

      if (
        !response.ok ||
        String(result.success) !== "true"
      ) {
        throw new Error(
          result.message || "The message could not be sent. Please try again."
        );
      }

      status.style.color = "#bfe9ca";
      status.textContent =
        "Thank you! Your message has been sent successfully.";

      contactForm.reset();

    } catch (error) {
      console.error("Contact form error:", error);

      status.style.color = "#ffd0c9";
      status.textContent =
        error.message || "Unable to send your message. Please try again.";

    } finally {
      submitButton.disabled = false;
      if (buttonLabel) buttonLabel.textContent = originalLabel;
    }
  });
}

// Copper Potz - Reservation Form Submission
const reservationForm = document.querySelector("#reservation-form");

if (reservationForm) {
    const submitButton = reservationForm.querySelector("#submit-button");
    const buttonLabel = reservationForm.querySelector("#button-label");
    const status = reservationForm.querySelector("#status");

    const originalLabel = buttonLabel.textContent;

    reservationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Validate required fields
        if (!reservationForm.checkValidity()) {
            reservationForm.reportValidity();
            return;
        }

        // Prevent duplicate submissions
        if (submitButton.disabled) return;

        submitButton.disabled = true;
        buttonLabel.textContent = "Sending...";
        status.textContent = "";
        status.style.color = "#ffd0c9";

        try {
            const formData = new FormData(reservationForm);
            const payload = Object.fromEntries(formData.entries());

            payload._subject = `Copper Potz - Table Reservation - ${new Date().toLocaleString("en-IN")}`;
            payload._template = "table";

            const response = await fetch(
                "https://formsubmit.co/ajax/copperpotz24@gmail.com",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();

            console.log("Reservation response:", response.status, result);

            if (!response.ok || String(result.success) !== "true") {
                throw new Error(
                    result.message || "Unable to send your reservation request."
                );
            }

            status.style.color = "#bfe9ca";
            status.textContent =
                "Thank you! Your reservation request has been sent. The restaurant will contact you to confirm availability.";

            reservationForm.reset();

        } catch (error) {
            console.error("Reservation form error:", error);

            status.style.color = "#ffd0c9";
            status.textContent =
                "We couldn't confirm submission. Please check your email before trying again, as your request may still have been delivered.";

        } finally {
            submitButton.disabled = false;
            buttonLabel.textContent = originalLabel;
        }
    });
}

/* ==========================================
   COPPER POTZ - EMAILJS FORM INTEGRATION
========================================== */

// async function sendCopperPotzEmail({
//     form,
//     submitButton,
//     buttonLabel,
//     status,
//     templateId,
//     successMessage
// }) {
//     if (!form.checkValidity()) {
//         form.reportValidity();
//         return;
//     }

//     if (submitButton.disabled) return;

//     if (typeof emailjs === "undefined") {
//         status.textContent = "Email service is not available. Please try again later.";
//         status.style.color = "#ffd0c9";
//         return;
//     }

//     submitButton.disabled = true;

//     const originalLabel = buttonLabel?.textContent || "Submit";
//     if (buttonLabel) buttonLabel.textContent = "Sending...";

//     status.textContent = "";
//     status.style.color = "#ffd0c9";

//     try {
//         const formData = new FormData(form);
//         const templateParams = Object.fromEntries(formData.entries());

//         // Add submission details
//         templateParams.submission_date =
//             new Date().toLocaleString("en-IN");

//         await emailjs.send(
//             EMAIL_CONFIG.serviceId,
//             templateId,
//             templateParams
//         );

//         status.style.color = "#bfe9ca";
//         status.textContent = successMessage;

//         form.reset();

//     } catch (error) {
//         console.error("Copper Potz email error:", error);

//         status.style.color = "#ffd0c9";
//         status.textContent =
//             "We couldn't send your request. Please try again or contact the restaurant directly.";

//     } finally {
//         submitButton.disabled = false;

//         if (buttonLabel) {
//             buttonLabel.textContent = originalLabel;
//         }
//     }
// }


/* ==========================================
   1. TABLE RESERVATION FORM
========================================== */

// const reservationForm = document.querySelector("#reservation-form");

// if (reservationForm) {
//     const submitButton = reservationForm.querySelector("#submit-button");
//     const buttonLabel = reservationForm.querySelector("#button-label");
//     const status = reservationForm.querySelector("#status");

//     reservationForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         await sendCopperPotzEmail({
//             form: reservationForm,
//             submitButton,
//             buttonLabel,
//             status,
//             templateId: EMAIL_CONFIG.templates.reservation,

//             successMessage:
//                 "Thank you! Your reservation request has been sent. The restaurant will contact you to confirm availability."
//         });
//     });
// }


/* ==========================================
   2. CONTACT FORM
========================================== */

// const contactForm = document.querySelector("#contact-form");

// if (contactForm) {
//     const submitButton = contactForm.querySelector("#submit-button");
//     const buttonLabel = contactForm.querySelector("#button-label");
//     const status = contactForm.querySelector("#status");

//     contactForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         await sendCopperPotzEmail({
//             form: contactForm,
//             submitButton,
//             buttonLabel,
//             status,
//             templateId: EMAIL_CONFIG.templates.contact,

//             successMessage:
//                 "Thank you! Your message has been sent successfully."
//         });
//     });
// }


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





document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-nav a[href^='#']");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Individual dish image mappings
  const dishImages = {
    // Soups
    "Chicken Coconut Pepper Soup": "Images/chicken-coconut-pepper-soup.png",
    "Chicken Curry Leaves Soup": "Images/chicken-curry-leaves-soup.png",
    "Coriander Chicken Soup": "Images/coriander-chicken-soup.webp",
    "Cream Of Chicken & Roasted Garlic": "Images/cream-chicken-roasted-garlic-soup.png",
    "Copper Potz Special Soup": "Images/copper-potz-special-soup.jpg",
    "Cream Of Mushroom Soup": "Images/mushroom-soup.webp",
    "Cream Of Veg Soup": "Images/cream-of-veg-soup.webp",
    "Lentil Soup": "Images/lentil-soup.webp",
    "Tomato Soup": "Images/tomato-soup.webp",
    "Veg Clear Soup": "Images/veg-clear-soup.webp",
    "Veg Hot & Sour Soup": "Images/veg-hot-and-sour-soup.webp",
    "Veg Lemon Coriander Soup": "Images/veg-lemon-coriander-soup.webp",
    "Veg Manchow Soup": "Images/veg-manchow-soup.webp",
    "Veg Sweet Corn Soup": "Images/veg-sweet-corn-soup.webp",
    "Chicken Copper Potz Special Soup": "Images/chicken-copper-potz-special-soup.png",
    "Chicken French Onion Soup": "Images/chicken-french-onion-soup.webp",
    "Chicken Hot & Sour Soup": "Images/chicken-hot-and-sour-soup.webp",
    "Chicken Lemon Coriander Soup": "Images/chicken-lemon-coriander-soup.png",
    "Chicken Manchow Soup": "Images/chicken-manchow-soup.webp",
    "Chicken Sweet Corn Soup": "Images/chicken-sweet-corn-soup.png",
    "Clear Chicken Soup": "Images/clear-chicken-soup.webp",
    "Cream Of Chicken Soup": "Images/cream-of-chicken-soup.png",
    "Egg Drop Soup": "Images/egg-drop-soup.webp",
    "Mutton Elumbu Charu": "Images/mutton-elumbu-charu.webp",
    "Sea Food Soup": "Images/seafood-soup.png",
    "Tom Yum Soup": "Images/tom-yum-soup.png",

    // Salads
    "Chicken Ceaser Salad": "Images/chicken-ceaser-salad.jpg",
    "Chicken Caesar Salad": "Images/chicken-caesar-salad.jpg",
    "Coleslaw Salad": "Images/coleslaw-salad.webp",
    "Green Salad": "Images/green-salad.webp",
    "Hawaiian Chicken Salad": "Images/hawaiian-chicken-salad.png",
    "Hawaiian Veg Salad": "Images/hawaiian-veg-salad.png",
    "Mexican Salad": "Images/mexican-salad.png",
    "Russian Salad": "Images/russian-salad.webp",
    "Tandoori Chicken Salad": "Images/tandoori-chicken-salad.webp",

    // Tandoori starters
    "Chicken Cola Urundai": "Images/chicken-cola-urundai.png",
    "Fish Cola Urundai": "Images/fish-cola-urundai.png",
    "Mutton Cola Urundai": "Images/mutton-cola-urundai.png",
    "Paneer Achari Tikka": "Images/paneer-achari-tikka.webp",
    "Paneer Malai Tikka": "Images/paneer-malai-tikka.png",
    "Paneer Tikka": "Images/paneer-tikka.webp",
    "Tandoori Gobi": "Images/tandoori-gobi.png",
    "Tandoori Mushroom": "Images/tandoori-mushroom.png",
    "Veg Tikki": "Images/veg-tikki.png",
    "Achari Fish Tikka": "Images/achari-fish-tikka.webp",
    "Afghani Chicken": "Images/afghani-chicken.webp",
    "Ajwaini Fish Tikka": "Images/ajwaini-fish-tikka.webp",
    "Chicken Cheese Sheek Kabab": "Images/chicken-cheese-sheek-kabab.png",
    "Chicken Seekh Kabab": "Images/chicken-seekh-kabab.webp",
    "Chicken Tikka": "Images/chicken-tikka.webp",
    "Fish Tikka": "Images/fish-tikka.webp",
    "Haryali Kabab": "Images/haryali-kabab.webp",
    "Kalimirchi Kabab": "Images/kalimirchi-kabab.webp",
    "Lasooni Tikka": "Images/lasooni-tikka.webp",
    "Malai Prawn": "Images/malai-prawn.webp",
    "Malai Tikka": "Images/malai-tikka.webp",
    "Mix Tandoori Non Veg Platter": "Images/mix-tandoori-non-veg-platter.png",
    "Murgh Malai Kabab": "Images/murgh-malai-kabab.webp",
    "Mutton Cheese Seekh Kabab": "Images/mutton-cheese-seekh-kabab.webp",
    "Mutton Seekh Kabab": "Images/mutton-seekh-kabab.webp",
    "Prawn Tikka": "Images/prawn-tikka.png",
    "Resmi Kabab": "Images/resmi-kabab.webp",
    "Tandoori Chicken": "Images/tandoori-chicken.webp",
    "Tandoori Prawns": "Images/tandoori-prawns.png",
    "Zafrani Kabab": "Images/zafrani-kabab.webp",

    // Chinese vegetarian starters
    "Baby Corn 65": "Images/baby-corn-65.jpg",
    "Baby Corn Chilli": "Images/baby-corn-chilli.webp",
    "Baby Corn Manchurian": "Images/baby-corn-manchurian.webp",
    "Baby Corn Salt & Pepper": "Images/baby-corn-salt-pepper.webp",
    "Cheese Balls Manchurian": "Images/cheese-balls-manchurian.webp",
    "Dragon Paneer": "Images/dragon-paneer.webp",
    "French Fries": "Images/french-fries.webp",
    "Gobi Chilli": "Images/gobi-chilli.webp",
    "Gobi Manchurian": "Images/gobi-manchurian.webp",
    "Mushroom 65": "Images/mushroom-65.webp",
    "Mushroom Chilli": "Images/mushroom-chilli.webp",
    "Mushroom Manchurian": "Images/mushroom-manchurian.webp",
    "Paneer 65": "Images/paneer-65.webp",
    "Paneer Chilli": "Images/paneer-chilli.webp",
    "Paneer Majestic": "Images/paneer-majestic.webp",
    "Paneer Manchurian": "Images/paneer-manchurian.webp",

    // Chinese non-vegetarian starters
    "Chicken 65": "Images/chicken-65.jpg",
    "Chicken Lolipop ( 6pic )": "Images/chicken-lolipop.webp",
    "Chicken Majestic": "Images/chicken-majestic.webp",
    "Chicken Manchurian": "Images/chicken-manchurian.webp",
    "Chicken Wings": "Images/chicken-wings.webp",
    "Chicken Wings Chilli Garlic": "Images/chicken-wings-chilli-garlic.webp",
    "Chilli Chiken": "Images/chilli-chiken.webp",
    "Dragon Chicken": "Images/dragon-chicken.webp",
    "Lemon Chicken": "Images/lemon-chicken.webp",
    "Schezwan Wings": "Images/schezwan-wings.webp",
    "American Chicken Chop Suey": "Images/american-chicken-chop-suey.webp",
    "Chicken Pepper & Salt": "Images/chicken-pepper-salt.webp",
    "Chinese Chicken Chop Suey": "Images/chinese-chicken-chop-suey.webp",
    "Creamy Cheesy Chicken": "Images/creamy-cheesy-chicken.webp",
    "Crispy Chicken": "Images/crispy-chicken.webp",
    "Garlic Chicken": "Images/garlic-chicken.webp",
    "Ginger Chicken": "Images/ginger-chicken.webp",
    "Honey Chicken": "Images/honey-chicken.webp",
    "Honey Chilli Chicken": "Images/honey-chilli-chicken.webp",
    "Schezwan Chicken": "Images/schezwan-chicken.webp",

    // Mutton, seafood and BBQ
    "Chilli Mutton": "Images/chilli-mutton.png",
    "Lamp Roast": "Images/lamp-roast.webp",
    "Schezwan Lamp": "Images/schezwan-lamp.webp",
    "Apollo Fish": "Images/apollo-fish.jpg",
    "Chilli Fish": "Images/chilli-fish.webp",
    "Chilli Garlic Prawns": "Images/chilli-garlic-prawns.webp",
    "Fish Finger": "Images/fish-finger.webp",
    "Fish Manchurian": "Images/fish-manchurian.webp",
    "Ginger Prawn": "Images/ginger-prawn.webp",
    "Lemon Fish": "Images/lemon-fish.webp",
    "Schezwan Fish": "Images/schezwan-fish.png",
    "Afghani Bbq": "Images/afghani-bbq.png",
    "Al-Faham": "Images/al-faham.webp",
    "Bbq Chicken": "Images/bbq-chicken.webp",
    "Bbq Fish Mixed Jumbo Platters": "Images/bbq-fish-mixed-jumbo-platters.png",
    "Green Pepper Bbq": "Images/green-pepper-bbq.webp",
    "Grill Chicken Full": "Images/grill-chicken-full.webp",
    "Grill Chicken Half": "Images/grill-chicken-half.webp",
    "Pepper Bbq": "Images/pepper-bbq.png",

    // Indian main course
    // Indian Main Course
"Malai Kofta": "Images/malai-kofta.jpg",
"Methi Chaman": "Images/methi-chaman.webp",
"Paneer Lababdar": "Images/paneer-lababdar.webp",
"Veg Diwani Handi": "Images/veg-diwani-handi.webp",
"Veg Kofta": "Images/veg-kofta.webp",

// Indian Vegetarian Gravy
"Malai Khofta": "Images/malai-khofta.webp",
"Paneer Khofta": "Images/paneer-khofta.webp",
"Aloo Gobi Masal": "Images/aloo-gobi-masala.jpg",
"Aloo Mutter": "Images/aloo-mutter.webp",
"Aloo Palak": "Images/aloo-palak.webp",
"Dal Fry": "Images/dal-fry.webp",
"Dal Makhani": "Images/dal-makhani.png",
"Dal Palak": "Images/dal-palak.webp",
"Dal Tadka": "Images/dal-tadka.webp",
"Kadai Mushroom": "Images/kadai-mushroom.webp",
"Kadai Paneer": "Images/kadai-paneer.webp",
"Kadai Veg": "Images/kadai-veg.webp",
"Kaju Masala": "Images/kaju-masala.webp",
"Kaju Paneer Masala": "Images/kaju-paneer-masala.webp",
"Mix Veg Curry": "Images/mix-veg-curry.webp",
"Mixed Veg Kadai": "Images/mixed-veg-kadai.webp",
"Mushroom Butter Masala": "Images/mushroom-butter-masala.webp",
"Mushroom Masala": "Images/mushroom-masala.webp",
"Mutter Paneer": "Images/mutter-paneer.webp",
"Palak Paneer": "Images/palak-paneer.webp",
"Paneer Butter Masala": "Images/paneer-butter-masala.webp",
"Paneer Tikka Masala": "Images/paneer-tikka-masala.webp",
"Shahi Paneer": "Images/shahi-paneer.webp",
"Veg Jaipuri": "Images/veg-jaipuri.webp",
"Veg Kolhapuri": "Images/veg-kolhapuri.png",

// Indian Non Veg Gravy
"Butter Chicken": "Images/butter-chicken.jpg",
"Achari Chicken": "Images/achari-chicken.png",
"Afghani Chicken Masala": "Images/afghani-chicken-masala.webp",
"Butter Chicken Masala": "Images/butter-chicken-masala.webp",
"Chettinad Chicken Masala": "Images/chettinad-chicken-masala.webp",
"Chicken Chatpata": "Images/chicken-chatpata.webp",
"Chicken Curry": "Images/chicken-curry.webp",
"Chicken Kolhapuri": "Images/chicken-kolhapuri.webp",
"Chicken Masala": "Images/chicken-masala.webp",
"Chicken Roast": "Images/chicken-roast.webp",
"Chicken Roast Masala": "Images/chicken-roast-masala.webp",
"Chicken Tikka Masala": "Images/chicken-tikka-masala.webp",
"Kadai Chicken": "Images/kadai-chicken.webp",
"Murgh Malai": "Images/murgh-malai.webp",
"Murgh Masala": "Images/murgh-masala.webp",
"Mutton Roast": "Images/mutton-roast.png",
"Mutton Rogan Josh": "Images/mutton-rogan-josh.webp",
"Pepper Chicken Masala": "Images/pepper-chicken-masala.webp",

// Special Indian Non Veg Gravy
"Chicken Hyderabadi": "Images/chicken-hyderabadi.jpg",
"Chicken Murgh Lababdar": "Images/chicken-murgh-lababdar.webp",
"Methi Chicken": "Images/methi-chicken.webp",
"Punjabi Chicken": "Images/punjabi-chicken.webp",

// Indian Mutton Gravy
"Achari Mutton": "Images/achari-mutton.png",
"Kadai Mutton": "Images/kadai-mutton.webp",
"Methi Mutton": "Images/methi-mutton.png",
"Mutton Chukka": "Images/mutton-chukka.webp",
"Mutton Ghee Roast": "Images/mutton-ghee-roast.webp",
"Mutton Kurma": "Images/mutton-kurma.webp",
"Mutton Masala": "Images/mutton-masala.webp",
"Mutton Pepper Masala": "Images/mutton-pepper-masala.webp",

// Indian Sea Food Gravy
"Achari Fish": "Images/achari-fish.png",
"Fish Curry": "Images/fish-curry.webp",
"Fish Kolhapuri": "Images/fish-kolhapuri.webp",
"Fish Masala": "Images/fish-masala.webp",
"Kadai Fish": "Images/kadai-fish.webp",
"Prawn Curry": "Images/prawn-curry.webp",
"Prawn Masala": "Images/prawn-masala.webp",
"Punjabi Prawn Masala": "Images/punjabi-prawn-masala.webp",

// North Indian
"Chicken Patiala": "Images/chicken-patiala.png",

// South Indian
"Butter Masala Dosa": "Images/butter-masala-dosa.png",
"Combo Break Fast": "Images/combo-break-fast.png",
"Combo Special": "Images/combo-special.png",
"Dosa": "Images/dosa.png",
"Fried Idli": "Images/fried-idli.png",
"Ghee Pongal": "Images/ghee-pongal.png",
"Ghee Roast": "Images/ghee-roast.png",
"Idli": "Images/idli.png",
"Masala Dosa": "Images/masala-dosa.png",
"Mini Idli (Ghee Idli)": "Images/mini-idli-ghee-idli.png",
"Podi Idli": "Images/podi-idli.png",
"Puri Masala": "Images/puri-masala.png",
"Vada": "Images/vada.png",

// Rice & Fried Rice
"Curd Rice": "Images/curd-rice.webp",
"Ghee Rice": "Images/ghee-rice.webp",
"Jeera Rice": "Images/jeera-rice.webp",
"Kaju Fried Rice": "Images/kaju-fried-rice.webp",
"Mushroom Fried Rice": "Images/mushroom-fried-rice.webp",
"Paneer Fried Rice": "Images/paneer-fried-rice.webp",
"Veg Butter Garlic Fried Rice": "Images/veg-butter-garlic-fried-rice.webp",
"Veg Fried Rice": "Images/veg-fried-rice.webp",
"Veg Schezwan Fried Rice": "Images/veg-schezwan-fried-rice.webp",
"Veg Singapore Fried Rice": "Images/veg-singapore-fried-rice.webp",

// Non-Vegetarian Fried Rice
"Chicken Fried Rice": "Images/chicken-fried-rice.jpg",
"Chicken Schezwan Fried Rice": "Images/chicken-schezwan-fried-rice.webp",
"Egg Fried Rice": "Images/egg-fried-rice.webp",
"Kaju Chicken Fried Rice": "Images/kaju-chicken-fried-rice.webp",
"Mix Non Veg Fried Rice": "Images/mix-non-veg-fried-rice.webp",
"Sanghai Chicken Fried Rice": "Images/sanghai-chicken-fried-rice.png",
"Singapore Chicken Fried Rice": "Images/singapore-chicken-fried-rice.webp",

// Indian Breads & Paratha
"Aloo Paratha": "Images/aloo-paratha.jpg",
"Butter Kulcha": "Images/butter-kulcha.webp",
"Butter Naan": "Images/butter-naan.webp",
"Butter Roti": "Images/butter-roti.webp",
"Chappathi": "Images/chappathi.webp",
"Cheese Naan": "Images/cheese-naan.webp",
"Garlic Naan": "Images/garlic-naan.webp",
"Kashmiri Naan": "Images/kashmiri-naan.webp",
"Lacha Paratha": "Images/lacha-paratha.webp",
"Masala Kulcha": "Images/masala-kulcha.webp",
"Methi Paratha": "Images/methi-paratha.webp",
"Murtabak Paratha Chicken": "Images/murtabak-paratha-chicken.webp",
"Murtabak Paratha Mix": "Images/murtabak-paratha-mix.webp",
"Murtabak Paratha Mutton": "Images/murtabak-paratha-mutton.webp",
"Murtabak Paratha Veg": "Images/murtabak-paratha-veg.webp",
"Onion Kulcha": "Images/onion-kulcha.webp",
"Paneer Kulcha": "Images/paneer-kulcha.png",
"Paneer Paratha": "Images/paneer-paratha.webp",
"Parotta": "Images/parotta.webp",
"Phulka": "Images/phulka.webp",
"Plain Naan": "Images/plain-naan.webp",
"Pudina Kulcha": "Images/pudina-kulcha.webp",
"Tandoori Roti": "Images/tandoori-roti.webp",
"Wheat Paratha": "Images/wheat-paratha.webp",

// Vegetarian Biryani & Pulao
"Kaju Biryani": "Images/kaju-biryani.png",
"Kashmiri Pulao": "Images/kashmiri-pulao.png",
"Paneer Biryani": "Images/paneer-biryani.png",
"Veg Briyani": "Images/veg-briyani.webp",
"Veg Pulao": "Images/veg-pulao.png",

// Non Veg Biryani
"Chicken 65 Briyani": "Images/chicken-65-briyani.jpg",
"Chicken Dum Briyani": "Images/chicken-dum-briyani.webp",
"Egg Briyani": "Images/egg-briyani.webp",
"Fish Briyani": "Images/fish-briyani.png",
"Mutton Dum Briyani": "Images/mutton-dum-briyani.webp",
"Prawn Briyani": "Images/prawn-briyani.png",
"Special Combo Briyani": "Images/special-combo-briyani.png",

// Mandhi
"Al-Faham Mandhi": "Images/al-faham-mandhi.png",
"Chicken Mandhi": "Images/chicken-mandhi.webp",
"Mutton Mandhi": "Images/mutton-mandhi.png",

// Noodles Veg & Nonveg
"Chicken Noodles": "Images/chicken-noodles.jpg",
"Chicken Schezwan Noodles": "Images/chicken-schezwan-noodles.webp",
"Chilli Garlic Chicken Noodles": "Images/chilli-garlic-chicken-noodles.webp",
"Egg Soft Noodles": "Images/egg-soft-noodles.webp",
"Hakka Noodles Nonveg": "Images/hakka-noodles-nonveg.webp",
"Hakka Noodles Veg": "Images/hakka-noodles-veg.webp",
"Singapore Chicken Noodles": "Images/singapore-chicken-noodles.webp",
"Veg Soft Noodles": "Images/veg-soft-noodles.webp",

// Veg Pasta
"Mix Veg Pasta": "Images/mix-veg-pasta.webp",
"Mushroom Pasta": "Images/mushroom-pasta.webp",
"Paneer Pasta": "Images/paneer-pasta.webp",
"Paneer Pasta Red Sauce": "Images/paneer-pasta-red-sauce.webp",
"Paneer Pasta White Sauce": "Images/paneer-pasta-white-sauce.webp",
"Spinach Pasta": "Images/spinach-pasta.webp",

// Non Veg Pasta
"Bbq Pasta": "Images/bbq-pasta.webp",
"Carbonara Pasta Chicken": "Images/carbonara-pasta-chicken.webp",
"Carbonara Pasta Mutton": "Images/carbonara-pasta-mutton.webp",
"Chicken Pasta": "Images/chicken-pasta.webp",
"Mix Sauce Pasta": "Images/mix-sauce-pasta.webp",
"Penne Arrabbiata": "Images/penne-arrabbiata.webp",
"Spaghetti Bolognese": "Images/spaghetti-bolognese.webp",

// Sandwich
"Grilled Chicken Cheese Sandwich": "Images/grilled-chicken-cheese-sandwich.webp",
"Grilled Chicken Combo Sandwich / Lemon Juice & Veg Salad": "Images/grilled-chicken-combo-sandwich-lemon-juice-veg-salad.webp",
"Grilled Chicken Sandwich": "Images/grilled-chicken-sandwich.webp",
"Grilled Coleslaw Sandwich": "Images/grilled-coleslaw-sandwich.webp",
"Grilled Double Egg Cheese Sandwich": "Images/grilled-double-egg-cheese-sandwich.webp",
"Grilled Double Egg Sandwich": "Images/grilled-double-egg-sandwich.webp",
"Grilled Egg Cheese Sandwich": "Images/grilled-egg-cheese-sandwich.webp",
"Grilled Egg Sandwich": "Images/grilled-egg-sandwich.webp",
"Grilled Veg Cheese Sandwich": "Images/grilled-veg-cheese-sandwich.webp",
"Grilled Veg Sandwich": "Images/grilled-veg-sandwich.webp",

// Chaat
"Bhel Puri": "Images/bhel-puri.webp",
"Dahi Kachori": "Images/dahi-kachori.webp",
"Dahi Papadi Chaat": "Images/dahi-papadi-chaat.webp",
"Dahi Puri": "Images/dahi-puri.webp",
"Masala Puri": "Images/masala-puri.webp",
"Pani Puri": "Images/pani-puri.webp",
"Papadi Chaat": "Images/papadi-chaat.webp",
"Samosa Chaat": "Images/samosa-chaat.webp",
"Sev Puri": "Images/sev-puri.webp",

// Sweet
"Bhadusa": "Images/bhadusa.webp",
"Chandra Kala": "Images/chandra-kala.webp",
"Gulab Jamun": "Images/gulab-jamun.webp",
"Mottisur Laddu": "Images/mottisur-laddu.webp",

// Ice Cream
"Black Current Ice Cream": "Images/black-current-ice-cream.webp",
"Chocolate Ice Cream": "Images/chocolate-ice-cream.webp",
"Jack Fruit Ice Cream": "Images/jack-fruit-ice-cream.webp",
"Mango Ice Cream": "Images/mango-ice-cream.webp",
"Pista Ice Cream": "Images/pista-ice-cream.webp",
"Spanish Ice Cream": "Images/spanish-ice-cream.webp",
"Strawberry Ice Cream": "Images/strawberry-ice-cream.webp",
"Tender Coconut Ice Cream": "Images/tender-coconut-ice-cream.webp",
"Vanilla Ice Cream": "Images/vanilla-ice-cream.webp",

// Cold Coffee & Fruit Salad
"Cold Coffee": "Images/cold-coffee.webp",
"Custard Fruit Salad": "Images/custard-fruit-salad.webp",
"Fresh Cream Cold Coffee": "Images/fresh-cream-cold-coffee.webp",
"Fresh Creamy Fruit Salad": "Images/fresh-creamy-fruit-salad.webp",
"Fruit Salad": "Images/fruit-salad.webp",
"Fruit Salad With Ice Cream": "Images/fruit-salad-with-ice-cream.webp",
"Jelly Fruit Salad": "Images/jelly-fruit-salad.webp",
"Jelly Fruit Salad With Ice Cream": "Images/jelly-fruit-salad-with-ice-cream.png",

// Falooda
"Fruit Falooda": "Images/fruit-falooda.png",
"Normal Falooda": "Images/normal-falooda.png",
"Nuts Falooda": "Images/nuts-falooda.png",
"Oreo Falooda": "Images/oreo-falooda.png",
"Royal Falooda": "Images/royal-falooda.png",

// Jigar Thanda
"Chocolate Jigar Thanda": "Images/chocolate-jigar-thanda.png",
"Pista Jigar Thanda": "Images/pista-jigar-thanda.png",
"Strawberry Jigar Thanda": "Images/strawberry-jigar-thanda.png",

// Milk Shake
"Apple Milk Shake": "Images/apple-milk-shake.png",
"Badam Milk Shake": "Images/badam-milk-shake.png",
"Banana Milk Shake": "Images/banana-milk-shake.png",
"Black Current Milk Shake": "Images/black-current-milk-shake.png",
"Blueberry Milk Shake": "Images/blueberry-milk-shake.png",
"Brownie Milk Shake": "Images/brownie-milk-shake.png",
"Chickoo Milk Shake": "Images/chickoo-milk-shake.png",
"Chocolate Milk Shake": "Images/chocolate-milk-shake.png",
"Chocolate Sharjah Milk Shake": "Images/chocolate-sharjah-milk-shake.png",
"Dates Milk Shake": "Images/dates-milk-shake.png",
"Jack Fruit Milk Shake": "Images/jack-fruit-milk-shake.png",
"Mango Milk Shake": "Images/mango-milk-shake.png",
"Mango Sharjah Milk Shake": "Images/mango-sharjah-milk-shake.png",
"Oreo Milk Shake": "Images/oreo-milk-shake.png",
"Papaya Milk Shake": "Images/papaya-milk-shake.png",
"Pista Milk Shake": "Images/pista-milk-shake.png",
"Srawberry Milk Shake": "Images/srawberry-milk-shake.png",
"Tender Coconut Milk Shake": "Images/tender-coconut-milk-shake.png",
"Vanilla Milk Shake": "Images/vanilla-milk-shake.png",

// Lassi
"Banana Lassi": "Images/banana-lassi.png",
"Mango Lassi": "Images/mango-lassi.png",
"Strawberry Lassi": "Images/strawberry-lassi.png",
"Sweet Lassi": "Images/sweet-lassi.png",

// Mojitos
"Blue Lagoon": "Images/blue-lagoon.png",
"Blue Mojito": "Images/blue-mojito.png",
"Green Apple Mojito": "Images/green-apple-mojito.png",
"Lemon Mint Mojito": "Images/lemon-mint-mojito.png",
"Pine Apple Mojito": "Images/pine-apple-mojito.png",
"Strawberry Mojito": "Images/strawberry-mojito.png",
"Virgin Blue Mojito": "Images/virgin-blue-mojito.png",
"Water Melon Mojito": "Images/water-melon-mojito.png",

// Mocktail
"Strawberry Mocktail": "Images/strawberry-mocktail.png",
"Tangy Jamun Mocktail": "Images/tangy-jamun-mocktail.png",
"Tangy Mango Mocktail": "Images/tangy-mango-mocktail.png",
"Tangy Pine Apple Mocktail": "Images/tangy-pine-apple-mocktail.png",

// Special Mocktail
"Coke Ice Mocktail": "Images/coke-ice-mocktail.png",
"Kiwi Mocktail": "Images/kiwi-mocktail.png",
"Rainbow Mocktail": "Images/rainbow-mocktail.png",
"Rose Gulkand Mocktail": "Images/rose-gulkand-mocktail.png",
"Sunset Mocktail": "Images/sunset-mocktail.png",
  };

  // Use explicit mapping or derive a filename from the dish name.
  function getDishImage(name) {
    if (dishImages[name]) return dishImages[name];

    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `Images/${slug}.webp`;
  }

  // Hide broken images instead of displaying a wrong dish or category banner.
  function handleImageError(img) {
    img.addEventListener("error", () => {
      img.hidden = true;
      img.removeAttribute("src");
    }, { once: true });
  }

  // Category navigation
  links.forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start"
      });

      links.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      history.replaceState(null, "", href);
    });
  });

  // Set the category banner background only on the heading.
  document.querySelectorAll(".menu-category").forEach(section => {
    const heading = section.querySelector(".menu-category-heading");
    const bannerImage = heading?.querySelector(".menu-category-image");

    if (heading && bannerImage) {
      heading.style.setProperty(
        "--category-photo",
        `url("${bannerImage.getAttribute("src")}")`
      );
      bannerImage.alt ||= "Copper Potz menu category";
    }
  });

  // Build a featured image on the left and thumbnail list on the right.
  document.querySelectorAll(".menu-category .menu-subcategory").forEach(subcategory => {
    if (subcategory.dataset.featureLayoutBuilt === "true") return;

    const heading = subcategory.querySelector(":scope > h3");
    const menuList = subcategory.querySelector(":scope > .menu-list");
    if (!heading || !menuList) return;

    const dishes = [...menuList.querySelectorAll(":scope > article")];
    if (!dishes.length) return;

    const layout = document.createElement("div");
    layout.className = "menu-feature-content";

    // Featured dish panel (first dish)
    const featureDish = dishes[0];
    const featureName = featureDish.querySelector("h4")?.textContent.trim() || "Featured Dish";
    const featurePrice = featureDish.querySelector("strong")?.textContent.trim() || "";
    const featureTag = featureDish.querySelector(".food-tag")?.cloneNode(true);

    const featurePanel = document.createElement("div");
    featurePanel.className = "menu-feature-image";

    const featureImg = document.createElement("img");
    featureImg.className = "menu-feature-photo";
    featureImg.src = getDishImage(featureName);
    featureImg.alt = featureName;
    featureImg.loading = "lazy";
    handleImageError(featureImg);

    const caption = document.createElement("div");
    caption.className = "menu-feature-caption";

    const kicker = document.createElement("span");
    kicker.textContent = "COPPER POTZ FAVOURITE";

    const title = document.createElement("h4");
    title.textContent = featureName;

    const price = document.createElement("strong");
    price.textContent = featurePrice;

    caption.append(kicker, title);
    if (featureTag) caption.append(featureTag);
    caption.append(price);
    featurePanel.append(featureImg, caption);

    // Remaining dishes: every row gets its own image.
    const listPanel = document.createElement("div");
    listPanel.className = "menu-feature-list";

    dishes.slice(1).forEach(dish => {
      const name = dish.querySelector("h4")?.textContent.trim() || "Dish";

      let thumb = dish.querySelector(".dish-thumb");
      if (!thumb) {
        thumb = document.createElement("img");
        thumb.className = "dish-thumb";
        dish.prepend(thumb);
      }

      thumb.src = getDishImage(name);
      thumb.alt = name;
      thumb.loading = "lazy";
      handleImageError(thumb);

      listPanel.appendChild(dish);
    });

    layout.append(featurePanel, listPanel);
    menuList.replaceWith(layout);
    subcategory.dataset.featureLayoutBuilt = "true";
  });
});
