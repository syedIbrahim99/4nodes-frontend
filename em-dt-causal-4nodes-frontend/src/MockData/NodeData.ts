import {Node, Position} from 'reactflow'

const style: React.CSSProperties = {
    height: 20,
    width: 20,
    margin: '0px',
    background: 'radial-gradient(circle at 6.66px 6.66px, #5cabff, #000)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
};

  export const initialNodes : Node[] = [
    {
        id: 'N1',
        data: { label: 'Bearing 1', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
        position: { x: 0, y: 0 },
        type: 'custom',
        height: 0,
        width: 0,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style
    },
    {
        id: 'N2',
        data: { label: 'Bearing 2', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
        position: { x: 0, y: 0 },
        type: 'custom',
        height: 0,
        width: 0,
       sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style
    },
   
    {
        id: 'N3',
        data: { label: 'Bearing 3', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
        position: { x: 0, y: 0 },
        type: 'custom',
        height: 0,
        width: 0,
         sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style
    },
    {
        id: 'N4',
        data: { label: 'Bearing 4', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
        position: { x: 0, y: 0 },
        type: 'custom',
        height: 0,
        width: 0,
       sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style
      }, 
    
    //  {
    //     id: 'N5',
    //     data: { label: 'N5', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N6',
    //     data: { label: 'N6', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N7',
    //     data: { label: 'N7', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N8',
    //     data: { label: 'N8', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N9',
    //     data: { label: 'N9', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N10',
    //     data: { label: 'N10', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N11',
    //     data: { label: 'N11', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
    // {
    //     id: 'N12',
    //     data: { label: 'N12', thresholdValue: 50, currentValue: 30.55, originalValue: 30.55, isShowCurrentValue: false },
    //     position: { x: 0, y: 0 },
    //     type: 'custom',
    //     height: 0,
    //     width: 0,
    //    sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     style
    // }, 
]