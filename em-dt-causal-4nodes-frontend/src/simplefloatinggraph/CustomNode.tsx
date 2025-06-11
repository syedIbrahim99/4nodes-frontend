import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';


const style: React.CSSProperties = {
    borderRadius: '50%',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column', // Update to display values below label
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    position: 'relative'
};

export default memo(({ id, data, onChange }: any) => {
    const [onFocus, setFocus] = useState<boolean>(false)
    const [nodeCurrentValue, setNodeCurrentValue] = useState<string | null>(null)
    const onBlur = () => {
        setFocus(false)
        const value = nodeCurrentValue && nodeCurrentValue?.length > 0 ? nodeCurrentValue : data.currentValue
        console.log("value:", value, "node:", nodeCurrentValue)
        const shouldHideEdges = Number(value) > Number(data.thresholdValue) ? true : false
        onChange(id, value, shouldHideEdges);
    }
    return (
        <div style={style} >
            <label className='node-label'>{id}</label>
            {
                data?.showCurrentValue && Number(data.currentValue) !== Number(data.originalValue) ? <label style={{ width: "50px", position: "absolute", top: "-54px", textAlign: "center" }}>{data.originalValue}</label> : <></>
            }
            {
                data?.showCurrentValue ? <input type='number' value={nodeCurrentValue !== null ? nodeCurrentValue : data?.currentValue} onFocus={() => { setFocus(true) }} onBlur={() => { onBlur() }} onChange={(e) => {
                    setNodeCurrentValue(e.target.value)
                }} style={{ width: "50px", position: "absolute", top: "-32px", textAlign: "center", outline: onFocus ? '1px solid #000' : 'none', border: 'none', color: Number(data.currentValue) > Number(data.thresholdValue) ? 'red' : 'black' }} /> : <></>
            }
            <Handle type="source" position={Position.Top} id="top" style={{ position: 'absolute', top: "-12px", visibility: "hidden" }} />
            <Handle type="source" position={Position.Right} id="right" style={{ position: 'absolute', right: "-12px", visibility: "hidden" }} />
            <Handle type="source" position={Position.Bottom} id="bottom" style={{ position: 'absolute', bottom: "-12px", visibility: "hidden" }} />
            <Handle type="source" position={Position.Left} id="left" style={{ position: 'absolute', left: "-12px", visibility: "hidden" }} />

        </div>

    );
});
