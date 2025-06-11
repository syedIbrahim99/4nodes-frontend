import React, { useState, useEffect } from 'react'
import './App.css'
import 'reactflow/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NodeAsHandleFlow from './CausalGraph'
import { initialNodes } from './MockData/NodeData';
import { initialEdges } from './MockData/EdgeData';
import { Node, Edge } from 'reactflow';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import twinArcLogo from './assests/images/twinARCLogoSilver.png'

const defaultStyle: React.CSSProperties = {
  height: 20,
  width: 20,
  margin: '0px',
  background: 'radial-gradient(circle at 6.66px 6.66px, #fff, #000)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
  border: 'none'
};


function calculateNodeSize(nodes: Node[], edges: Edge[]) {
  const nodeConnections: { [id: string]: number } = {};
  edges.forEach((edge) => {
    nodeConnections[edge.source] = (nodeConnections[edge.source] || 0) + 1;
    nodeConnections[edge.target] = (nodeConnections[edge.target] || 0) + 1;
  });

  // Create a new array of nodes with updated styles
  const updatedNodes = nodes.map((node) => {
    const connections = nodeConnections[node.id] || 0;
    // Adjust the size based on your requirements
    const minWidth = 20;
    const minHeight = 20;
    const padding = 5;
    const width = minWidth + connections * padding;
    const height = minHeight + connections * padding;
    // Return the updated node object with the new style
    return {
      ...node,
      height,
      width,
      style: {
        ...defaultStyle,
        width,
        height,
      },
    };
  });

  return updatedNodes;
}


function positionNodesInPolygon(nodes: Node[]) {
  const polygonRadius = 200;
  const numNodes = nodes.length;
  const centerX = window.innerWidth / 4;
  const centerY = window.innerHeight / 2;
  const angleIncrement = (2 * Math.PI) / numNodes;

  const positionedNodes = nodes.map((node, index) => {
    const angle = index * angleIncrement;
    const x = centerX + polygonRadius * Math.cos(angle);
    const y = centerY + polygonRadius * Math.sin(angle);

    return {
      ...node,
      position: { x, y },
    };
  });

  const gap = nodes[0]?.height ?? 1;

  for (let i = 0; i < numNodes; i++) {
    const currentNode = positionedNodes[i];
    const nextNode = positionedNodes[(i + 1) % numNodes];

    const midX = (currentNode.position.x + nextNode.position.x) / 2;
    const midY = (currentNode.position.y + nextNode.position.y) / 2;

    const vectorX = currentNode.position.x - midX;
    const vectorY = currentNode.position.y - midY;


    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    const normalizedVectorX = vectorX / length;
    const normalizedVectorY = vectorY / length;

    currentNode.position.x = midX + normalizedVectorX * gap * nodes.length / 5;
    currentNode.position.y = midY + normalizedVectorY * gap * nodes.length / 5;
  }

  return positionedNodes;
}

function App() {
  const [updatedNodes, setUpdatedNodes] = useState<Node[] | null>();

  useEffect(() => {
    const calculatedNodes = calculateNodeSize(initialNodes, initialEdges);
    const positionedNodes = positionNodesInPolygon(calculatedNodes);
    setUpdatedNodes(positionedNodes);
    console.log('main')
  }, []);

  return (
    <div style={{ width: "100vw", height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar className="bg-white">
        <Container fluid className='ps-4'>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={twinArcLogo}
              width="auto"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
        </Container>
      </Navbar>
      {
        updatedNodes && (<NodeAsHandleFlow nodes={updatedNodes} edges={initialEdges} />)
      }
      <div className='w-100 p-2 text-center' style={{ fontSize: "10px", backgroundColor: "#f7f7f7", color: '#9E9E9E' }}>
        ©2024 All Rights Reserved.
      </div>
    </div>



  )
}

export default App