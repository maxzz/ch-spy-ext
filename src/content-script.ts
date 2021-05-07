function init() {
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    // container.style.width = '100px';
    // container.style.height = '50px';
    container.style.zIndex = '1000';
    // container.style.backgroundColor = 'red';

    container.innerHTML = `
        <style>
            #tm-root > * {
                margin: 0;
                font-family: sans-serif;
            }
            #tm-info {
                position: absolute;
                top: 0;
                left: 2rem;
                font-size: .7rem;
                padding: .2rem .4rem;
                display: none;
                border-radius: 3px;
            }
            #tm-info.copied {
                background-color: green;
                color: white;
                display: block;
            }
        </style>

        <div id="tm-root">
            <div>
                <button>O</button>
                <input id="tm-code" style="max-width: 1px; opacity: 0" spellcheck="false" value="some code">
            </div>

            <div id="tm-info">
                copied
            </div>
        </div>
    `;
    let btn = container.querySelector('button');
    let code = container.querySelector('#tm-code') as HTMLInputElement;
    let info = container.querySelector('#tm-info') as HTMLElement;

    function copyToClipboard(e: MouseEvent) {
        const el = code;
        el.select();
        el.setSelectionRange(0, 9999999);
        document.execCommand('copy');
        info.classList.add('copied');
    
        setTimeout(() => {
            info.classList.remove('copied');
        }, 500);
    }

    function collectData() {
        //let
    }
    
    btn?.addEventListener('click', (e) => {
        copyToClipboard(e);
    }, false);

    console.log(btn, code, info);

    document.body.insertBefore(container, document.body.firstElementChild);
}

init();
