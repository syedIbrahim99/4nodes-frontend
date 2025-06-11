export default function ToggleShowCurrentValue (nodes: any[]) {
    const updatedNodes = nodes.map((node) => {
  
      // Hide unconnected nodes if a node is clicked
      return {
        ...node,
        data: {
          ...node.data,
          showCurrentValue: !node.data.showCurrentValue
        }
      };
  
    });
    return updatedNodes
  }
  