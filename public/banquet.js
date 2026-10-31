
/* ==========================================
   COPPER POTZ - BANQUET ENQUIRY FORM
   EmailJS Integration
========================================== */

/* ==========================================
   3. BANQUET ENQUIRY FORM
========================================== */


const banquetForm = document.querySelector("#banquet-form");

if (banquetForm) {
    const submitButton = banquetForm.querySelector("#banquet-submit");
    const buttonLabel = banquetForm.querySelector("#banquet-button-label");
    const status = banquetForm.querySelector("#banquet-status");

    banquetForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        await sendCopperPotzEmail({
            form: banquetForm,
            submitButton,
            buttonLabel,
            status,
            templateId: EMAIL_CONFIG.templates.contact,
            enquiryType: "Banquet Enquiry",
            successMessage:
                "Thank you! Your banquet enquiry has been sent successfully. Our team will contact you shortly."
        });
    });
}



/* ==========================================
   COPPER POTZ - BANQUET HALL ENQUIRY
   FORMSUBMIT INTEGRATION
========================================== */

// const banquetForm = document.querySelector("#banquet-form");

// if (banquetForm) {
//     const submitButton = banquetForm.querySelector("#banquet-submit");
//     const buttonLabel = banquetForm.querySelector("#banquet-button-label");
//     const status = banquetForm.querySelector("#banquet-status");

//     const originalLabel = buttonLabel.textContent;

//     banquetForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         // Validate form
//         if (!banquetForm.checkValidity()) {
//             banquetForm.reportValidity();
//             return;
//         }

//         // Prevent duplicate submissions
//         if (submitButton.disabled) return;

//         submitButton.disabled = true;
//         buttonLabel.textContent = "Sending...";
//         status.textContent = "";
//         status.style.color = "#ffd0c9";

//         try {
//             const formData = new FormData(banquetForm);
//             const payload = new URLSearchParams();

//             for (const [key, value] of formData.entries()) {
//                 payload.append(key, value);
//             }

//             payload.append(
//                 "_subject",
//                 `Copper Potz - Banquet Hall Enquiry - ${new Date().toLocaleString("en-IN")}`
//             );

//             payload.append("_template", "table");

//             const response = await fetch(
//                 "https://formsubmit.co/ajax/copperpotz24@gmail.com",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Accept": "application/json"
//                     },
//                     body: payload
//                 }
//             );

//             const result = await response.json();

//             console.log(
//                 "Banquet enquiry response:",
//                 response.status,
//                 result
//             );

//             if (
//                 !response.ok ||
//                 String(result.success) !== "true"
//             ) {
//                 throw new Error(
//                     result.message || "Unable to send your banquet enquiry."
//                 );
//             }

//             status.style.color = "#bfe9ca";
//             status.textContent =
//                 "Thank you! Your banquet enquiry has been sent successfully. Our team will contact you soon.";

//             banquetForm.reset();

//         } catch (error) {
//             console.error("Banquet enquiry error:", error);

//             status.style.color = "#ffd0c9";
//             status.textContent =
//                 "We couldn't confirm submission. Please check your email before trying again, as your enquiry may still have been delivered.";

//         } finally {
//             submitButton.disabled = false;
//             buttonLabel.textContent = originalLabel;
//         }
//     });
// }
