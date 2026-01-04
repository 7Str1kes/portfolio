export class FloatingParticle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    velocityX: number;
    velocityY: number;
    pulseSpeed: number;
    pulsePhase: number;
    color: string;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.velocityX = (Math.random() - 0.5) * 0.5;
        this.velocityY = (Math.random() - 0.5) * 0.5;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;

        const colors = [
            'rgba(168, 85, 247, ', // purple-500
            'rgba(147, 51, 234, ', // purple-600
            'rgba(139, 92, 246, ', // violet-500
            'rgba(124, 58, 237, '  // violet-600
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.pulsePhase += this.pulseSpeed;

        if (this.x < 0 || this.x > this.canvas.width) this.velocityX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.velocityY *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const currentOpacity = this.opacity * pulse;

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color + (currentOpacity * 0.8) + ')';

        ctx.fillStyle = this.color + currentOpacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

export function initParticles(canvasId: string, particleCount: number = 50) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles: FloatingParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(new FloatingParticle(canvas));
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

export function initFooterParticles(canvasId: string, particleCount: number = 30) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const footer = canvas.parentElement;
    if (!footer) return;

    function resizeCanvas() {
        if (!footer) return;
        canvas.width = footer.offsetWidth;
        canvas.height = footer.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: FloatingParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(new FloatingParticle(canvas));
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();
}
