document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("spiroForm");
    const canvas = document.getElementById("spiroCanvas");
    const ctx = canvas.getContext("2d");
    const message = document.getElementById("canvasMessage");

    let animationId = null;


    function gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));

        while (b !== 0) {
            const remainder = a % b;
            a = b;
            b = remainder;
        }

        return a;
    }


    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    function startDrawing() {

        const R = Number(
            document.getElementById("outerRadius").value
        );

        const r = Number(
            document.getElementById("innerRadius").value
        );

        const O = Number(
            document.getElementById("penOffset").value
        );


        message.textContent = "";


        // Validate values

        if (
            !Number.isFinite(R) ||
            !Number.isFinite(r) ||
            !Number.isFinite(O)
        ) {
            message.textContent =
                "Please enter valid numbers for R, r, and O.";
            return;
        }


        if (R < 50 || R > 200) {
            message.textContent =
                "R must be between 50 and 200.";
            return;
        }


        if (r < 10 || r > 150) {
            message.textContent =
                "r must be between 10 and 150.";
            return;
        }


        if (r > R) {
            message.textContent =
                "The inner radius r cannot be greater than R.";
            return;
        }


        if (O < 0 || O > r) {
            message.textContent =
                "The pen offset O must be between 0 and r.";
            return;
        }


        // Stop an old drawing if user clicks again

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }


        clearCanvas();


        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;


        // Scale pattern so it fits inside canvas

        const maxRadius = R + (2 * r) + O;

        const scale =
            (Math.min(canvas.width, canvas.height) * 0.42) /
            maxRadius;


        // Determine how long to draw before pattern repeats

        const divisor = gcd(R, r);

        const maxT =
            2 * Math.PI * (r / divisor);


        let t = 0;

        const increment = 0.01;


        function getPoint(currentT) {

            const x =
                (R + r) * Math.cos(currentT) -
                (r + O) *
                Math.cos(
                    ((R + r) / r) * currentT
                );


            const y =
                (R + r) * Math.sin(currentT) -
                (r + O) *
                Math.sin(
                    ((R + r) / r) * currentT
                );


            return {
                x: centerX + (x * scale),
                y: centerY + (y * scale)
            };
        }


        const firstPoint = getPoint(0);

        ctx.beginPath();

        ctx.moveTo(
            firstPoint.x,
            firstPoint.y
        );

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1f4e79";


        function animate() {

            let pointsThisFrame = 0;


            while (
                t <= maxT &&
                pointsThisFrame < 75
            ) {

                const point =
                    getPoint(t);


                ctx.lineTo(
                    point.x,
                    point.y
                );


                t += increment;
                pointsThisFrame++;
            }


            ctx.stroke();


            if (t <= maxT) {

                animationId =
                    requestAnimationFrame(animate);

            } else {

                animationId = null;

                message.textContent =
                    "Spirograph drawing complete.";

            }
        }


        animate();
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!form.checkValidity()) {

                form.reportValidity();
                return;
            }


            startDrawing();

        }
    );


    // Assignment requires the canvas to start blank
    clearCanvas();

});