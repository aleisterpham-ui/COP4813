document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const zip = document.getElementById("zip");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const birthdate = document.getElementById("birthdate");
    const message = document.getElementById("message");
    const confirm = document.getElementById("confirm");


    // ---------------------------------------
    // Do not allow a future birth date
    // ---------------------------------------

    const today = new Date();

    const todayFormatted =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    birthdate.max = todayFormatted;


    // ---------------------------------------
    // Automatically format phone number
    // as (000)000-0000
    // ---------------------------------------

    phone.addEventListener("input", function () {

        let digits = phone.value.replace(/\D/g, "");

        digits = digits.substring(0, 10);

        if (digits.length === 0) {

            phone.value = "";

        } else if (digits.length <= 3) {

            phone.value = "(" + digits;

        } else if (digits.length <= 6) {

            phone.value =
                "(" +
                digits.substring(0, 3) +
                ")" +
                digits.substring(3);

        } else {

            phone.value =
                "(" +
                digits.substring(0, 3) +
                ")" +
                digits.substring(3, 6) +
                "-" +
                digits.substring(6, 10);
        }
    });


    // ---------------------------------------
    // State automatically becomes uppercase
    // ---------------------------------------

    state.addEventListener("input", function () {

        state.value = state.value
            .replace(/[^a-zA-Z]/g, "")
            .toUpperCase()
            .substring(0, 2);
    });


    // ---------------------------------------
    // Clear custom errors when user edits
    // ---------------------------------------

    const fields = form.querySelectorAll("input, textarea");

    fields.forEach(function (field) {

        field.addEventListener("input", function () {
            field.setCustomValidity("");
        });

    });


    // ---------------------------------------
    // Form validation
    // ---------------------------------------

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Let HTML5 required/pattern validation run first
        if (!form.checkValidity()) {

            form.reportValidity();
            return;
        }


        // ---------------------------------------
        // Validate first name
        // ---------------------------------------

        if (firstName.value.trim().length < 2) {

            firstName.setCustomValidity(
                "Please enter a valid first name."
            );

            firstName.reportValidity();
            firstName.focus();

            return;
        }


        // ---------------------------------------
        // Validate last name
        // ---------------------------------------

        if (lastName.value.trim().length < 2) {

            lastName.setCustomValidity(
                "Please enter a valid last name."
            );

            lastName.reportValidity();
            lastName.focus();

            return;
        }


        // ---------------------------------------
        // Validate mailing address
        // Must contain letters and a number
        // ---------------------------------------

        const addressPattern =
            /^(?=.*[A-Za-z])(?=.*\d).{5,}$/;

        if (!addressPattern.test(address.value.trim())) {

            address.setCustomValidity(
                "Please enter a complete street address including the street number."
            );

            address.reportValidity();
            address.focus();

            return;
        }


        // ---------------------------------------
        // Validate city
        // ---------------------------------------

        const cityPattern =
            /^[A-Za-zÀ-ÖØ-öø-ÿ.' -]{2,}$/;

        if (!cityPattern.test(city.value.trim())) {

            city.setCustomValidity(
                "Please enter a valid city."
            );

            city.reportValidity();
            city.focus();

            return;
        }


        // ---------------------------------------
        // Validate US state abbreviation
        // ---------------------------------------

        const validStates = [
            "AL", "AK", "AZ", "AR", "CA", "CO",
            "CT", "DE", "FL", "GA", "HI", "ID",
            "IL", "IN", "IA", "KS", "KY", "LA",
            "ME", "MD", "MA", "MI", "MN", "MS",
            "MO", "MT", "NE", "NV", "NH", "NJ",
            "NM", "NY", "NC", "ND", "OH", "OK",
            "OR", "PA", "RI", "SC", "SD", "TN",
            "TX", "UT", "VT", "VA", "WA", "WV",
            "WI", "WY", "DC"
        ];

        if (!validStates.includes(state.value.toUpperCase())) {

            state.setCustomValidity(
                "Please enter a valid two-letter U.S. state abbreviation."
            );

            state.reportValidity();
            state.focus();

            return;
        }


        // ---------------------------------------
        // Validate ZIP code
        // ---------------------------------------

        const zipPattern =
            /^\d{5}(-\d{4})?$/;

        if (!zipPattern.test(zip.value.trim())) {

            zip.setCustomValidity(
                "Please enter a valid ZIP code such as 32708 or 32708-1234."
            );

            zip.reportValidity();
            zip.focus();

            return;
        }


        // ---------------------------------------
        // Validate phone number
        // ---------------------------------------

        const phonePattern =
            /^\(\d{3}\)\d{3}-\d{4}$/;

        if (!phonePattern.test(phone.value)) {

            phone.setCustomValidity(
                "Please enter a complete 10-digit phone number."
            );

            phone.reportValidity();
            phone.focus();

            return;
        }


        // ---------------------------------------
        // Validate email
        // ---------------------------------------

        if (!email.validity.valid) {

            email.setCustomValidity(
                "Please enter a valid email address."
            );

            email.reportValidity();
            email.focus();

            return;
        }


        // ---------------------------------------
        // Validate birth date
        // ---------------------------------------

        const birthDateValue =
            new Date(birthdate.value + "T00:00:00");

        const currentDate = new Date();

        if (birthDateValue > currentDate) {

            birthdate.setCustomValidity(
                "Birth date cannot be in the future."
            );

            birthdate.reportValidity();
            birthdate.focus();

            return;
        }


        // Warn against clearly unreasonable dates
        const oldestReasonableDate = new Date();

        oldestReasonableDate.setFullYear(
            oldestReasonableDate.getFullYear() - 120
        );

        if (birthDateValue < oldestReasonableDate) {

            birthdate.setCustomValidity(
                "Please enter a reasonable birth date."
            );

            birthdate.reportValidity();
            birthdate.focus();

            return;
        }


        // ---------------------------------------
        // Validate message
        // ---------------------------------------

        if (message.value.trim().length < 2) {

            message.setCustomValidity(
                "Please enter a message."
            );

            message.reportValidity();
            message.focus();

            return;
        }


        // ---------------------------------------
        // Security question
        // ---------------------------------------

        if (Number(confirm.value) !== 7) {

            confirm.setCustomValidity(
                "Incorrect answer. Please answer the security question."
            );

            confirm.reportValidity();
            confirm.focus();

            return;
        }


        // ---------------------------------------
        // Collect validated information
        // ---------------------------------------

        const formData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            address: address.value.trim(),
            city: city.value.trim(),
            state: state.value.trim(),
            zip: zip.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            birthdate: birthdate.value,
            message: message.value.trim()
        };


        // ---------------------------------------
        // Send information to confirmation page
        // ---------------------------------------

        const parameters =
            new URLSearchParams(formData);

        window.location.href =
            "confirmation.html?" +
            parameters.toString();

    });

});