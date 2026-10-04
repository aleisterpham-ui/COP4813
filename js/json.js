document.addEventListener("DOMContentLoaded", function () {

    const statusMessage =
        document.getElementById("jsonStatus");

    const tableBody =
        document.getElementById("jsonTableBody");


    fetch("data/interests.json")

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Unable to load the JSON file."
                );
            }

            return response.json();
        })

        .then(function (data) {

            tableBody.innerHTML = "";

            data.forEach(function (item) {

                const row =
                    document.createElement("tr");

                const topicCell =
                    document.createElement("td");

                const categoryCell =
                    document.createElement("td");

                const levelCell =
                    document.createElement("td");

                const descriptionCell =
                    document.createElement("td");


                topicCell.textContent =
                    item.topic;

                categoryCell.textContent =
                    item.category;

                levelCell.textContent =
                    item.interestLevel + " / 10";

                descriptionCell.textContent =
                    item.description;


                row.appendChild(topicCell);
                row.appendChild(categoryCell);
                row.appendChild(levelCell);
                row.appendChild(descriptionCell);

                tableBody.appendChild(row);

            });


            statusMessage.textContent =
                "JSON data loaded successfully.";

        })

        .catch(function (error) {

            statusMessage.textContent =
                "There was a problem loading the JSON data.";

            console.error(error);

        });

});