const hardMode = (statsEnabled, shouldRestoreCont) => {
	// state
	let state = statsEnabled
		? {
			windowArea: parseFloat(window.innerHeight * window.innerWidth),
			cleanedArea: 0,
			numbOfItems: 0,
			restored: 0
		}
		: {
			windowArea: parseFloat(window.innerHeight * window.innerWidth)
		}

	// unmutable
	const doc = document.documentElement
	const body = document.body
	const elems = body.getElementsByTagName("*")

	// methods
	const checkElem = element => {
		if (!isDecentElem(element)) return

		const elemPosStyle = getStyle(element, 'position')
		if ((elemPosStyle == 'fixed') ||
	    	(elemPosStyle == 'sticky')) {

			if (element.getAttribute('data-PopUpOFF') === 'notification')
	        	return

	        if (getStyle(element, 'display') != 'none') {
	        	element.setAttribute('data-popupoffExtension', 'hello')
	        }

			if (statsEnabled) state = addItemToStats(element, state)

	        setPropImp(element, "display", "none")
			setTimeout(() => element ? setPropImp(element, "display", "none") : false, 10)
	    }

	    state = additionalChecks(element, state, statsEnabled, shouldRestoreCont, checkElem)
	}

	// watch DOM
	const prevLoop = () => {
		if (infiniteLoopPreventCounter > 1200) {
			removeDomWatcher(domObserver, wasNotStoped, body, domObserverLight, action)
			return true
		}
		infiniteLoopPreventCounter++
		if (myTimer === 0) {
			myTimer = setTimeout(() => resetLoopCounter(infiniteLoopPreventCounter, myTimer), 1000)
		}
		return false
	}
	const watchDOM = () => {
		if (!domObserver) {
			domObserver = new MutationObserver(mutations => {
				state = watchMutations(mutations, shouldRestoreCont, statsEnabled, state, doc, body, prevLoop, checkElem)
			})
		}

		if (window.location.href.includes('pinterest')) {
			// cant deal with this website, i guess there will be array of this-one-like websites or I find out another solution
			domObserverLight = new MutationObserver(mutation => {
				mutation.map(item => {
					state = removeOverflow(statsEnabled, state, doc, body)
				})
			})
			domObserverLight.observe(doc, {
				attributes: true
			})
			domObserverLight.observe(body, {
				attributes: true
			})
		} else {
			domObserver.observe(doc, {
				childList: true,
				subtree: true,
				attributes: true
			})
		}
	}

	const action = elems => {
		state = removeOverflow(statsEnabled, state, doc, body)
		checkElems(elems, checkElem)
		if (shouldRestoreCont)
			state = findHidden(state, statsEnabled, doc)
		watchDOM()
	}

	// Let the hunt begin!
	action(elems)
	// statistics
	// if (statsEnabled) {
	// 	setNewData(state)
	// 	if (!beforeUnloadAactive) {
	// 		window.addEventListener("beforeunload", () => { setNewData(state) })
	// 		beforeUnloadAactive = true
	// 	}
	// }
}