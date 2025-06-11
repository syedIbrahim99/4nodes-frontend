import React from 'react';
import { useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import downloadIcon from '../assests/images/downloadIcon.svg'
function downloadImage(dataUrl: any) {
    const a = document.createElement('a');

    a.setAttribute('download', 'causal-graph.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
    const { getNodes } = useReactFlow();
    const onClick = () => {
        // we calculate a transform for the nodes so that all nodes are visible
        // we then overwrite the transform of the `.react-flow__viewport` element
        // with the style option of the html-to-image library
        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
            // backgroundColor: '#1a365d',
            backgroundColor: '#fff',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(downloadImage);
    };

    return (

        <button className="download-btn py-1 px-2" style={{
            borderRadius: "3px",
            backgroundColor: "#0E4D9C17",
            color: "#0E4D9C",
            textAlign: "center",
            border: "none",
            display: 'flex',
            justifyContent: "space-between",
            alignItems: "center",
            width: "fit-content",
            fontSize:'12px'
        }} onClick={onClick}>
            <img src={downloadIcon} alt='download icon' height={12}/>  <span className='ms-1'>Download</span>
        </button>

    );
}

export default DownloadButton;