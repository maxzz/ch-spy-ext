//---------------------------------------------------------------------------

export type CollectDataResult = {
    docHtml: string;
    itemsUrl: string | undefined;
    items: string | undefined;
};

export async function collectData(): Promise<CollectDataResult> {
    const docHtml = document.documentElement.outerHTML;

    // get version 2.0 of the player items url 11.23.26
    let itemsUrl = getPlayerItemsUrl_v2_0();

    if (!itemsUrl) {
        // get version 1.0 of the player items url
        itemsUrl = getPlayerItemsUrl_v1_0();
    }

    if (!itemsUrl) {
        // get version 0.0 of the player items url
        itemsUrl = getPlayerItemsUrl_v0_0(docHtml); //https://coursehunter.net/course/208/lessons"
    }

    const items = await fetchItems(itemsUrl);

    return {
        docHtml: docHtml,
        itemsUrl: itemsUrl,
        items: items,
    };
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
    a: 'tm';                      // magic string to identify the result
    docurl: string;               // document url
    itemsurl: string | undefined; // player items url; if undefined then cannot get url from document
    doc: string;                  // document html
    items: string | undefined;    // player items json; if undefined then cannot fetch items from url
};

export function buildResult(collectedData: CollectDataResult): string {

    const buildResult: BuildResult = {
        a: 'tm',
        docurl: document.location.href,
        itemsurl: collectedData.itemsUrl,
        doc: collectedData.docHtml,
        items: collectedData.items,
    };

    return JSON.stringify(buildResult, null, 2); // This will not work since we are using <input> and not <textarea>
}

//---------------------------------------------------------------------------

function getPlayerItemsUrl_v0_0(html: string): string {
    const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
    let m: RegExpExecArray | null = reAxiosItemsQuery.exec(html);
    const url = m ? `https://coursehunter.net${m[0]}` : '';
    if (url) {
        console.log('Player list v0 (01.19.20 17:00) "%s"', url);
    }
    return url;
}

//---------------------------------------------------------------------------

function getPlayerItemsUrl_v1_0(): string {
    const id = getLessonsId();
    const url = id ? `https://coursehunter.net/api/v1/course/${id}/lessons` : '';
    if (url) {
        console.log('Player list v1 (02.19.21 18:00) "%s"', url);
    }
    return url;

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

//---------------------------------------------------------------------------

function getPlayerItemsUrl_v2_0(): string { // 11.23.26
    const id = getLessonsId();
    const url = id ? `https://coursehunter.net/api/v1/course/${id}/lessons` : '';
    if (url) {
        console.log('Player list v2 (11.23.26 19:54) "%s"', url);
    }
    return url;

    function getLessonsId() {
        let body = document.querySelector<HTMLElement>('body');
        let id = body?.getAttribute('data-course-id');
        return id;
    }
}
