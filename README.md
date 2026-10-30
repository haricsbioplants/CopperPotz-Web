
# CopperPotz-Web

Official website for Copper Potz Cafe & Restaurant.

## Pages

- `public/index.html` — Home
- `public/menu.html` — Menu
- `public/about.html` — Our story
- `public/reservation.html` — Table reservation request
- `public/contact.html` — Contact form
- `public/banquet.html` — Banquet hall and event enquiries

## Project Structure

```text
CopperPotz-Web/
├── public/
│   ├── Images/
│   ├── index.html
│   ├── menu.html
│   ├── about.html
│   ├── reservation.html
│   ├── contact.html
│   ├── banquet.html
│   ├── styles.css
│   ├── site.js
│   ├── banquet.css
│   ├── banquet.js
│   └── email-config.js
└── README.md
```

## Run Locally

1. Open the project folder in VS Code.
2. Open `public/index.html` using the Live Server extension.
3. Visit the local website in your browser.

## Email Integration

The website uses EmailJS to handle form submissions without requiring a custom backend server.

The following forms are supported:

- **Reservation Form** — Sends table reservation requests.
- **Contact Form** — Sends general customer enquiries.
- **Banquet Form** — Sends banquet and event enquiries.

### EmailJS Configuration

Update `public/email-config.js` with your EmailJS account details:

- Public Key
- Service ID
- Reservation Template ID
- Contact Template ID
- Banquet Template ID

### EmailJS SDK

The EmailJS browser SDK is loaded through its CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@5/dist/email.min.js"></script>
```

Load the configuration before the form handling JavaScript.

```html
<script src="./email-config.js"></script>
<script src="./site.js"></script>
```

For the banquet page, load `banquet.js` instead of `site.js`.

## Security

- Use only the EmailJS public key in frontend JavaScript.
- Never expose private keys, passwords or other account credentials.
- Configure email templates and authorized sending services through the EmailJS dashboard.
- Enable appropriate spam protection and monitor email usage.

## Reservation Disclaimer

Submitting a reservation form does not automatically confirm table availability. The restaurant team will contact the customer to confirm the reservation.

## Before Publishing

- Verify EmailJS account and email service.
- Configure all three email templates.
- Test reservation, contact and banquet forms.
- Verify restaurant address, phone number and opening hours.
- Check all navigation links and images.
- Test responsive layouts on mobile, tablet and desktop.
- Verify SEO metadata and sitemap.
- Test the website on Chrome, Safari and other supported browsers.

## Website

https://copperpotz.com/
```

**Important:** This README assumes we're proceeding with EmailJS, not Resend. If your project still contains a Node.js backend or Resend implementation, don't delete those files until we've checked the actual project.