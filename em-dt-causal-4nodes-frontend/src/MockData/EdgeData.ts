import { MarkerType } from 'reactflow';

const arrowMarker = MarkerType.ArrowClosed;


//  const edgeLabels =  {
//     "N1, N2": "0.7414",
//     "N1, N8": "-0.4823",
//     "N1, N10": "0.6",
//     "N2, N4": "0.648",
//     "N2, N12": "0.6612",
//     "N3, N9": "0.2",
//     "N4, N1": "-0.6756",
//     "N4, N6": "-0.1278",
//     "N5, N6": "0.2346",
//     "N6, N7": "1.9123",
//     "N6, N1": "-0.8412",
//     "N8, N3": "-0.3466",
//     "N9, N11": "0.468",
//     "N10, N1": "-0.7671",
//     "N10, N5": "0.3643",
//     "N12, N5": "0.3028",
//     "N12, N10": "-0.5245"
//     }

//transpose matrix
const edgeLabels = {
  'N1, N3': '-0.6756',
  'N1, N4': '0.3028',
  'N2, N1': '0.7414',
  'N2, N4': '-0.3466',
  'N3, N1': '1.1263',
  'N4, N1': '-0.5034'
}

// const edgeLabels = {
//   'N1, N2': '0.7414',
//   'N1, N3': '1.1263',
//   'N1, N4': '-0.5034',
//   'N3, N1': '-0.6756',
//   'N4, N1': '0.3028',
//   'N4, N2': '-0.3466'
// }


// const edgeLabels = {
//   "N1, N2": "0.27",
//     "N1, N3": "-0.37",
//     "N1, N4": "-0.28",
//     "N3, N1": "0.32",
//     "N4, N1": "0.3028",
//     "N4, N2": "-0.3466"
// }

export const initialEdges = Object.entries(edgeLabels).map(([key, value]) => ({
  id: `edge-${key.replace(', ', '-')}`,
  source: key.split(', ')[0],
  target: key.split(', ')[1],
  sourceHandle: 'right',
  targetHandle: 'left',
  type: 'floating',
  label: value,
  markerEnd: {
    type: arrowMarker,
    color: '#000',
    width: 10,
    height: 10,
    markerUnits: 'px'
  },
  style: {
    strokeWidth: parseFloat(value),
    strokeDasharray: parseFloat(value) < 0 ? 5 : 0,
    stroke: "#000"
  }
}));

console.log(initialEdges);
