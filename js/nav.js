document.addEventListener("DOMContentLoaded", function () {
    const nav = document.getElementById("site-nav");

    if (!nav) {
        return;
    }

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

const links = [
    { href: "index.html", text: "Home" },
    { href: "assignments.html", text: "Assignments" },
    { href: "form.html", text: "Form" },
    { href: "plot.html", text: "Plot" },
    { href: "canvas.html", text: "Canvas" },
    { href: "json.html", text: "JSON" }
];

    links.forEach(function (linkInfo) {
        const link = document.createElement("a");

        link.href = linkInfo.href;
        link.textContent = linkInfo.text;

        if (currentPage === linkInfo.href) {
            link.setAttribute("aria-current", "page");
        }

        nav.appendChild(link);
    });
});