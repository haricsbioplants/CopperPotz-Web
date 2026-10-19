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




document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-nav a[href^='#']");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Map each dish name to its own image in public/Images/
  const dishImages = {
    // Soups & Salads
    // Soups
"Chicken Coconut Pepper Soup": "Images/chicken-coconut-pepper-soup.jpg",
"Chicken Curry Leaves Soup": "Images/chicken-curry-leaves-soup.jpg",
"Coriander Chicken Soup": "Images/coriander-chicken-soup.webp",
"Cream Of Chicken & Roasted Garlic": "Images/cream-chicken-roasted-garlic-soup.webp",

// Chinese Veg Soups
"Copper Potz Special Soup": "Images/copper-potz-special-soup.webp",
"Cream Of Mushroom Soup": "Images/mushroom-soup.webp",
"Cream Of Veg Soup": "Images/cream-of-veg-soup.webp",
"Lentil Soup": "Images/lentil-soup.webp",
"Tomato Soup": "Images/tomato-soup.webp",
"Veg Clear Soup": "Images/veg-clear-soup.webp",
"Veg Hot & Sour Soup": "Images/veg-hot-and-sour-soup.webp",
"Veg Lemon Coriander Soup": "Images/veg-lemon-coriander-soup.webp",
"Veg Manchow Soup": "Images/veg-manchow-soup.webp",
"Veg Sweet Corn Soup": "Images/veg-sweet-corn-soup.webp",

// Chinese Non Veg Soup
"Chicken Copper Potz Special Soup": "Images/chicken-copper-potz-special-soup.webp",
"Chicken French Onion Soup": "Images/chicken-french-onion-soup.webp",
"Chicken Hot & Sour Soup": "Images/chicken-hot-and-sour-soup.webp",
"Chicken Lemon Coriander Soup": "Images/chicken-lemon-coriander-soup.webp",
"Chicken Manchow Soup": "Images/chicken-manchow-soup.webp",
"Chicken Sweet Corn Soup": "Images/chicken-sweet-corn-soup.webp",
"Clear Chicken Soup": "Images/clear-chicken-soup.webp",
"Cream Of Chicken Soup": "Images/cream-of-chicken-soup.webp",
"Egg Drop Soup": "Images/egg-drop-soup.webp",
"Mutton Elumbu Charu": "Images/mutton-elumbu-charu.webp",
"Sea Food Soup": "Images/seafood-soup.webp",
"Tom Yum Soup": "Images/tom-yum-soup.webp",

// Salad
"Chicken Ceaser Salad": "Images/chicken-ceaser-salad.webp",
"Coleslaw Salad": "Images/coleslaw-salad.webp",
"Green Salad": "Images/green-salad.webp",
"Hawaiian Chicken Salad": "Images/hawaiian-chicken-salad.webp",
"Hawaiian Veg Salad": "Images/hawaiian-veg-salad.webp",
"Mexican Salad": "Images/mexican-salad.webp",
"Russian Salad": "Images/russian-salad.webp",
"Tandoori Chicken Salad": "Images/tandoori-chicken-salad.webp",

    // Cola Urundai
"Chicken Cola Urundai": "Images/chicken-cola-urundai.webp",
"Fish Cola Urundai": "Images/fish-cola-urundai.webp",
"Mutton Cola Urundai": "Images/mutton-cola-urundai.webp",

// Tandoori Veg Starters
"Paneer Achari Tikka": "Images/paneer-achari-tikka.webp",
"Paneer Malai Tikka": "Images/paneer-malai-tikka.webp",
"Paneer Tikka": "Images/paneer-tikka.webp",
"Tandoori Gobi": "Images/tandoori-gobi.webp",
"Tandoori Mushroom": "Images/tandoori-mushroom.webp",
"Veg Tikki": "Images/veg-tikki.webp",

// Tandoori Non Veg Starters
"Achari Fish Tikka": "Images/achari-fish-tikka.webp",
"Afghani Chicken": "Images/afghani-chicken.webp",
"Ajwaini Fish Tikka": "Images/ajwaini-fish-tikka.webp",
"Chicken Cheese Sheek Kabab": "Images/chicken-cheese-sheek-kabab.webp",
"Chicken Seekh Kabab": "Images/chicken-seekh-kabab.webp",
"Chicken Tikka": "Images/chicken-tikka.webp",
"Fish Tikka": "Images/fish-tikka.webp",
"Haryali Kabab": "Images/haryali-kabab.webp",
"Kalimirchi Kabab": "Images/kalimirchi-kabab.webp",
"Lasooni Tikka": "Images/lasooni-tikka.webp",
"Malai Prawn": "Images/malai-prawn.webp",
"Malai Tikka": "Images/malai-tikka.webp",
"Mix Tandoori Non Veg Platter": "Images/mix-tandoori-non-veg-platter.webp",
"Murgh Malai Kabab": "Images/murgh-malai-kabab.webp",
"Mutton Cheese Seekh Kabab": "Images/mutton-cheese-seekh-kabab.webp",
"Mutton Seekh Kabab": "Images/mutton-seekh-kabab.webp",
"Prawn Tikka": "Images/prawn-tikka.webp",
"Resmi Kabab": "Images/resmi-kabab.webp",
"Tandoori Chicken": "Images/tandoori-chicken.webp",
"Tandoori Prawns": "Images/tandoori-prawns.webp",
"Zafrani Kabab": "Images/zafrani-kabab.webp",

// Chinese Veg Starters
"Baby Corn 65": "Images/baby-corn-65.webp",
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

// Chinese Non Veg Starters
"Chicken 65": "Images/chicken-65.webp",
"Chicken Lolipop ( 6pic )": "Images/chicken-lolipop.webp",
"Chicken Majestic": "Images/chicken-majestic.webp",
"Chicken Manchurian": "Images/chicken-manchurian.webp",
"Chicken Wings": "Images/chicken-wings.webp",
"Chicken Wings Chilli Garlic": "Images/chicken-wings-chilli-garlic.webp",
"Chilli Chiken": "Images/chilli-chiken.webp",
"Dragon Chicken": "Images/dragon-chicken.webp",
"Lemon Chicken": "Images/lemon-chicken.webp",
"Schezwan Wings": "Images/schezwan-wings.webp",

// Special Chinese Non Veg Starters
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

// Special Chinese Mutton Starters
"Chilli Mutton": "Images/chilli-mutton.webp",
"Lamp Roast": "Images/lamp-roast.webp",
"Schezwan Lamp": "Images/schezwan-lamp.webp",

// Sea Food Starters
"Apollo Fish": "Images/apollo-fish.webp",
"Chilli Fish": "Images/chilli-fish.webp",
"Chilli Garlic Prawns": "Images/chilli-garlic-prawns.webp",
"Fish Finger": "Images/fish-finger.webp",
"Fish Manchurian": "Images/fish-manchurian.webp",
"Ginger Prawn": "Images/ginger-prawn.webp",
"Lemon Fish": "Images/lemon-fish.webp",
"Schezwan Fish": "Images/schezwan-fish.webp",

// BBQ Starters
"Afghani Bbq": "Images/afghani-bbq.webp",
"Al-Faham": "Images/al-faham.webp",
"Bbq Chicken": "Images/bbq-chicken.webp",
"Bbq Fish Mixed Jumbo Platters": "Images/bbq-fish-mixed-jumbo-platters.webp",
"Green Pepper Bbq": "Images/green-pepper-bbq.webp",
"Grill Chicken Full": "Images/grill-chicken-full.webp",
"Grill Chicken Half": "Images/grill-chicken-half.webp",
"Pepper Bbq": "Images/pepper-bbq.webp",

    // Indian Main Course
    "Malai Kofta": "Images/malai-kofta.jpg",
    "Methi Chaman": "Images/methi-chaman.jpg",
    "Paneer Lababdar": "Images/paneer-lababdar.jpg",
    "Veg Diwani Handi": "Images/veg-diwani-handi.jpg",
    "Veg Koffta": "Images/veg-kofta.jpg",
    "Veg Kofta": "Images/veg-kofta.jpg",
    "Paneer Khosfta": "Images/paneer-khofta.jpg",
    "Paneer Khaofta": "Images/paneer-khofta.jpg",
    "Aloo Gobi Masal": "Images/aloo-gobi-masala.jpg",
    "Aloo Mutter": "Images/aloo-mutter.jpg"
  };

  // Return the image for a dish, or a placeholder if no mapping exists.
  function getDishImage(name) {
    return dishImages[name] || "Images/food-placeholder.jpg";
  }

  // Prevent broken image icons if an image file is missing.
  function addImageFallback(img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = "Images/food-placeholder.jpg";
    };
  }

  // Category navigation
  links.forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start"
      });

      links.forEach(item => item.classList.remove("active"));
      link.classList.add("active");

      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  // Build featured cards and individual dish thumbnails
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

    const dishItems = [...section.querySelectorAll(".menu-list article")];

    if (!dishItems.length) return;

    // Avoid creating duplicate featured cards if the script runs again.
    let featured = heading?.nextElementSibling;

    if (heading && !featured?.classList.contains("featured-dishes")) {
      featured = document.createElement("div");
      featured.className = "featured-dishes";
      featured.setAttribute("aria-label", "Featured dishes");

      dishItems.slice(0, 3).forEach(item => {
        const name = item.querySelector("h4")?.textContent.trim() || "Dish";
        const price = item.querySelector("strong")?.textContent.trim() || "";
        const tag = item.querySelector(".food-tag");

        const card = document.createElement("article");
        card.className = "featured-dish-card";

        const img = document.createElement("img");
        img.src = getDishImage(name);
        img.alt = name;
        img.loading = "lazy";
        addImageFallback(img);

        const info = document.createElement("div");
        info.className = "featured-dish-info";

        const title = document.createElement("h4");
        title.textContent = name;

        const priceElement = document.createElement("strong");
        priceElement.textContent = price;

        info.append(title, priceElement);

        if (tag) {
          info.append(tag.cloneNode(true));
        }

        card.append(img, info);
        featured.append(card);
      });

      heading.insertAdjacentElement("afterend", featured);
    }

    // Add the correct image to each dish row.
    dishItems.forEach(item => {
      const name = item.querySelector("h4")?.textContent.trim() || "Dish";
      let img = item.querySelector(".dish-thumb");

      if (!img) {
        img = document.createElement("img");
        img.className = "dish-thumb";
        item.prepend(img);
      }

      img.src = getDishImage(name);
      img.alt = name;
      img.loading = "lazy";
      addImageFallback(img);
    });
  });
});
