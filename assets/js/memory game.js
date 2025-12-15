document.addEventListener("DOMContentLoaded", () => {

    const board = document.getElementById("board");
    const movesSpan = document.getElementById("moves");
    const matchesSpan = document.getElementById("matches");
    const pairsTotalSpan = document.getElementById("pairsTotal");

    const btnStart = document.getElementById("startGame");
    const btnRestart = document.getElementById("restartGame");

    const difficultySelect = document.getElementById("difficulty");

    const overlay = document.getElementById("memoryOverlay");
    const winStats = document.getElementById("winStats");
    const playAgain = document.getElementById("playAgain");
    const closeOverlay = document.getElementById("closeOverlay");

    let moves = 0;
    let matches = 0;
    let totalPairs = 0;

    let firstCard = null;
    let lockBoard = false;

    const icons = ["🍎","🍌","🍇","🍒","🍑","🥝","🍉","🍍","🥥","🍓","🍈","🍋"];

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function startGame() {
        board.innerHTML = "";
        moves = 0;
        matches = 0;
        lockBoard = false;
        movesSpan.textContent = 0;
        matchesSpan.textContent = 0;

        let size = difficultySelect.value === "easy" ? 6 : 12;
        totalPairs = size;
        pairsTotalSpan.textContent = totalPairs;

        board.className = "memory-board " + (size === 6 ? "card-easy" : "card-hard");

        let selectedIcons = shuffle(icons).slice(0, size);
        let cardSet = shuffle([...selectedIcons, ...selectedIcons]);

        cardSet.forEach(icon => {
            const card = document.createElement("div");
            card.classList.add("memory-card");

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${icon}</div>
                </div>
            `;

            // set up 3D flip styles for this card (front/back/inner)
            const inner = card.querySelector('.card-inner');
            const front = inner.querySelector('.card-front');
            const back = inner.querySelector('.card-back');

            // make cards taller and fonts larger/responsive
            card.style.minHeight = '110px';
            card.style.perspective = '900px';
            inner.style.transition = 'transform 0.5s ease';
            inner.style.transformStyle = 'preserve-3d';
            inner.style.width = '100%';
            inner.style.height = '100%';

            front.style.backfaceVisibility = 'hidden';
            front.style.position = 'absolute';
            front.style.inset = '0';
            front.style.display = 'flex';
            front.style.alignItems = 'center';
            front.style.justifyContent = 'center';
            front.style.fontSize = 'clamp(24px, 5vw, 44px)';

            back.style.backfaceVisibility = 'hidden';
            back.style.transform = 'rotateY(180deg)';
            back.style.position = 'absolute';
            back.style.inset = '0';
            back.style.display = 'flex';
            back.style.alignItems = 'center';
            back.style.justifyContent = 'center';
            back.style.fontSize = 'clamp(24px, 5vw, 44px)';

            card.addEventListener("click", () => flipCard(card, icon));
            board.appendChild(card);
        });
    }

    function flipCard(card, icon) {
        if (lockBoard) return;
        if (card.classList.contains("matched")) return;

        const inner = card.querySelector('.card-inner');
        if (inner._flipped) return; // already flipped this turn

        // flip to show back
        inner.style.transform = 'rotateY(180deg)';
        inner._flipped = true;

        if (!firstCard) {
            firstCard = card;
            return;
        }

        moves++;
        movesSpan.textContent = moves;

        let secondIcon = card.querySelector(".card-back").textContent;
        let firstIcon = firstCard.querySelector(".card-back").textContent;

        if (firstIcon === secondIcon) {
            // Match found
            card.classList.add("matched");
            firstCard.classList.add("matched");
            // keep them flipped (inner._flipped true)
            firstCard = null;
            matches++;
            matchesSpan.textContent = matches;

            if (matches === totalPairs) {
                setTimeout(showWinPopup, 500);
            }
        } else {
            // No match: flip back after delay
            lockBoard = true;
            setTimeout(() => {
                const innerA = card.querySelector('.card-inner');
                const innerB = firstCard.querySelector('.card-inner');
                innerA.style.transform = 'rotateY(0deg)';
                innerB.style.transform = 'rotateY(0deg)';
                innerA._flipped = false;
                innerB._flipped = false;
                firstCard = null;
                lockBoard = false;
            }, 900);
        }
    }

    function showWinPopup() {
        winStats.textContent = `You won in ${moves} moves!`;
        overlay.hidden = false;
    }

    playAgain.addEventListener("click", () => {
        overlay.hidden = true;
        startGame();
    });

    closeOverlay.addEventListener("click", () => {
        overlay.hidden = true;
    });

    btnStart.addEventListener("click", startGame);
    btnRestart.addEventListener("click", startGame);
});
