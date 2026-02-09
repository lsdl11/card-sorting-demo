/**
 * shared_ui.js
 * Shared card-creation helpers, layout constants, and utility functions
 * used by both the demonstration phase and the card sort phase.
 * No dependencies — load before demo_ui.js and card_sort_ui.js.
 */
const SharedUI = (() => {

    const SVG_NS = 'http://www.w3.org/2000/svg';

    /* ================================================================
       Layout constants – mirror the CSS slot values exactly
       ================================================================ */
    const SLOT_POSITIONS = [
        { left: '38%',   top: '14.5%' },   // choice slot 0 (leftmost)
        { left: '59.5%', top: '14.5%' },   // choice slot 1
        { left: '81%',   top: '14.5%' }    // choice slot 2 (rightmost)
    ];
    const INCIDENTAL_SLOT = { left: '22%', top: '14.5%' };  // left of slot 0
    const STIMULUS_POS    = { left: '6%',  top: '62.5%' };

    /* ================================================================
       SVG shape definitions
       ================================================================ */
    const SHAPE_DATA = {
        Star: {
            tag: 'polygon',
            attrs: { points: '20,2 24.4,13.9 37.1,14.4 27.1,22.3 30.6,34.6 20,27.5 9.4,34.6 12.9,22.3 2.9,14.4 15.6,13.9' }
        },
        Circle: {
            tag: 'circle',
            attrs: { cx: '20', cy: '20', r: '17' }
        },
        Triangle: {
            tag: 'polygon',
            attrs: { points: '20,4 38,36 2,36' }
        }
    };

    /* ================================================================
       Helpers
       ================================================================ */

    /** Promise-based delay. */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** Smoothly move an absolutely-positioned element to new coordinates. */
    function moveCard(el, left, top, duration = 600) {
        return new Promise(resolve => {
            el.style.transition =
                `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out`;
            el.style.left = left;
            el.style.top  = top;
            setTimeout(resolve, duration);
        });
    }

    /* ================================================================
       Card DOM creation
       ================================================================ */

    /** Create a single SVG element for one shape instance. */
    function createShapeSVG(shapeName) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'shape');
        svg.setAttribute('viewBox', '0 0 40 40');

        const data = SHAPE_DATA[shapeName];
        const el   = document.createElementNS(SVG_NS, data.tag);
        for (const [attr, val] of Object.entries(data.attrs)) {
            el.setAttribute(attr, val);
        }
        svg.appendChild(el);
        return svg;
    }

    /**
     * Build a full card DOM element for { color, shape, number }.
     * Fill colour comes from the CSS .color-xxx rules in styles.css.
     */
    function createCardElement(card, position) {
        const div = document.createElement('div');
        div.className = `card color-${card.color.toLowerCase()}`;
        div.style.left = position.left;
        div.style.top  = position.top;

        const shapesDiv = document.createElement('div');
        shapesDiv.className = `shapes count-${card.number}`;

        if (card.number === 1) {
            const row = document.createElement('div');
            row.className = 'shape-row';
            row.appendChild(createShapeSVG(card.shape));
            shapesDiv.appendChild(row);

        } else if (card.number === 2) {
            const row = document.createElement('div');
            row.className = 'shape-row';
            row.appendChild(createShapeSVG(card.shape));
            row.appendChild(createShapeSVG(card.shape));
            shapesDiv.appendChild(row);

        } else {
            const row1 = document.createElement('div');
            row1.className = 'shape-row';
            row1.appendChild(createShapeSVG(card.shape));
            row1.appendChild(createShapeSVG(card.shape));
            shapesDiv.appendChild(row1);

            const row2 = document.createElement('div');
            row2.className = 'shape-row';
            row2.appendChild(createShapeSVG(card.shape));
            shapesDiv.appendChild(row2);
        }

        div.appendChild(shapesDiv);
        return div;
    }

    /** Remove all .card elements from a container. */
    function clearCards(container) {
        container.querySelectorAll('.card').forEach(el => el.remove());
    }

    return {
        SLOT_POSITIONS,
        INCIDENTAL_SLOT,
        STIMULUS_POS,
        delay,
        moveCard,
        createCardElement,
        clearCards
    };
})();
