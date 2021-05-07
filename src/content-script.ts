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
    container.style.width = '100px';
    container.style.height = '50px';
    container.style.backgroundColor = 'red';

    document.body.insertBefore(container, document.body.firstElementChild);
}

init();
