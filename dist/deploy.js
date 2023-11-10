function main() {
    let container = createContainer();
    let ui = initUi(container);
    addListeners(ui);
    document.body.insertBefore(container, document.body.firstElementChild);
    async function collectData() {
        const html = document.documentElement.outerHTML;
        let itemsUrl = getPlayerItemsUrl_v1_0();
        if (!itemsUrl) {
            itemsUrl = getPlayerItemsUrl_v0_0(html);
            if (!itemsUrl) {
                throw new Error("Cannot find play items link");
            }
        }
        const res = await fetch(itemsUrl);
        const items = res.ok && await res.text();
        if (!res.ok) {
            throw new Error("Cannot fetch play items");
        }
        return JSON.stringify({
            a: 'tm',
            docurl: document.location.href,
            itemsurl: itemsUrl,
            doc: html,
            items: items,
        });
        function getPlayerItemsUrl_v0_0(html) {
            const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
            let m = reAxiosItemsQuery.exec(html);
            return m ? `https://coursehunter.net${m[0]}` : '';
        }
        function getPlayerItemsUrl_v1_0() {
            const id = getLessonsId();
            return id ? `https://coursehunter.net/api/v1/course/${id}/lessons` : '';
            function getLessonsId() {
                let id = [...document.querySelectorAll('head > script')]
                    .map((script) => {
                    const scriptText = script.innerText || '';
                    const m = scriptText.match(/"mpn": "(\d{3,8})"/);
                    return m?.[1];
                }).filter(Boolean)[0];
                if (!id) {
                    id = [...document.querySelectorAll('body > script')]
                        .map((script) => {
                        const scriptText = script.innerText || '';
                        const m = scriptText.match(/course_id = (\d{3,8})/);
                        return m?.[1];
                    }).filter(Boolean)[0];
                }
                return id;
            }
        }
    }
    function showResult(ok) {
        let className = ok ? 'copied' : 'failed';
        let delay = ok ? 500 : 1500;
        ui.info.innerText = ok ? 'copied' : 'failed. check console.';
        ui.info.classList.add(className);
        setTimeout(() => ui.info.classList.remove(className), delay);
    }
    function copyToClipboard() {
        const el = ui.code;
        el.select();
        el.setSelectionRange(0, 9999999);
        document.execCommand('copy');
        showResult(true);
    }
    function createContainer() {
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '0';
        container.style.top = '0';
        container.style.zIndex = '1000';
        container.innerHTML = `
            <style>
                #tm-root > * {
                    margin: 0;
                    font-family: Avenir, Helvetica, Arial, sans-serif;
                    font-size: .6rem;
                }
                #tm-root button {
                    border: 1px solid #272727;
                }
                #tm-btns {
                    display: none;
                    margin-left: .2rem;
                }
                #tm-code {
                    /*max-width: 1px; opacity: 0;*/
                    display: none;
                    font-size: .5rem;
                    margin-left: .2rem;
                }
                #tm-info {
                    position: absolute;
                    top: 1.4rem;
                    left: 1.2rem;
                    font-size: .9rem;
                    padding: .2rem .4rem;
                    display: none;
                    border-radius: 3px;
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
                <div style="display: flex">
                    <button id="tm-run">o</button>
    
                    <div id="tm-btns">
                        <button>copy</button>
                        <button style="margin-left: -1px">x</button>
                    </div>
    
                    <input id="tm-code" spellcheck="false">
                </div>
                <div id="tm-info"></div>
            </div>
        `;
        return container;
    }
    function initUi(container) {
        let _btns = container.querySelector('#tm-btns');
        let [_btncopy, _btnclose] = _btns?.querySelectorAll('button');
        let ui = {
            btn: container.querySelector('#tm-run'),
            btns: _btns,
            btncopy: _btncopy,
            btnclose: _btnclose,
            code: container.querySelector('#tm-code'),
            info: container.querySelector('#tm-info'),
        };
        return ui;
    }
    function addListeners(ui) {
        ui.btn?.addEventListener('click', async (e) => {
            try {
                ui.btns.style.display = 'none';
                ui.code.style.display = 'none';
                ui.code.value = '';
                let collectedData = await collectData();
                ui.code.value = collectedData;
                ui.code.style.display = 'block';
                ui.btns.style.display = 'flex';
                console.log('tm done');
            }
            catch (error) {
                ui.btns.style.display = 'none';
                showResult(false);
                console.log('tm error', error);
            }
        }, false);
        ui.btncopy?.addEventListener('click', () => {
            copyToClipboard();
        }, false);
        ui.btnclose?.addEventListener('click', () => {
            ui.btns.style.display = 'none';
            ui.code.style.display = 'none';
            ui.code.value = '';
        }, false);
    }
}
main();
