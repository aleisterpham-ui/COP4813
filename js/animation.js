document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("animationCanvas");
    const ctx = canvas.getContext("2d");
    const message = document.getElementById("animationMessage");

    const ball = {
        x: 100,
        y: 100,
        radius: 30,
        dx: 4,
        dy: 4,
        color: "#1f4e79"
    };

    const colors = [
        "#1f4e79",
        "#c0392b",
        "#27ae60",
        "#8e44ad",
        "#e67e22"
    ];

    let colorIndex = 0;


    function drawBall() {

        ctx.beginPath();

        ctx.arc(
            ball.x,
            ball.y,
            ball.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = ball.color;
        ctx.fill();

        ctx.closePath();
    }


    function updatePosition() {

        ball.x += ball.dx;
        ball.y += ball.dy;


        if (
            ball.x + ball.radius >= canvas.width ||
            ball.x - ball.radius <= 0
        ) {
            ball.dx *= -1;
        }


        if (
            ball.y + ball.radius >= canvas.height ||
            ball.y - ball.radius <= 0
        ) {
            ball.dy *= -1;
        }
    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawBall();
        updatePosition();

        requestAnimationFrame(animate);
    }


    canvas.addEventListener("click", function (event) {

        const rect = canvas.getBoundingClientRect();

        const scaleX =
            canvas.width / rect.width;

        const scaleY =
            canvas.height / rect.height;

        const mouseX =
            (event.clientX - rect.left) * scaleX;

        const mouseY =
            (event.clientY - rect.top) * scaleY;


        const distanceX =
            mouseX - ball.x;

        const distanceY =
            mouseY - ball.y;

        const distance =
            Math.sqrt(
                (distanceX * distanceX) +
                (distanceY * distanceY)
            );


        if (distance <= ball.radius) {

            colorIndex =
                (colorIndex + 1) % colors.length;

            ball.color =
                colors[colorIndex];

            ball.dx *= -1;
            ball.dy *= -1;

            message.textContent =
                "Ball clicked! Color changed and direction reversed.";
        }

    });


    animate();

});