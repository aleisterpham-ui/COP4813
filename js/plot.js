document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("plotForm");
    const resetButton = document.getElementById("resetButton");
    const message = document.getElementById("plotMessage");
    const resultsBody = document.getElementById("resultsBody");

    let chart = null;


    // Damped oscillation equation:
    // y = A * e^(-kx) * sin(wx + phi)

    function calculateY(A, k, w, phi, x) {
        return A * Math.exp(-k * x) * Math.sin((w * x) + phi);
    }


    function calculateAndPlot() {

        const A = Number(document.getElementById("amplitude").value);
        const k = Number(document.getElementById("decay").value);
        const w = Number(document.getElementById("frequency").value);
        const phi = Number(document.getElementById("phase").value);

        const xMin = Number(document.getElementById("xMin").value);
        const xMax = Number(document.getElementById("xMax").value);
        const step = Number(document.getElementById("step").value);


        // Clear previous message
        message.textContent = "";


        // Validate numbers

        if (
            !Number.isFinite(A) ||
            !Number.isFinite(k) ||
            !Number.isFinite(w) ||
            !Number.isFinite(phi) ||
            !Number.isFinite(xMin) ||
            !Number.isFinite(xMax) ||
            !Number.isFinite(step)
        ) {
            message.textContent =
                "Please enter valid numbers in every field.";
            return;
        }


        if (k < 0) {
            message.textContent =
                "Decay rate must be zero or greater.";
            return;
        }


        if (xMax <= xMin) {
            message.textContent =
                "Maximum X must be greater than Minimum X.";
            return;
        }


        if (step <= 0) {
            message.textContent =
                "Step size must be greater than zero.";
            return;
        }


        const numberOfPoints =
            Math.floor((xMax - xMin) / step) + 1;


        if (numberOfPoints > 2000) {
            message.textContent =
                "Please use a larger step size. The graph is limited to 2,000 points.";
            return;
        }


        const plotData = [];

        resultsBody.innerHTML = "";


        // Calculate all x and y values

        for (
            let x = xMin;
            x <= xMax + (step / 2);
            x += step
        ) {

            const roundedX =
                Number(x.toFixed(10));

            const y =
                calculateY(A, k, w, phi, roundedX);


            plotData.push({
                x: roundedX,
                y: y
            });


            // Add values to table

            const row =
                document.createElement("tr");

            const xCell =
                document.createElement("td");

            const yCell =
                document.createElement("td");


            xCell.textContent =
                roundedX.toFixed(2);

            yCell.textContent =
                y.toFixed(4);


            row.appendChild(xCell);
            row.appendChild(yCell);

            resultsBody.appendChild(row);
        }


        // Destroy old graph before drawing a new one

        if (chart !== null) {
            chart.destroy();
        }


        const canvas =
            document.getElementById("oscillationChart");

        const context =
            canvas.getContext("2d");


        // Create Chart.js plot

        chart = new Chart(context, {

            type: "line",

            data: {

                datasets: [
                    {
                        label: "Damped Oscillation",
                        data: plotData,
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                parsing: false,

                interaction: {
                    mode: "nearest",
                    intersect: false
                },

                plugins: {

                    title: {
                        display: true,
                        text: "Damped Oscillation"
                    },

                    legend: {
                        display: true
                    }

                },

                scales: {

                    x: {
                        type: "linear",

                        title: {
                            display: true,
                            text: "X - Independent Variable"
                        }
                    },

                    y: {

                        title: {
                            display: true,
                            text: "Y - Dependent Variable"
                        }
                    }

                }

            }

        });


        message.textContent =
            "Calculation complete. " +
            plotData.length +
            " values were calculated and plotted.";
    }


    // Calculate button

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        calculateAndPlot();

    });


    // Reset button

    resetButton.addEventListener("click", function () {

        setTimeout(function () {
            calculateAndPlot();
        }, 0);

    });


    // Automatically display the seed-value graph
    // when the page first loads

    calculateAndPlot();

});