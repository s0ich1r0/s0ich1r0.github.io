
let historyStack = [];
let currentIndex = -1;

function loadPage(pageUrl) {
    const frame = document.getElementById('content-frame');
    frame.src = pageUrl;


    if (currentIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, currentIndex + 1);
    }
    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pageUrl) {
        historyStack.push(pageUrl);
        currentIndex = historyStack.length - 1;
    } else {
        currentIndex = historyStack.length - 1;
    }

    history.pushState({ page: pageUrl }, '', '#' + pageUrl);
    updateButtons();
}

function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        const prevPage = historyStack[currentIndex];
        document.getElementById('content-frame').src = prevPage;
        history.pushState({ page: prevPage }, '', '#' + prevPage);
        updateButtons();
    }
}

function goForward() {
    if (currentIndex < historyStack.length - 1) {
        currentIndex++;
        const nextPage = historyStack[currentIndex];
        document.getElementById('content-frame').src = nextPage;
        history.pushState({ page: nextPage }, '', '#' + nextPage);
        updateButtons();
    }
}

function updateButtons() {
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');
    backBtn.disabled = currentIndex <= 0;
    forwardBtn.disabled = currentIndex >= historyStack.length - 1;
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        document.getElementById('content-frame').src = event.state.page;
        currentIndex = historyStack.indexOf(event.state.page);
        if (currentIndex === -1) {
            historyStack.push(event.state.page);
            currentIndex = historyStack.length - 1;
        }
        updateButtons();
    }
});

window.addEventListener('load', () => {
    const hash = location.hash.replace('#', '');

    if (hash) {
        loadPage(hash);
    } else {
        const initialPage = document.getElementById('content-frame').src.split('/').pop();
        historyStack.push(initialPage);
        currentIndex = 0;
        history.replaceState({ page: initialPage }, '', '#' + initialPage);
        updateButtons();
    }
});

function openInNewTab() {
    const iframe = document.getElementById('content-frame');
    const url = iframe.src;
    window.open(url, '_blank');
}
