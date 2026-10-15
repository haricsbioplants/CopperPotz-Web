# Saffron & Stone — Multi-page Restaurant Website

## Pages
- `public/index.html` — Home
- `public/menu.html` — Menu
- `public/about.html` — Our story
- `public/reservation.html` — Table reservation request form
- `public/contact.html` — Contact form

## Run locally
1. Install Node.js 18+.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and enter your Resend API key and recipient email.
5. Run `npm start`.
6. Open http://localhost:3000.

The project includes separate `/api/contact` and `/api/reservation` endpoints and sends branded HTML emails through Resend. It does not automatically confirm table availability. Update sample restaurant details, prices, address, and hours before publishing. Keep the API key in `.env`; never place it in frontend JavaScript. For production, verify your sender domain and add rate limiting/spam protection.
