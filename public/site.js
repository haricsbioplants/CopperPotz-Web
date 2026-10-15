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
