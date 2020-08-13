const vid = document.getElementById("round")
const cum = document.querySelector('.particles-js-canvas-el')

vid.addEventListener('click', () => {
    vid.playbackRate = 2
    setTimeout(() => {
        vid.playbackRate = 1
        cum.click()
    }, 3000)
});