
document.addEventListener("DOMContentLoaded", function () {

    const tableBody = document.getElementById("cmsTableBody");
    const statusMessage = document.getElementById("cmsStatus");

    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    function createLink(url, label) {
        const link = document.createElement("a");

        link.href = url;
        link.textContent = label;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        return link;
    }

    function displayCMS(data) {

        tableBody.replaceChildren();

        data.forEach(function (cms) {

            const row = document.createElement("tr");

            // CMS name
            row.appendChild(createCell(cms.name));

            // Produced or supported by
            row.appendChild(createCell(cms.support));

            // Technology stack
            row.appendChild(createCell(cms.technology));

            // Major capabilities
            row.appendChild(createCell(cms.capabilities));

            // Major limitations
            row.appendChild(createCell(cms.limitations));

            // Example website and research sources
            const exampleCell = document.createElement("td");

            const exampleLink = createLink(
                cms.exampleUrl,
                cms.exampleName
            );

            exampleCell.appendChild(exampleLink);

            const sourceHeading = document.createElement("p");
            sourceHeading.textContent = "Research Sources:";

            exampleCell.appendChild(sourceHeading);

            const sourceList = document.createElement("ul");

            cms.sources.forEach(function (source) {

                const listItem = document.createElement("li");

                const sourceLink = createLink(
                    source.url,
                    source.label
                );

                listItem.appendChild(sourceLink);
                sourceList.appendChild(listItem);
            });

            exampleCell.appendChild(sourceList);
            row.appendChild(exampleCell);

            // Add completed row to the table
            tableBody.appendChild(row);

        });

        statusMessage.textContent =
            data.length + " CMS platforms loaded successfully.";
    }

    // Load the external JSON file
    fetch("data/cms.json")
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Unable to load CMS data.");
            }

            return response.json();
        })
        .then(function (data) {

            if (!Array.isArray(data)) {
                throw new Error("CMS data must be an array.");
            }

            displayCMS(data);
        })
        .catch(function (error) {

            statusMessage.textContent =
                "Error loading CMS data. Check the JSON file.";

            console.error(error);
        });

});
