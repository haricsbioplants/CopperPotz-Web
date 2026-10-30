// Copper Potz - EmailJS Configuration

const EMAIL_CONFIG = {
    publicKey: "YOUR_PUBLIC_KEY",
    serviceId: "YOUR_SERVICE_ID",

    templates: {
        reservation: "YOUR_RESERVATION_TEMPLATE_ID",
        contact: "YOUR_CONTACT_TEMPLATE_ID",
        banquet: "YOUR_BANQUET_TEMPLATE_ID"
    }
};

// Initialize EmailJS when the SDK is available
if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: EMAIL_CONFIG.publicKey
    });
}