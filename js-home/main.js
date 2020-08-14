const drochilo = document.getElementById("round")
const cum = document.querySelector('.particles-js-canvas-el')
const cumshow = document.querySelector('.c')

drochilo.addEventListener('click', () => {
    drochilo.classList.add('speed-boost-1')
    drochilo.style.pointerEvents = 'none';
    setTimeout(() => {
        drochilo.classList.remove('speed-boost-1')
        drochilo.classList.add('speed-boost-2')
        setTimeout(() => {
            drochilo.classList.remove('speed-boost-2')
            drochilo.style.pointerEvents = 'all';
        }, 4000);
    }, 4000);
});
