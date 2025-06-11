export default function NodeListOnChange (selectedId: string, value: string, shouldHideEdges: boolean, nodes:any[], edges: any[], copyEdges:any[]) {

const updatedNodes = nodes.map(node => {
    return node.id === selectedId ? {
        ...node,
        data: {
            ...node.data,
            currentvalue: Number(value)
        }
    }: node
})

let updatedEdges = [...edges]; 

if (shouldHideEdges) {
    // Remove source edges for the selected node
    updatedEdges = updatedEdges.filter(edge => edge.source !== selectedId);
  } else {
    // Append source edges from the copyEdges for the selected node
    const sourceEdges = copyEdges.filter(edge => edge.source === selectedId);
    updatedEdges.push(...sourceEdges);
  }

  const filteredNodes = updatedNodes.map(node => {
    if (edges.some(edge => edge.target === selectedId && edge.source === node.id)) {
      return {
        ...node,
        data: {
          ...node.data,
          currentValue: Number(value) - Number(node.data.originalValue)
        }
      };
    } else {
      return node;
    }
  });

return [filteredNodes, updatedEdges]





    // setNodes(prevNodes => {
    //   const updatedNodes = prevNodes.map(node => {
    //     return node.id === selectedId ? {
    //       ...node,
    //       data: {
    //         ...node.data,
    //         currentValue: Number(value)
    //       }
    //     } : node;
    //   });
  
    //   let updatedEdges = [...edges]; // Create a copy of the edges array
  
    //   if (shouldHideEdges) {
    //     // Remove source edges for the selected node
    //     updatedEdges = updatedEdges.filter(edge => edge.source !== selectedId);
    //   } else {
    //     // Append source edges from the copyEdges for the selected node
    //     const sourceEdges = copyEdges.filter(edge => edge.source === selectedId);
    //     updatedEdges.push(...sourceEdges);
    //   }
  
    //   setEdges(updatedEdges);
  
    //   const filteredNodes = updatedNodes.map(node => {
    //     if (edges.some(edge => edge.target === selectedId && edge.source === node.id)) {
    //       return {
    //         ...node,
    //         data: {
    //           ...node.data,
    //           currentValue: Number(value) - Number(node.data.originalValue)
    //         }
    //       };
    //     } else {
    //       return node;
    //     }
    //   });
  
    //   return filteredNodes;
    // });
  };