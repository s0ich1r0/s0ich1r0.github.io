        // Create floating hearts
        const heartsContainer = document.getElementById('hearts');
        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = ['💛', '✨', '⭐'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }, 300);

        // Create twinkling stars
        const starsContainer = document.getElementById('stars');
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.textContent = '★';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            starsContainer.appendChild(star);
        }

        // Space Particles Canvas
        const canvas = document.getElementById('spaceCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 100;
        const mouse = { x: null, y: null, radius: 150 };

        // Mouse trail
        const trail = [];
        const trailLength = 20;

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;

            trail.push({ x: e.x, y: e.y, life: 1 });
            if (trail.length > trailLength) trail.shift();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = ['#d4af37', '#ffa500', '#d4c5a9'][Math.floor(Math.random() * 3)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const dirX = dx / distance;
                    const dirY = dy / distance;
                    this.x -= dirX * force * 3;
                    this.y -= dirY * force * 3;
                }

                // Wrap around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Connect nearby particles
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(212, 175, 55, ${1 - distance / 120})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw mouse trail
        function drawTrail() {
            for (let i = 0; i < trail.length; i++) {
                const t = trail[i];
                const alpha = (i / trail.length) * t.life;
                const size = (i / trail.length) * 8;

                ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ffa500';
                ctx.beginPath();
                ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
                ctx.fill();

                t.life -= 0.02;
            }

            // Remove dead trail points
            for (let i = trail.length - 1; i >= 0; i--) {
                if (trail[i].life <= 0) trail.splice(i, 1);
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            drawTrail();

            requestAnimationFrame(animate);
        }

        animate();

        // Gallery Image Overlay
        const overlay = document.getElementById('overlay');
        const overlayImage = document.getElementById('overlayImage');
        const overlayCaption = document.getElementById('overlayCaption');
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.querySelector('.gallery-caption');

                overlayImage.src = img.src;
                overlayCaption.textContent = caption.textContent;
                overlay.classList.add('active');
            });
        });

        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    </script>
    <script src="https://www.youtube.com/iframe_api"></script>

        <script>
const ytToggle = document.getElementById('yt-toggle');
const ytIframe = document.getElementById('yt-video');

let isPlaying = true;

ytToggle.addEventListener('click', () => {
    // postMessage command: https://developers.google.com/youtube/iframe_api_reference
    ytIframe.contentWindow.postMessage('{"event":"command","func":"' + (isPlaying ? 'pauseVideo' : 'playVideo') + '","args":""}', '*');

    ytToggle.textContent = isPlaying ? '▶ PLAY' : '❚❚ PAUSE';
    isPlaying = !isPlaying;
});
