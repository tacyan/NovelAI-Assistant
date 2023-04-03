(() => {
    let lastSelected = null;
    let isPressedShiftKey = false;

    const getCurrentSelection = () => {
        if (lastSelected !== null) return lastSelected;
        return [...document.querySelectorAll('[role=button]')].filter((img) => getComputedStyle(img).border.includes('rgb(245, 243, 194)'))[0];
    }

    const emulatePaginate = (direction) => {
        const currentSelection = getCurrentSelection();
        if (currentSelection === undefined) return;

        try {
            switch (direction) {
                case 'Up': {
                    lastSelected = currentSelection.previousElementSibling;
                    break;
                }
                case 'Down': {
                    lastSelected = currentSelection.nextElementSibling;
                    break;
                }
            }

            lastSelected.click();
            lastSelected.scrollIntoView();
        } catch (_) {}
    }

    document.body.addEventListener('wheel', ({ deltaY }) => {
        if (!isPressedShiftKey) return;
        emulatePaginate(deltaY > 0 ? 'Up' : 'Down');
    })

    document.body.addEventListener('keyup', ({ key }) => {
       if (key === 'Shift' && isPressedShiftKey) isPressedShiftKey = false;
    })

    document.body.addEventListener('keydown', ({ key, shiftKey }) => {
        isPressedShiftKey = shiftKey;
        if (document.activeElement.nodeName === 'INPUT') return;

        switch (key) {
            case 'ArrowUp': {
                emulatePaginate('Up')
                break;
            }
            case 'ArrowDown': {
                emulatePaginate('Down')
                break;
            }
        }
    })
})();