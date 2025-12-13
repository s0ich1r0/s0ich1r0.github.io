document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const mouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: mouse.x,
                y: mouse.y,
                vx: (Math.random() - 0.5) * 4,
                           vy: (Math.random() - 0.5) * 4,
                           size: Math.random() * 2 + 0.005,
                           alpha: 0.3,
                           sparkle: Math.random() * Math.PI * 1,
                           sparkleSpeed: Math.random() * 0.1 + 0.05,
                           isMouseParticle: true
            });
        }
    });

    // initialize
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
                       y: Math.random() * canvas.height,
                       vx: (Math.random() - 0.5) * 0.5,
                       vy: (Math.random() - 0.5) * 0.5,
                       size: Math.random() * 1.5 + 0.001,
                       sparkle: Math.random() * Math.PI * 1,
                       sparkleSpeed: Math.random() * 0.1 + 0.05,
                       isMouseParticle: false
        });
    }

    function animateParticles() {
        // trail for base particles, also changing alpha down has weird effects e.g 0.001
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            // update sparkle animation
            p.sparkle += p.sparkleSpeed;
            const sparkleIntensity = Math.sin(p.sparkle) * 0.5 + 0.5;

            // sparkle effect
            const alpha = p.isMouseParticle ? p.alpha : 0.5;
            ctx.fillStyle = `rgba(255, 165, 0, ${alpha * sparkleIntensity})`;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // glow effect for sparkle
            ctx.fillStyle = `rgba(255, 200, 0, ${alpha * sparkleIntensity * 0.3})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 0.5);
            ctx.fill();

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
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

            // fade particles
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
// -----------------------------
// UNIX Time
// -----------------------------
document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const now = Math.floor(Date.now() / 1000);
        const el = document.getElementById('epoch-seconds');
        if (el) el.textContent = now;
    }

    setInterval(updateTime, 1000);
    updateTime();
});

// -----------------------------
// YouTube Audio Player
// -----------------------------
let player;
let isPlaying = false;
const PLAYLISTS = [
    "PLFj_OzPqUyqOA7ImA4nRxeVSDplcTn_t3",
    "PLFj_OzPqUyqPzg9lRyN3lCX5HavmH69nC",
    "PLFj_OzPqUyqO4-nSuAC00TMABrP4PAu4Y",
    "PLFj_OzPqUyqOBEwes4Ssll4SdKjhV2xdM"
    ];

const PLAYLIST_ID = PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)];

function onYouTubeIframeAPIReady() {
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
}

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

document.getElementById('play-pause-btn').addEventListener('click', () => {
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
});
document.getElementById('next-btn').addEventListener('click', () => player.nextVideo());
document.getElementById('prev-btn').addEventListener('click', () => player.previousVideo());

document.getElementById('volume-slider').addEventListener('input', e => {
    player.setVolume(e.target.value);
});
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

document.getElementById('progress-container').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    player.seekTo(player.getDuration() * percent);
});

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

const volumeSlider = document.getElementById('volume-slider');

function updateSliderBackground() {
    const value = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
    volumeSlider.style.background = `linear-gradient(to right, var(--gold-bright) 0%, var(--text-dim) ${value}%, var(--bg-tertiary) ${value}%, var(--bg-secondary) 100%)`;
}

volumeSlider.addEventListener('input', updateSliderBackground);
updateSliderBackground();

//---------------------------
// //  SWATCH time (Internet Time)
//---------------------------

// Returns the current Swatch beat
function GetSwatchTime(showDecimals = true) {
    // get date in UTC/GMT
    var date = new Date();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    var milliseconds = date.getUTCMilliseconds();
    // add hour to get time in Switzerland
    hours = hours == 23 ? 0 : hours + 1;
    // time in seconds
    var timeInMilliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
    // there are 86.4 seconds in a beat
    var millisecondsInABeat = 86400;
    // calculate beats to two decimal places
    if (showDecimals) {
        return Math.abs(timeInMilliseconds / millisecondsInABeat).toFixed(2);
    } else {
        return Math.floor(Math.abs(timeInMilliseconds / millisecondsInABeat));
    }
}

//---------------------------
//   Badge Downloader
//---------------------------
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

