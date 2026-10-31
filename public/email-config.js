// Copper Potz - EmailJS Configuration

const EMAIL_CONFIG = {
    publicKey: "a2iDrqKK--tss4Nxk",
    serviceId: "service_lyxbu64",

    templates: {
        reservation: "template_camktgc",
        contact: "template_r8wnyod",
        banquet: "template_on1dxkv"
    }
};

// Initialize EmailJS when the SDK is available
if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: EMAIL_CONFIG.publicKey
    });
}