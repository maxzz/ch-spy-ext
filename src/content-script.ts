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
            #tm-code {
                max-width: 1px;
                opacity: 0;
            }
            #tm-info.copied {
                background-color: green;
                color: white;
                display: block;
            }
            #tm-info.failed {
                background-color: red;
                color: white;
                display: block;
                min-width: 10rem;
            }
        </style>

        <div id="tm-root">
            <div>
                <button>O</button>
                <input id="tm-code" spellcheck="false">
            </div>
            <div id="tm-info"></div>
        </div>
    `;

    let btn = container.querySelector('button');
    let code = container.querySelector('#tm-code') as HTMLInputElement;
    let info = container.querySelector('#tm-info') as HTMLElement;

    function showResult(ok: boolean) {
        let className = ok ? 'copied' : 'failed';
        let delay = ok ? 500 : 1500;
        info.innerText = ok ? 'copied' : 'failed. check console.';
        info.classList.add(className);
        setTimeout(() => info.classList.remove(className), delay);
    }

    function copyToClipboard() {
        const el = code;
        el.select();
        el.setSelectionRange(0, 9999999);
        document.execCommand('copy');
        showResult(true);
    }

    async function collectData() {
        let html = document.documentElement.outerHTML;

        function getPlayerItemsUrl(html: string): string {
            const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
            let m: RegExpExecArray | null = reAxiosItemsQuery.exec(html);
            return m ? `https://coursehunter.net${m[0]}` : '';
        }

        let itemsUrl = getPlayerItemsUrl(html); //https://coursehunter.net/course/208/lessons"
        if (!itemsUrl) {
            throw new Error("Cannot find play items link");
        }
        
        //itemsUrl='';
        let res = await fetch(itemsUrl);
        let items = res.ok && await res.json();
        if (!items) {
            throw new Error("Cannot fetch play items");
        }

        let source = {
            doc: html,
            items: items,
        }

        code.value = JSON.stringify('source');

        console.log('tm result:', code.value);
    }

    btn?.addEventListener('click', async (e) => {
        try {
            await collectData();
            copyToClipboard();
        } catch (error) {
            showResult(false);
            console.log('tm error', error);
        }
    }, false);

    //console.log(btn, code, info);

    document.body.insertBefore(container, document.body.firstElementChild);
}

init();
