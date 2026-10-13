document.addEventListener("DOMContentLoaded", function () {

    const dealButton =
        document.getElementById("dealButton");

    const cardHand =
        document.getElementById("cardHand");

    const discardPile =
        document.getElementById("discardPile");

    const message =
        document.getElementById("dragMessage");


    const cards = [
        {
            id: "ace-spades",
            rank: "A",
            suit: "♠",
            name: "Ace of Spades",
            color: "black"
        },
        {
            id: "king-hearts",
            rank: "K",
            suit: "♥",
            name: "King of Hearts",
            color: "red"
        },
        {
            id: "seven-diamonds",
            rank: "7",
            suit: "♦",
            name: "Seven of Diamonds",
            color: "red"
        },
        {
            id: "queen-clubs",
            rank: "Q",
            suit: "♣",
            name: "Queen of Clubs",
            color: "black"
        },
        {
            id: "ten-hearts",
            rank: "10",
            suit: "♥",
            name: "Ten of Hearts",
            color: "red"
        }
    ];


    function createCardImage(card) {

        const svg =
            `
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="140"
                 height="200"
                 viewBox="0 0 140 200">

                <rect
                    x="2"
                    y="2"
                    width="136"
                    height="196"
                    rx="10"
                    fill="white"
                    stroke="#222222"
                    stroke-width="4"/>

                <text
                    x="15"
                    y="38"
                    font-size="30"
                    font-family="Arial"
                    font-weight="bold"
                    fill="${card.color}">
                    ${card.rank}
                </text>

                <text
                    x="15"
                    y="70"
                    font-size="32"
                    font-family="Arial"
                    fill="${card.color}">
                    ${card.suit}
                </text>

                <text
                    x="70"
                    y="125"
                    text-anchor="middle"
                    font-size="64"
                    font-family="Arial"
                    fill="${card.color}">
                    ${card.suit}
                </text>

            </svg>
            `;

        return "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(svg);
    }


    function createCard(card) {

        const image =
            document.createElement("img");

        image.src =
            createCardImage(card);

        image.id =
            card.id;

        image.alt =
            card.name;

        image.className =
            "playing-card";

        image.draggable =
            true;


        image.addEventListener(
            "dragstart",
            function (event) {

                event.dataTransfer.setData(
                    "text/plain",
                    card.id
                );

                message.textContent =
                    "Dragging " + card.name + ".";

                image.classList.add(
                    "dragging"
                );
            }
        );


        image.addEventListener(
            "dragend",
            function () {

                image.classList.remove(
                    "dragging"
                );

            }
        );


        return image;
    }


    function dealCards() {

        cardHand.innerHTML = "";

        discardPile.innerHTML =
            "<p>Drag a card here to discard it.</p>";


        cards.forEach(function (card) {

            cardHand.appendChild(
                createCard(card)
            );

        });


        message.textContent =
            "Five cards were dealt. Drag a card to the discard pile.";

    }


    discardPile.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            discardPile.classList.add(
                "drag-over"
            );

        }
    );


    discardPile.addEventListener(
        "dragleave",
        function () {

            discardPile.classList.remove(
                "drag-over"
            );

        }
    );


    discardPile.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            discardPile.classList.remove(
                "drag-over"
            );


            const cardId =
                event.dataTransfer.getData(
                    "text/plain"
                );


            const cardElement =
                document.getElementById(
                    cardId
                );


            if (!cardElement) {
                return;
            }


            const cardName =
                cardElement.alt;


            discardPile.innerHTML = "";

            discardPile.appendChild(
                cardElement
            );


            message.textContent =
                cardName +
                " was discarded. Drop event triggered successfully.";

        }
    );


    dealButton.addEventListener(
        "click",
        dealCards
    );

});