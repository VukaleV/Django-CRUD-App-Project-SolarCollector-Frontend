import React, { useEffect } from 'react';

const Starfield = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 500;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        dx: (Math.random() - 0.5) * 0.5, 
        dy: (Math.random() - 0.5) * 0.5, 
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5,5,20,0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.z -= 2; 
        star.x += star.dx;
        star.y += star.dy;

        
        if (star.z <= 0 || star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
          star.z = canvas.width;
          star.dx = (Math.random() - 0.5) * 0.5;
          star.dy = (Math.random() - 0.5) * 0.5;
        }

        const sx = (star.x - canvas.width / 2) / star.z * canvas.width + canvas.width / 2;
        const sy = (star.y - canvas.height / 2) / star.z * canvas.height + canvas.height / 2;
        const radius = (1 - star.z / canvas.width) * 3;

        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${1 - star.z / canvas.width})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
};

export default Starfield;







