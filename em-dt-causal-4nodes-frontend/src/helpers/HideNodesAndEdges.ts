import { Node ,Edge } from "reactflow";


export const HideEdgesForSelectedNode = (id: string, edges:Edge[]) => {
    const updatedEdges = edges.map((edge) => {
        if (edge.source === id) {
            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: '#00FF00',
                    display: 'unset'
                },
            };
        } else if (edge.target === id) {
            // Update target edges to pink
            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: 'blue',
                    display: 'unset'
                },
            };
        } else {
            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: '#000',
                    display: 'none' 
                },
            };
        }
    });
    return updatedEdges;
}



export const HideNodesForSelectedNode = (selectedNodeId: string, nodes: Node[], edges: Edge[]): Node[] => {
    const updatedNodes = nodes.map((node) => {
        const isConnected = edges.some(edge => edge.source === selectedNodeId && edge.target === node.id || edge.target === selectedNodeId && edge.source === node.id);
      
        if (isConnected || node.id === selectedNodeId) {
            // Update style to unset if the node is connected to the selected node
            return {
                ...node,
                style: {
                    ...node.style,
                    display: 'unset'
                },
            };
        } else {
            // Update style to display node if not connected
            return {
                ...node,
                style: {
                    ...node.style,
                    display: 'none'
                },
            };
        }
    });
    return updatedNodes;
}


