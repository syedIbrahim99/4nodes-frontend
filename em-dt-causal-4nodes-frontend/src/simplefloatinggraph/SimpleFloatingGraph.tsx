import { useCallback, useEffect, useState, useRef } from 'react';
import { useStore, EdgeText, EdgeLabelRenderer } from 'reactflow';
import { getEdgeParams } from './utils';
import { MdCancel } from "react-icons/md";
import { HiArrowLongRight } from "react-icons/hi2";

function SimpleFloatingEdge({ id, currentSource, currentTarget, currentvalue, source, target, markerEnd, style, onChange, lastUpdatedEdgeId, lastRecordedStrokeWidth, clickedNodeId, hideUnconnectedNodes }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isShowPopup, setIsShowPopup] = useState<boolean>(false);
    const [changedLinkWeight, setChangedLinkWeight] = useState<string>(style.strokeWidth);
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
    // const [isDashed, setIsDashed] = useState<number>(0);
    const [inValidNumber, setInValidNumber] = useState<boolean>(false)


    useEffect(() => {
        if (currentSource === source && currentTarget === target) {
            console.log(currentvalue)
            setChangedLinkWeight(currentvalue)
        }
    }, [currentSource])

    useEffect(() => {
        // Update the input value when the edge weight changes
        // if (Number(style.strokeWidth) < 0) {
        //     setIsDashed(5)
        // } else {
        //     setIsDashed(0)
        // }

        setChangedLinkWeight(style.strokeWidth);
    }, [style.strokeWidth]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                handleOnPopupClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (source === 'n1' && target === 'n4') {
        console.log(style.strokeWidth)
    }

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    const dx = tx - sx;
    const dy = ty - sy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const offsetX = dy / distance * 25; // Offset in the x-direction based on the y-difference
    const offsetY = dx / distance * 35; // Offset in the y-direction based on the x-difference

    const centerX = (sx + tx) / 2 + offsetX; // Adjusted centerX
    const centerY = (sy + ty) / 2 + offsetY; // Adjusted centerY
    const edgePath = `M ${sx} ${sy} Q ${centerX} ${centerY} ${tx} ${ty}`;
    const angle = Math.atan2(ty - sy, tx - sx) * (180 / Math.PI);

    // console.log(id, angle)


    const updateLinkWeight = () => {

        if (style.strokeWidth !== changedLinkWeight) {
            try {
                let weight = parseFloat(changedLinkWeight);
                if (!isNaN(weight)) { // Check if parsing was successful
                    onChange(id, weight, lastUpdatedEdgeId, lastRecordedStrokeWidth, source, target, clickedNodeId, hideUnconnectedNodes);
                    setIsShowPopup(false);
                    setInValidNumber(false);
                } else {
                    setInValidNumber(true);
                    throw new Error('Invalid number format');
                }
            } catch (error) {
                setInValidNumber(true);
            }
        }
    };


    const handleOnPopupClose = () => {
        setIsShowPopup(false);
        setChangedLinkWeight(style.strokeWidth);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue: number | string = e.target.value;

        // Allow only numbers or a hyphen at the beginning for negative numbers
        if (/^-?\d*\.?\d*$/.test(newValue) || newValue === '-') {
            setChangedLinkWeight(newValue);
        }

        e.target.focus()
    };

    return (
        <>
            <defs>
                <marker id={`arrow-${style.stroke}`} markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M0,0 L10,5 L0,10" fill={style.stroke} />
                </marker>
            </defs>

            <path
                onClick={() => {
                    setIsShowPopup(true);
                }}
                id={id}
                className="react-flow__edge-path cursor_pointer"
                d={edgePath}
                markerEnd={`url(#arrow-${style.stroke})`}
                markerHeight={10}
                markerWidth={10}
                style={{
                    ...style,
                    strokeDasharray: style.strokeDasharray,
                    strokeWidth: Math.abs(style.strokeWidth * 3),
                }}
            />
            {
                isShowPopup ? (<EdgeLabelRenderer>
                    <div className='edge-label nodrag nopan'
                        ref={containerRef}
                        style={{
                            transform: `translate(-50%, -50%) translate(${centerX}px,${centerY}px)`,
                            pointerEvents: 'all',
                            position: 'relative',
                            zIndex: '11111'
                        }}>

                        <MdCancel
                            style={{ position: "absolute", top: '-10px', right: '-2px', cursor: 'pointer' }}
                            onClick={handleOnPopupClose} // Handle click event here
                        />
                        <div className='px-1 d-flex align-items-center' style={{ position: "absolute", top: '-14px', left: '0', border: '1px solid black', borderRadius: '3px', backgroundColor: 'white', fontWeight: '500' }}>
                            {source} <HiArrowLongRight className='mx-1' fontSize={10} /> {target}
                        </div>
                        <input
                            type='number'
                            value={changedLinkWeight}
                            onChange={handleInputChange}
                            step={0.1}
                            autoFocus
                            style={{ border: inValidNumber ? '1px solid red' : '' }}
                        />
                        {
                            inValidNumber && <div className='px-1 d-flex align-items-center'
                                style={{
                                    position: "absolute",
                                    bottom: '-12px',
                                    left: '0',
                                    backgroundColor: 'white',
                                    fontWeight: '500',
                                    color: 'red'
                                }}>
                                Invalid Number
                            </div>
                        }

                        <button
                            className='edge-weight-submit'
                            onClick={updateLinkWeight}>Update</button>
                    </div>

                </EdgeLabelRenderer>) : (<EdgeText
                    x={centerX}
                    y={centerY}
                    label={style.strokeWidth}
                    labelStyle={{
                        fill: 'black',
                        // transform: `rotate(${angle})`
                    }}
                    labelShowBg
                    labelBgStyle={{ fill: 'transparent' }}
                    labelBgPadding={[2, 4]}
                    labelBgBorderRadius={2}
                    onClick={() => { setIsShowPopup(true) }}
                    style={{ display: style.display }}
                />)

            }


        </>
    );
}

export default SimpleFloatingEdge;
