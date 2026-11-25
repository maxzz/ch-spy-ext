(function() {
	// src/collect-data.ts
	async function collectData() {
		const docHtml = document.documentElement.outerHTML;
		let itemsUrl = getPlayerItemsUrl_v2_0();
		if (!itemsUrl) itemsUrl = getPlayerItemsUrl_v1_0();
		if (!itemsUrl) itemsUrl = getPlayerItemsUrl_v0_0(docHtml);
		const items = await fetchItems(itemsUrl);
		return {
			docHtml,
			itemsUrl,
			items
		};
	}
	async function fetchItems(itemsUrl) {
		if (!itemsUrl) {
			console.error("Cannot find player items link");
			return;
		}
		const res = await fetch(itemsUrl);
		if (!res.ok) {
			console.error("Cannot fetch itemsUrl to get player items");
			return;
		}
		return await res.text();
	}
	function buildResult(collectedData) {
		const buildResult = {
			a: "tm",
			docurl: document.location.href,
			itemsurl: collectedData.itemsUrl,
			doc: collectedData.docHtml,
			items: collectedData.items
		};
		return JSON.stringify(buildResult, null, 2);
	}
	function getPlayerItemsUrl_v0_0(html) {
		let m = /\/course\/\d{3,10}?\/lessons/g.exec(html);
		const url = m ? `https://coursehunter.net${m[0]}` : "";
		if (url) console.log("Player list v0 (01.19.20 17:00) \"%s\"", url);
		return url;
	}
	function getPlayerItemsUrl_v1_0() {
		const id = getLessonsId();
		const url = id ? `https://coursehunter.net/api/v1/course/${id}/lessons` : "";
		if (url) console.log("Player list v1 (02.19.21 18:00) \"%s\"", url);
		return url;
		function getLessonsId() {
			let id = [...document.querySelectorAll("head > script")].map((script) => {
				return (script.innerText || "").match(/"mpn": "(\d{3,8})"/)?.[1];
			}).filter(Boolean)[0];
			if (!id) id = [...document.querySelectorAll("body > script")].map((script) => {
				return (script.innerText || "").match(/course_id = (\d{3,8})/)?.[1];
			}).filter(Boolean)[0];
			return id;
		}
	}
	function getPlayerItemsUrl_v2_0() {
		const id = getLessonsId();
		const url = id ? `https://coursehunter.net/api/v1/course/${id}/lessons` : "";
		if (url) console.log("Player list v2 (11.23.26 19:54) \"%s\"", url);
		return url;
		function getLessonsId() {
			return document.querySelector("body")?.getAttribute("data-course-id");
		}
	}
	// src/content-script.ts
	function main() {
		let collectedData;
		let container = createContainer();
		let ui = initUi(container);
		addListeners(ui);
		document.body.insertBefore(container, document.body.firstElementChild);
		function showResult(ok) {
			let className = ok ? !collectedData?.itemsUrl || !collectedData?.items ? "partially" : "copied" : "failed";
			let delay = ok ? 500 : 1500;
			ui.info.innerText = ok ? "Copied" : "Failed: check console for details.";
			ui.info.classList.add(className);
			setTimeout(() => ui.info.classList.remove(className), delay);
		}
		async function copyToClipboard() {
			try {
				await navigator.clipboard.writeText(ui.code.value);
				showResult(true);
			} catch (error) {
				console.log("Error copying to clipboard", error);
				showResult(false);
			}
		}
		function createContainer() {
			let container = document.createElement("div");
			container.style.position = "absolute";
			container.style.left = "0";
			container.style.top = "0";
			container.style.zIndex = "1000";
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
                #tm-info.partially {
                    background-color: oklch(0.41 0.18 263.57);
                    color: white;
                    display: block;
                    min-width: 10rem;
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
			let _btns = container.querySelector("#tm-btns");
			let [_btncopy, _btnclose] = _btns?.querySelectorAll("button");
			return {
				btn: container.querySelector("#tm-run"),
				btns: _btns,
				btncopy: _btncopy,
				btnclose: _btnclose,
				code: container.querySelector("#tm-code"),
				info: container.querySelector("#tm-info")
			};
		}
		function addListeners(ui) {
			ui.btn?.addEventListener("click", async (e) => {
				try {
					ui.btns.style.display = "none";
					ui.code.style.display = "none";
					ui.code.value = "";
					collectedData = await collectData();
					ui.code.value = buildResult(collectedData);
					ui.code.style.display = "block";
					ui.btns.style.display = "flex";
					console.log("tm done");
				} catch (error) {
					ui.btns.style.display = "none";
					showResult(false);
					console.log("tm error", error);
				}
			}, false);
			ui.btncopy?.addEventListener("click", () => {
				copyToClipboard();
			}, false);
			ui.btnclose?.addEventListener("click", () => {
				ui.btns.style.display = "none";
				ui.code.style.display = "none";
				ui.code.value = "";
			}, false);
		}
	}
	main();
})();
