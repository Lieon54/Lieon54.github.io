document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const stepsCount = document.getElementById('stepsCount');
    const stepSize = 20;

    let steps = localStorage.getItem('steps') ? parseInt(localStorage.getItem('steps')) : 0;
    let position = localStorage.getItem('position') ? JSON.parse(localStorage.getItem('position')) : { x: 200, y: 200 };

    stepsCount.textContent = steps;

    function drawCharacter() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(position.x, position.y, 20, 20);
    }

    function moveCharacter(direction) {
        switch (direction) {
            case 'up':
                if (position.y - stepSize >= 0) position.y -= stepSize;
                break;
            case 'down':
                if (position.y + stepSize < canvas.height) position.y += stepSize;
                break;
            case 'left':
                if (position.x - stepSize >= 0) position.x -= stepSize;
                break;
            case 'right':
                if (position.x + stepSize < canvas.width) position.x += stepSize;
                break;
        }
        steps++;
        localStorage.setItem('steps', steps);
        localStorage.setItem('position', JSON.stringify(position));
        stepsCount.textContent = steps;
        drawCharacter();
    }

    document.getElementById('up').addEventListener('click', () => moveCharacter('up'));
    document.getElementById('left').addEventListener('click', () => moveCharacter('left'));
    document.getElementById('right').addEventListener('click', () => moveCharacter('right'));
    document.getElementById('down').addEventListener('click', () => moveCharacter('down'));

    drawCharacter();
});
