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
            }
            .failed {
                background-color: red;
            }
            .copied {
                padding: .2rem .4rem;
                font-size: .8rem;
                background-color: green;
                color: white;
            }
        </style>

        <div id="tm-root">
            <div>
                <button>O</button>
            </div>

            <div id="tm-info" class="copied2">
                info
            </div>

            <!-- <div id="tm-code" style="display: none"> -->
            <input id="tm-code" style="display: none" value="copied">

        </div>
    `;
    let btn = container.querySelector('button');
    let code = container.querySelector('#tm-code') as HTMLInputElement;
    let info = container.querySelector('#tm-info') as HTMLElement;

    function copyToClipboard(e: MouseEvent) {
        const el = code;
        el.select();
        el.setSelectionRange(0, 9999999);
        if (document.execCommand('copy')) {
            info.classList.add('copied');
        } else {
            info.classList.add('failed');
        }
    
        setTimeout(() => {
            info.classList.remove('copied');
            info.classList.remove('failed');
        }, 1000);
    }
    
    btn?.addEventListener('click', (e) => {
        copyToClipboard(e);
    }, false);

    console.log(btn, code, info);

    document.body.insertBefore(container, document.body.firstElementChild);
}

init();
