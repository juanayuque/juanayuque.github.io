document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('demo-canvas');
    if (!canvas) {
        console.error("Can't find the canvas element");
        return;
    }

    var ctx = canvas.getContext('2d');
    var nodes = [];
    var cursor = { x: -1, y: -1, radius: 1000 };

    function createNodes(count) {
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1
            });
        }
    }

    function drawNode(node) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(156, 217, 249, 0.7)';
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            drawNode(node);
        });

        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top;

        nodes.forEach(node => {
            var dx = cursor.x - node.x;
            var dy = cursor.y - node.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < cursor.radius && distance > 0) {
                var forceDirectionX = dx / distance;
                var forceDirectionY = dy / distance;
                var maxDistance = cursor.radius;
                var force = (maxDistance - distance) / maxDistance;

                node.vx += forceDirectionX * force * 0.6;
                node.vy += forceDirectionY * force * 0.6;
            }
        });
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    createNodes(100);
    animate();
});
