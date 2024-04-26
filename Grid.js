import propsTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

const Grid = (props) => {
    const [hCells, setHCells] = useState(0);
    const gRef = useRef(null);

    const calcHCells = () => {
        const offsetWidth = gRef.current ? gRef.current.offsetWidth : 0;
        setHCells(Math.min(Math.max(Math.floor(offsetWidth / props.elementWidthPx), 1), props.maxElementsInRow));
    }

    useEffect(() => {
        if (!hCells) { calcHCells(); }
        window.addEventListener('resize', calcHCells, false);
    }, [gRef.current]);

    let buffer = new Array();

    return (
        <div ref={gRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', width: props.width, height: props.height, overflowY: 'auto' }}>
            {
                props.elements.map((_, idx) => {
                    if ((idx !== 0 && idx % hCells === 0 && idx !== props.elements.length - 1)) {
                        let ret = <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: props.width, marginBottom: props.rowMarginPx }}>
                            {buffer.map(x => <div style={{}}>{props.elements[x]}</div>)}
                        </div>
                        buffer = [idx];
                        return ret
                    }
                    else if (idx === props.elements.length - 1) {
                        let ret = <></>
                        if (buffer.length >= hCells) {
                            ret = <>
                                {/* Cache Sync */}
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: props.width, marginBottom: props.rowMarginPx }}>
                                    {buffer.map(x => <div style={{}}>{props.elements[x]}</div>)}
                                </div>
                                {/* -1 */}
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: props.width, marginBottom: props.rowMarginPx }}>
                                    <div style={{}}>{props.elements[idx]}</div>
                                </div>
                            </>
                        }
                        else {
                            buffer.push(idx);
                            const pHolders = hCells - buffer.length;
                            ret = <>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: props.width, marginBottom: props.rowMarginPx }}>
                                    {buffer.map(x => <div style={{}}>{props.elements[x]}</div>)}
                                    {
                                        /* Generate Placeholders */
                                        pHolders > 0 && [...Array(pHolders).keys()].map(i => <div key={i} style={{ width: props.elementWidthPx, height: props.elementHeightPx }}></div>)
                                    }
                                </div>
                            </>
                        }
                        return ret
                    }
                    else { buffer.push(idx); }
                })
            }
        </div>
    )
}

Grid.propsTypes = {
    width: propsTypes.any.isRequired,
    height: propsTypes.any.isRequired,
    maxElementsInRow: propsTypes.number.isRequired,
    elements: propsTypes.array.isRequired,
    elementWidthPx: propsTypes.number.isRequired,
    elementHeightPx: propsTypes.number.isRequired,
    elementMarginPx: propsTypes.number.isRequired
}

export default Grid
