//sites to open
var demoSites = [
    window.location.origin + '/leapin-lizards',
    'http://schneider.dev.geno.me',
    window.location.origin + '/verizon',
    'https://geno.me',
    window.location.origin + '/retro/index.html'
];

if (document.querySelector('#tabsplosion')) {
    document.querySelector('#tabsplosion').addEventListener('click', function() {
        demoSites.forEach(function(u) {
            console.log(u);
            var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
            link.href = u;
            link.target = '_blank';
            var event = new MouseEvent('click', {
                'view': window,
                'bubbles': false,
                'cancelable': true
            });
            link.dispatchEvent(event);
        });
    });
}

//slide controls
if (document.querySelector('#slides')) {

    var currentSlide = 0,
        controls = {
            down: document.querySelector('#controls-bottom'),
            left: document.querySelector('#controls-left'),
            right: document.querySelector('#controls-right'),
            up: document.querySelector('#controls-top')
        },
        controlTimeout,
        slides = Array.prototype.slice.call(document.querySelectorAll('#slides > section'));

    function disableControls() {
        for (var c in controls) {
            controls[c].setAttribute('disabled','disabled');
        }
    }

    function enableControls(slide) {
        clearTimeout(controlTimeout);
        disableControls();
        controlTimeout = setTimeout(function() {
            var directions = slides[slide].getAttribute('data-controls').split(',');
            var useLight = slide%2 !== 0;
            directions.forEach(function(d) {
                controls[d].removeAttribute('disabled');
                if (useLight) {
                    controls[d].className = 'light';
                }
                else {
                    controls[d].className = '';
                }
            });
        }, 301);
    }

    function setActiveSlide(slide) {
        slides.forEach(function(s, i) {
            s.setAttribute('data-active', i === slide);
        });
    }

    function previousSlide() {
        if (currentSlide === 0) {
            return false;
        }
        currentSlide--;
        switch(currentSlide) {
            case 6:
                slides[6].setAttribute('data-animation', 'enter-top');
                slides[7].setAttribute('data-animation', 'exit-bottom');
                break;
            case 5:
                slides[5].setAttribute('data-animation', 'enter-left');
                slides[6].setAttribute('data-animation', 'exit-right');
                break;
            case 4:
                slides[4].setAttribute('data-animation', 'enter-top');
                slides[5].setAttribute('data-animation', 'exit-bottom');
                break;
            case 3:
                slides[3].setAttribute('data-animation', 'enter-top');
                slides[4].setAttribute('data-animation', 'exit-bottom');
                break;
            case 2:
                slides[2].setAttribute('data-animation', 'enter-left');
                slides[3].setAttribute('data-animation', 'exit-right');
                break;
            case 1:
                slides[1].setAttribute('data-animation', 'enter-left');
                slides[2].setAttribute('data-animation', 'exit-right');
                break;
            case 0:
                slides[0].setAttribute('data-animation', 'enter-top');
                slides[1].setAttribute('data-animation', 'exit-bottom');
                break;
        }
        enableControls(currentSlide);
        setActiveSlide(currentSlide);
    }

    function nextSlide() {
        if (currentSlide === slides.length - 1) {
            return false;
        }
        currentSlide++;

        switch(currentSlide) {
            case 1:
                slides[0].setAttribute('data-animation', 'exit-top');
                slides[1].setAttribute('data-animation', 'enter-bottom');
                break;
            case 2: 
                slides[1].setAttribute('data-animation', 'exit-left');
                slides[2].setAttribute('data-animation', 'enter-right');
                break
            case 3:
                slides[2].setAttribute('data-animation', 'exit-left');
                slides[3].setAttribute('data-animation', 'enter-right');
                break;
            case 4:
                slides[3].setAttribute('data-animation', 'exit-top');
                slides[4].setAttribute('data-animation', 'enter-bottom');
                break;
            case 5:
                slides[4].setAttribute('data-animation', 'exit-top');
                slides[5].setAttribute('data-animation', 'enter-bottom');
                break;
            case 6:
                slides[5].setAttribute('data-animation', 'exit-left');
                slides[6].setAttribute('data-animation', 'enter-right');
                break;
            case 7:
                slides[6].setAttribute('data-animation', 'exit-top');
                slides[7].setAttribute('data-animation', 'enter-bottom');
                break;
        }

        enableControls(currentSlide);
        setActiveSlide(currentSlide);
    }

    setActiveSlide(currentSlide);

    controls.down.addEventListener('click', nextSlide);
    controls.right.addEventListener('click', nextSlide);
    controls.left.addEventListener('click', previousSlide);
    controls.up.addEventListener('click', previousSlide);

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 37:
            case 38:
                previousSlide();
                break;
            case 39:
            case 40:
                nextSlide();
                break;
        }
    });
}