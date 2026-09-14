document.addEventListener("DOMContentLoaded", function () {

    const parameters = new URLSearchParams(window.location.search);

    const firstName = parameters.get("firstName");
    const lastName = parameters.get("lastName");
    const address = parameters.get("address");
    const city = parameters.get("city");
    const state = parameters.get("state");
    const zip = parameters.get("zip");
    const phone = parameters.get("phone");
    const email = parameters.get("email");
    const birthdate = parameters.get("birthdate");
    const message = parameters.get("message");

    function displayValue(id, value) {
        document.getElementById(id).textContent = value || "Not provided";
    }

    displayValue("confirmFirstName", firstName);
    displayValue("confirmLastName", lastName);
    displayValue("confirmAddress", address);
    displayValue("confirmCity", city);
    displayValue("confirmState", state);
    displayValue("confirmZip", zip);
    displayValue("confirmPhone", phone);
    displayValue("confirmEmail", email);
    displayValue("confirmBirthdate", birthdate);
    displayValue("confirmMessage", message);

    const editButton = document.getElementById("editButton");
    const confirmButton = document.getElementById("confirmButton");
    const confirmationStatus = document.getElementById("confirmationStatus");

    editButton.addEventListener("click", function () {
        window.history.back();
    });

    confirmButton.addEventListener("click", function () {

        const subject = "COP4813 Assignment 3 Form Submission";

        const body =
            "Name: " + firstName + " " + lastName + "\n\n" +
            "Address: " + address + "\n" +
            city + ", " + state + " " + zip + "\n\n" +
            "Phone: " + phone + "\n\n" +
            "Email: " + email + "\n\n" +
            "Birth Date: " + birthdate + "\n\n" +
            "Message:\n" + message;

        const mailtoLink =
            "mailto:aleister_pham@daytonastate.edu" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        confirmationStatus.textContent =
            "Opening your email application...";

        window.location.href = mailtoLink;
    });

});