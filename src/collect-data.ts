//---------------------------------------------------------------------------

export async function collectData(): Promise<string> {
    const html = document.documentElement.outerHTML;

    // get version 1.0 of the player items url
    let itemsUrl = getPlayerItemsUrl_v1_0();
    
    if (!itemsUrl) {

        // get version 0.0 of the player items url
        itemsUrl = getPlayerItemsUrl_v0_0(html); //https://coursehunter.net/course/208/lessons"
    }

    const items = await fetchItems(itemsUrl);

    return buildResult(html, itemsUrl, items);
}

async function fetchItems(itemsUrl: string | undefined): Promise<string | undefined> {
    if (!itemsUrl) {
        console.error("Cannot find player items link");
        return undefined;
    }

    const res = await fetch(itemsUrl);

    if (!res.ok) {
        console.error("Cannot fetch itemsUrl to get player items");
        return undefined;
    }

    return await res.text();
}

//---------------------------------------------------------------------------

type BuildResult = {
    a: string;
    docurl: string;
    itemsurl: string;
    doc: string;
    items: string | undefined;
};

async function buildResult(html: string, itemsUrl: string, items: string | undefined): Promise<string> {
    
    const buildResult: BuildResult = {
        a: 'tm',
        docurl: document.location.href,
        itemsurl: itemsUrl,
        doc: html,
        items: items,
    };

    return JSON.stringify(buildResult);
}

//---------------------------------------------------------------------------

function getPlayerItemsUrl_v0_0(html: string): string {
    const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
    let m: RegExpExecArray | null = reAxiosItemsQuery.exec(html);
    return m ? `https://coursehunter.net${m[0]}` : '';
}

//---------------------------------------------------------------------------

function getPlayerItemsUrl_v1_0(): string {
    const id = getLessonsId();
    return id ? `https://coursehunter.net/api/v1/course/${id}/lessons` : '';

    function getLessonsId() {
        /*  
            // devtools console version
            [...$$('head > script')].forEach((script) => {
                const text = script.innerText || '';
                const m = scriptText.match(/"mpn": "(\d{3,8})"/);
                text && console.log(script, m);
            })            
        */
        let id = [...document.querySelectorAll<HTMLElement>('head > script')]
            .map(
                (script) => {
                    const scriptText = script.innerText || '';
                    const m = scriptText.match(/"mpn": "(\d{3,8})"/);
                    return m?.[1];
                }
            )
            .filter(Boolean)[0];

        if (!id) {
            // <script>var course_id = 5734;</script>
            id = [...document.querySelectorAll<HTMLElement>('body > script')]
                .map(
                    (script) => {
                        const scriptText = script.innerText || '';
                        const m = scriptText.match(/course_id = (\d{3,8})/);
                        return m?.[1];
                    }
                )
                .filter(Boolean)[0];
        }

        return id;
    }
}
