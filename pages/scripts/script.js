// -----------------------------
// Utility: Intersection Observer for lazy initialization
// -----------------------------
function lazyInit(selector, callback) {
    const element = document.querySelector(selector);
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                observer.disconnect();
            }
        });
    }, { rootMargin: '50px' });

    observer.observe(element);
}

// -----------------------------
// UNIX Time (lightweight, runs immediately)
// -----------------------------
document.addEventListener('DOMContentLoaded', function() {
    const el = document.getElementById('epoch-seconds');
    if (!el) return;

    function updateTime() {
        el.textContent = Math.floor(Date.now() / 1000);
    }

    setInterval(updateTime, 1000);
    updateTime();
});

// -----------------------------
// Particle Canvas (lazy load when visible)
// -----------------------------
let particlesInitialized = false;

function initParticles() {
    if (particlesInitialized) return;
    particlesInitialized = true;

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Performance boost
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const mouse = { x: 0, y: 0 };
    let mouseActive = false;

    // Throttled mouse move handler
    let lastMouseTime = 0;
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseTime < 16) return; // ~60fps throttle
        lastMouseTime = now;

        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouseActive = true;

        // Reduced particle spawn
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: mouse.x,
                y: mouse.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 2 + 0.005,
                alpha: 0.3,
                sparkle: Math.random() * Math.PI,
                sparkleSpeed: Math.random() * 0.1 + 0.05,
                isMouseParticle: true
            });
        }
    });

    // Initialize background particles
    for (let i = 0; i < 60; i++) { // Reduced from 80
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 1.5 + 0.001,
            sparkle: Math.random() * Math.PI,
            sparkleSpeed: Math.random() * 0.1 + 0.05,
            isMouseParticle: false
        });
    }

    function animateParticles() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.sparkle += p.sparkleSpeed;
            const sparkleIntensity = Math.sin(p.sparkle) * 0.5 + 0.5;

            const alpha = p.isMouseParticle ? p.alpha : 0.5;
            ctx.fillStyle = `rgba(255, 165, 0, ${alpha * sparkleIntensity})`;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 200, 0, ${alpha * sparkleIntensity * 0.3})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 0.5);
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            // Boundary check
            if (p.x < 0) {
                p.x = 0;
                p.vx = Math.abs(p.vx) * 0.9;
            } else if (p.x > canvas.width) {
                p.x = canvas.width;
                p.vx = -Math.abs(p.vx) * 0.9;
            }

            if (p.y < 0) {
                p.y = 0;
                p.vy = Math.abs(p.vy) * 0.9;
            } else if (p.y > canvas.height) {
                p.y = canvas.height;
                p.vy = -Math.abs(p.vy) * 0.9;
            }

            if (p.isMouseParticle) {
                p.alpha -= 0.015;
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, 250);
    });
}

// Lazy load particles when canvas is visible
document.addEventListener('DOMContentLoaded', () => {
    lazyInit('#particles-canvas', initParticles);
});

// -----------------------------
// YouTube Audio Player (lazy load)
// -----------------------------
let player;
let isPlaying = false;
let playerInitialized = false;
const PLAYLISTS = [
    "PLFj_OzPqUyqOA7ImA4nRxeVSDplcTn_t3",
    "PLFj_OzPqUyqPzg9lRyN3lCX5HavmH69nC",
    "PLFj_OzPqUyqO4-nSuAC00TMABrP4PAu4Y",
    "PLFj_OzPqUyqOBEwes4Ssll4SdKjhV2xdM"
];
const PLAYLIST_ID = PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)];

function initYouTubePlayer() {
    if (playerInitialized) return;
    playerInitialized = true;

    // Load YouTube API dynamically
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
        height: '140',
        width: '250',
        playerVars: {
            listType: 'playlist',
            list: PLAYLIST_ID,
            autoplay: 0,
            modestbranding: 1,
            shuffle: 1,
            rel: 0,
            iv_load_policy: 3,
            fs: 0,
            controls: 1,
            loop: 1,
            playlist: PLAYLIST_ID
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady() {
    updateVolume();
    updateTrackInfo();
    setInterval(updateProgress, 500);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.getElementById('play-pause-btn').textContent = '⏸';
        updateTrackInfo();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        document.getElementById('play-pause-btn').textContent = '▶';
    }
}

function updateVolume() {
    document.getElementById('volume-slider').value = player.getVolume();
}

function updateProgress() {
    if (!player.getDuration) return;
    const current = player.getCurrentTime();
    const duration = player.getDuration();
    const percent = duration ? (current / duration) * 100 : 0;
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('current-time').textContent = formatTime(current);
    document.getElementById('duration').textContent = formatTime(duration);
}

function updateTrackInfo() {
    const data = player.getVideoData();
    const title = data.title || "DnB Mix";
    document.getElementById('player-title').textContent =
        title.length > 35 ? title.substring(0, 32) + "..." : title;
}

function formatTime(seconds) {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// Set up player controls (event delegation)
document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressContainer = document.getElementById('progress-container');

    if (!playPauseBtn) return; // Player not on page

    // Initialize player on first interaction
    const initOnInteraction = () => {
        initYouTubePlayer();
        // Keep event listeners active after init
    };

    playPauseBtn.addEventListener('click', () => {
        if (!playerInitialized) {
            initOnInteraction();
            return;
        }
        if (isPlaying) player.pauseVideo();
        else player.playVideo();
    });

    nextBtn.addEventListener('click', () => {
        if (!playerInitialized) return;
        player.nextVideo();
    });

    prevBtn.addEventListener('click', () => {
        if (!playerInitialized) return;
        player.previousVideo();
    });

    volumeSlider.addEventListener('input', e => {
        if (!playerInitialized) return;
        player.setVolume(e.target.value);
        updateSliderBackground();
    });

    progressContainer.addEventListener('click', e => {
        if (!playerInitialized) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        player.seekTo(player.getDuration() * percent);
    });

    // Update slider background
    function updateSliderBackground() {
        const value = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
        volumeSlider.style.background = `linear-gradient(to right, var(--gold-bright) 0%, var(--text-dim) ${value}%, var(--bg-tertiary) ${value}%, var(--bg-secondary) 100%)`;
    }
    updateSliderBackground();
});

// -----------------------------
// Page Loading
// -----------------------------
function loadPage(page) {
    document.getElementById('page-frame').src = page;
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

window.onload = function() {
    if (!location.hash) {
        document.getElementById('page-frame').src = 'home.html';
    }
};

// -----------------------------
// Swatch Time (Internet Time)
// -----------------------------
function GetSwatchTime(showDecimals = true) {
    const date = new Date();
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    hours = hours === 23 ? 0 : hours + 1;
    const timeInMilliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
    const millisecondsInABeat = 86400;

    if (showDecimals) {
        return Math.abs(timeInMilliseconds / millisecondsInABeat).toFixed(2);
    } else {
        return Math.floor(Math.abs(timeInMilliseconds / millisecondsInABeat));
    }
}

// -----------------------------
// Badge Downloader
// -----------------------------
function downloadBadge(src, filename) {
    const image = new Image();
    image.src = src;

    image.onload = () => {
        const a = document.createElement("a");
        a.href = src;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    image.onerror = () => {
        console.warn("Failed to load badge for download:", src);
    };
}
