
/* ==========================================
   COPPER POTZ - BANQUET ENQUIRY FORM
   EmailJS Integration
========================================== */

// const banquetForm = document.querySelector("#banquet-form");

// if (banquetForm) {
//     const submitButton = banquetForm.querySelector("#banquet-submit");
//     const buttonLabel = banquetForm.querySelector("#banquet-button-label");
//     const status = banquetForm.querySelector("#banquet-status");

//     const originalLabel = buttonLabel?.textContent || "Send Enquiry";

//     banquetForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         // Validate form
//         if (!banquetForm.checkValidity()) {
//             banquetForm.reportValidity();
//             return;
//         }

//         // Prevent duplicate submissions
//         if (submitButton.disabled) return;

//         // Check EmailJS configuration
//         if (
//             typeof emailjs === "undefined" ||
//             typeof EMAIL_CONFIG === "undefined"
//         ) {
//             status.textContent =
//                 "Email service is not available. Please try again later.";
//             status.style.color = "#ffd0c9";
//             return;
//         }

//         submitButton.disabled = true;
//         if (buttonLabel) buttonLabel.textContent = "Sending...";

//         status.textContent = "";
//         status.style.color = "#ffd0c9";

//         try {
//             const formData = new FormData(banquetForm);

//             const templateParams = Object.fromEntries(
//                 formData.entries()
//             );

//             templateParams.submission_date =
//                 new Date().toLocaleString("en-IN");

//             const response = await emailjs.send(
//                 EMAIL_CONFIG.serviceId,
//                 EMAIL_CONFIG.templates.banquet,
//                 templateParams
//             );

//             console.log("Banquet EmailJS response:", response);

//             status.style.color = "#bfe9ca";
//             status.textContent =
//                 "Thank you! Your banquet enquiry has been sent successfully. Our team will contact you soon.";

//             banquetForm.reset();

//         } catch (error) {
//             console.error("Banquet enquiry error:", error);

//             status.style.color = "#ffd0c9";
//             status.textContent =
//                 "We couldn't send your enquiry. Please try again or contact the restaurant directly.";

//         } finally {
//             submitButton.disabled = false;

//             if (buttonLabel) {
//                 buttonLabel.textContent = originalLabel;
//             }
//         }
//     });
// }


/* ==========================================
   COPPER POTZ - BANQUET HALL ENQUIRY
   FORMSUBMIT INTEGRATION
========================================== */

const banquetForm = document.querySelector("#banquet-form");

if (banquetForm) {
    const submitButton = banquetForm.querySelector("#banquet-submit");
    const buttonLabel = banquetForm.querySelector("#banquet-button-label");
    const status = banquetForm.querySelector("#banquet-status");

    const originalLabel = buttonLabel.textContent;

    banquetForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Validate form
        if (!banquetForm.checkValidity()) {
            banquetForm.reportValidity();
            return;
        }

        // Prevent duplicate submissions
        if (submitButton.disabled) return;

        submitButton.disabled = true;
        buttonLabel.textContent = "Sending...";
        status.textContent = "";
        status.style.color = "#ffd0c9";

        try {
            const formData = new FormData(banquetForm);
            const payload = new URLSearchParams();

            for (const [key, value] of formData.entries()) {
                payload.append(key, value);
            }

            payload.append(
                "_subject",
                `Copper Potz - Banquet Hall Enquiry - ${new Date().toLocaleString("en-IN")}`
            );

            payload.append("_template", "table");

            const response = await fetch(
                "https://formsubmit.co/ajax/copperpotz24@gmail.com",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: payload
                }
            );

            const result = await response.json();

            console.log(
                "Banquet enquiry response:",
                response.status,
                result
            );

            if (
                !response.ok ||
                String(result.success) !== "true"
            ) {
                throw new Error(
                    result.message || "Unable to send your banquet enquiry."
                );
            }

            status.style.color = "#bfe9ca";
            status.textContent =
                "Thank you! Your banquet enquiry has been sent successfully. Our team will contact you soon.";

            banquetForm.reset();

        } catch (error) {
            console.error("Banquet enquiry error:", error);

            status.style.color = "#ffd0c9";
            status.textContent =
                "We couldn't confirm submission. Please check your email before trying again, as your enquiry may still have been delivered.";

        } finally {
            submitButton.disabled = false;
            buttonLabel.textContent = originalLabel;
        }
    });
}
