let codeContainer: HTMLInputElement;
let codeContainerParent: HTMLElement;

const copyToClipboard = (e: MouseEvent) => {
    const el = codeContainer;
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');
    codeContainerParent.classList.add('copied');

    setTimeout(() => {
        codeContainerParent.classList.remove('copied');
    }, 1000);
};

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
        <div style="display: flex">
            <style>
                #tm-info1 {
                    background-color: red;
                }
                .copied {
                    padding: .2rem .4rem;
                    font-size: .8rem;
                    background-color: green;
                    color: white;
                }
            </style>
            <button>O</button>
            <div id="tm-info" style="margin-left: .4rem" class="copied">
                info
            </div>
            <div id="tm-code" style="display: none">
                copied
            </div>
        </div>
    `;
    let btn = container.querySelector('button');
    let code = container.querySelector('#tm-code');
    let info = container.querySelector('#tm-info');

    console.log(btn, code, info);

    document.body.insertBefore(container, document.body.firstElementChild);
}

init();
