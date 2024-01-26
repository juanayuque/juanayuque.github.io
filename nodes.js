document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('demo-canvas');
    if (!canvas) {
        console.error("Can't find the canvas element");
        return;
    }

    var ctx = canvas.getContext('2d');
    var nodes = [];
    var cursor = { x: canvas.width / 2, y: canvas.height / 2 };
    var repositionInterval = 6000; // Interval for nodes to reposition (milliseconds)
    var repositionDuration = 1000; // Duration of repositioning (milliseconds)
    var followingSpeed = 1.5; // Speed of nodes following the cursor

    function createNodes(count) {
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                followCursor: i < count / 2, // Half the nodes follow the cursor
                repositioning: false,
                repositionTimer: 0,
                targetX: null,
                targetY: null
            });
        }
    }

    function drawNode(node) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(156, 217, 249, 0.7)';
        ctx.fill();
    }

    function updateNodePosition(node, deltaTime) {
        if (node.followCursor) {
            if (node.repositioning) {
                node.repositionTimer += deltaTime;
                
                // Smoothly move towards the target position
                var targetDx = node.targetX - node.x;
                var targetDy = node.targetY - node.y;
                node.vx += targetDx / repositionDuration * deltaTime;
                node.vy += targetDy / repositionDuration * deltaTime;

                if (node.repositionTimer >= repositionDuration) {
                    node.repositioning = false;
                    node.repositionTimer = 0;
                }
            } else {
                node.repositionTimer += deltaTime;
                if (node.repositionTimer >= repositionInterval) {
                    node.repositioning = true;
                    node.repositionTimer = 0;
                    // Set a new random target position within the canvas
                    node.targetX = Math.random() * canvas.width;
                    node.targetY = Math.random() * canvas.height;
                }

                // Node follows cursor
                var dx = cursor.x - node.x;
                var dy = cursor.y - node.y;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 1) {
                    node.vx = dx / distance * followingSpeed;
                    node.vy = dy / distance * followingSpeed;
                }
            }
        } else {
            // Node moves randomly
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        }

        node.x += node.vx;
        node.y += node.vy;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var deltaTime = Date.now() - lastFrameTime;
        lastFrameTime = Date.now();

        nodes.forEach(node => {
            updateNodePosition(node, deltaTime);
            drawNode(node);
        });

        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cursor.x = canvas.width / 2;
        cursor.y = canvas.height / 2;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    var lastFrameTime = Date.now();
    createNodes(100);
    animate();
});
