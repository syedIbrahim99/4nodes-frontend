import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    Node, Edge,
    addEdge,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    ConnectionMode,
    Controls,
    applyNodeChanges,
    applyEdgeChanges,
    OnNodesChange,
    OnEdgesChange,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import SimpleFloatingEdge from './simplefloatinggraph/SimpleFloatingGraph';
import CustomNode from './simplefloatinggraph/CustomNode';

import './App.css';
import NodeListOnChange from './helpers/NodeListOnChange';
import { HideEdgesForSelectedNode, HideNodesForSelectedNode } from './helpers/HideNodesAndEdges';
import OffCanvasComponent from './simplefloatinggraph/OffcanvasComponent';
import DownloadButton from './simplefloatinggraph/DownloadImage';
import { GrPowerReset } from "react-icons/gr";

interface CausalGraphProps {
    nodes: Node[];
    edges: Edge[];
}

const arrowMarker = MarkerType.ArrowClosed;




const fitViewOptions = { padding: 1 };

function NodeAsHandleFlow(Props: CausalGraphProps) {
    const [nodes, setNodes] = useNodesState<Node[]>([]);
    const [edges, setEdges] = useEdgesState<Edge[]>([]);
    const [copyEdges, setCopyEdges] = useState<Edge[]>([]);
    const [changeCount, setChangeCount] = useState<number>(0)
    const [changeCount2, setChangeCount2] = useState<number>(0)
    const [resetCount, setResetCount] = useState<number>(0)
    const [currentSource, setCurrentSource] = useState<string>('')
    const [currentTarget, setCurrentTarget] = useState<string>('')
    const [currentvalue, setCurrentvalue] = useState<number>(0)
    const [hideUnconnectedNodes, setHideUnconnectedNodes] = useState<boolean>(false); // State to toggle hiding unconnected nodes
    const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);
    const [isConvergenceStarted, setIsConvergenceStarted] = useState<boolean>(false)
    const [isLoadingStarted, setIsLoadingStarted] = useState<boolean>(true)
    const [lastUpdatedEdgeId, setLastUpdatedEdgeId] = useState<string>('')
    const [lastRecordedStrokeWidth, setLastRecordedStrokeWidth] = useState<number | string>(0)
    const [formattedNodes, setFormattedNodes] = useState<{ [key: string]: string }>({}); // State to store formattedNodes


    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );

    const onConnect = useCallback(
        (params: any) =>
            setEdges((eds) =>
                addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
            ),
        [edges]
    );


    const handleOnChange = (selectedId: string, value: string, shouldHideEdges: boolean) => {
        const [filteredNodes, updatedEdges] = NodeListOnChange(selectedId, value, shouldHideEdges, nodes, edges, copyEdges)
        setNodes(filteredNodes)
        setEdges(updatedEdges)
    };


    const nodeTypes = useMemo(() => ({
        custom: (props: any) => (<CustomNode  {...props} onChange={(idx: string, value: string, shouldHideEdges: boolean) => handleOnChange(idx, value, shouldHideEdges)} />
        ),
    }), [])


    const edgeTypes = useMemo(
        () => ({
            floating: (props: any) => (<SimpleFloatingEdge {...props}
                lastUpdatedEdgeId={lastUpdatedEdgeId}
                lastRecordedStrokeWidth={lastRecordedStrokeWidth}
                currentSource={currentSource}
                currentTarget={currentTarget}
                currentvalue={currentvalue}
                clickedNodeId={clickedNodeId}
                hideUnconnectedNodes={hideUnconnectedNodes}
                onChange={(idx: string,
                    value: number,
                    prevChangedEdgeId: string,
                    prevChangedOrgvalue: number,
                    currentSrc: string,
                    currentTrgt: string,
                    clickedNodeId: string,
                    hideUnconnectedNodes: boolean
                ) =>
                    handleLinkWeightChange(idx,
                        value,
                        prevChangedEdgeId,
                        prevChangedOrgvalue,
                        currentSrc,
                        currentTrgt,
                        clickedNodeId,
                        hideUnconnectedNodes
                    )}
            />),
        }),
        [lastRecordedStrokeWidth, currentvalue, clickedNodeId, hideUnconnectedNodes])

    useEffect(() => {
        setNodes(Props.nodes)
    }, [Props.nodes])

    useEffect(() => {
        setEdges(Props.edges)
        setCopyEdges(Props.edges)
    }, [Props.edges])


    const display = (edges: Edge[], clickedNodeId: string, sourceNode: string, targetNode: string, hideUnconnectedNodes: boolean) => {


        if (clickedNodeId !== undefined) {
            if (clickedNodeId === sourceNode || clickedNodeId === targetNode) {
                const connections = edges.filter(
                    edge => (edge.source === sourceNode && edge.target === targetNode) || (edge.source === targetNode && edge.target === sourceNode)
                );

                if (connections.length === 1) {

                    const targetid = connections[0].target;
                    const sourceid = connections[0].source;

                    if (clickedNodeId === sourceid) {

                        setNodes(nodes =>
                            nodes.map(node => {
                                if (node.id === targetid) {
                                    return {
                                        ...node,
                                        style: {
                                            ...node.style,
                                            color: '#FFF',
                                            display: hideUnconnectedNodes ? 'none' : 'unset',
                                            background: 'radial-gradient(circle at 6.66px 6.66px, #fff, #000)'
                                        }
                                    }
                                } else {
                                    return node;
                                }

                            })
                        );
                    } else if (clickedNodeId === targetid) {

                        setNodes(nodes =>
                            nodes.map(node => {
                                if (node.id === sourceid) {
                                    return {
                                        ...node,
                                        style: {
                                            ...node.style,
                                            color: '#000',
                                            display: hideUnconnectedNodes ? 'none' : 'unset',
                                            background: 'radial-gradient(circle at 6.66px 6.66px, #fff, #000)'
                                        }
                                    }
                                } else {
                                    return node;
                                }

                            })
                        );
                    }
                }

            }
        }
    };


    const handleLinkWeightChange = (id: string, value: number, prevChangedEdgeId: string, prevChangedOrgvalue: number, currentSrc: string, currentTrgt: string, clickedNodeId: string, hideUnconnectedNodes: boolean) => {

        if (value === 0) {
            setEdges(prevEdges => {
                display(prevEdges, clickedNodeId, currentSrc, currentTrgt, hideUnconnectedNodes)
                return prevEdges.filter(edge => edge.id !== id)
            });
        } else {
            setEdges(prevEdges =>
                prevEdges.map(edge => {
                    if (edge.id === id) {
                        // Update the stroke width for the current edge
                        return {
                            ...edge,
                            style: {
                                ...edge.style,
                                strokeWidth: value,
                                strokeDasharray: value < 0 ? "5" : "0"
                            }
                        };
                    }
                    // else if (edge.id === prevChangedEdgeId) {
                    //     // Revert the stroke width for the last updated edge

                    //     return {
                    //         ...edge,
                    //         style: {
                    //             ...edge.style,
                    //             strokeWidth: value,
                    //             strokeDasharray: value < 0 ? 5 : 0
                    //         }
                    //     };
                    // }

                    else {
                        return edge;
                    }
                })
            );
        }


        setLastUpdatedEdgeId(id)
        setChangeCount2(changeCount2 + 1)
        setCurrentSource(currentSrc)
        setCurrentTarget(currentTrgt)
        setCurrentvalue(value)
        // if (hideUnconnectedNodes) {
        //     changeEdgeColors(currentSrc)
        // }
    };

    useEffect(() => {
        const updatedEdge = Props.edges.find(edge => edge.id === lastUpdatedEdgeId);
        if (updatedEdge?.style?.strokeWidth) {
            setLastRecordedStrokeWidth(updatedEdge.style.strokeWidth);
        }

    }, [lastUpdatedEdgeId])

    const changeEdgeColors = (id: string, edges: Edge[]) => {
        const updatedEdges = edges.map((edge) => {
            if (edge.source === id) {
                return {
                    ...edge,
                    style: {
                        ...edge.style,
                        stroke: '#27B202',
                        display: 'unset'
                    },
                    markerEnd: {
                        type: arrowMarker,
                        color: '#27B202',
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
                    markerEnd: {
                        type: arrowMarker,
                        color: 'blue',
                    },
                };
            } else {
                return {
                    ...edge,
                    style: {
                        ...edge.style,
                        stroke: '#000',
                        display: hideUnconnectedNodes ? 'none' : 'unset'
                    },
                    markerEnd: {
                        type: arrowMarker,
                        color: '#000',
                    },
                };
            }
        });
        setEdges(updatedEdges);
    }

    const resetEdgeColors = () => {
        return edges.map(edge => ({
            ...edge,
            style: {
                ...edge.style,
                stroke: '#000',
                display: 'unset'
            }, markerEnd: {
                type: arrowMarker,
                color: '#000',
            },
        }));
    };

    const changeNodeBG = (nodeId: string): Node[] => {
        // Create a map to store directly connected nodes for efficient lookup
        const connectedNodesMap: { [key: string]: boolean } = {};

        // Iterate through edges to find directly connected nodes to the selected node
        edges.forEach(edge => {
            if (edge.source === nodeId) {
                connectedNodesMap[edge.target] = true;
            }
            if (edge.target === nodeId) {
                connectedNodesMap[edge.source] = true;
            }
        });
        if (nodeId !== clickedNodeId) {
            setClickedNodeId(nodeId)
            return nodes.map(node => {
                let newNode = node;
                if (node.id === nodeId) {
                    // Update the style of the selected node
                    newNode = {
                        ...node,
                        style: {
                            ...node.style,
                            color: '#fff',
                            // background: '#00FF00',
                            background: 'radial-gradient(circle at 6.66px 6.66px, #38FF03, #000)',
                            display: 'unset',

                        },
                    };
                } else if (connectedNodesMap[node.id]) {
                    // Update the style of directly connected nodes
                    newNode = {
                        ...node,
                        style: {
                            ...node.style,
                            color: '#fff',
                            background: 'radial-gradient(circle at 6.66px 6.66px, #5cabff, #000)',
                            display: 'unset',

                        },
                    };
                } else {
                    // Set the style of nodes not directly connected to white
                    newNode = {
                        ...node,
                        style: {
                            ...node.style,
                            // background: '#fff',
                            color: '#000',
                            background: 'radial-gradient(circle at 6.66px 6.66px, #fff, #000)',
                            display: !hideUnconnectedNodes ? 'unset' : 'none',
                        },
                    };
                }
                return newNode;
            });

        } else {
            setClickedNodeId(null)
            return nodes.map(node => ({
                ...node,
                style: {
                    ...node.style,
                    // background: '#fff',
                    color: '#000',
                    background: 'radial-gradient(circle at 6.66px 6.66px, #fff, #000)',
                    display: "unset"
                },
            }));
        }

    };




    const toggleHideUnconnectedNodes = () => {
        const copyHideConnectedNodes = !hideUnconnectedNodes
        setHideUnconnectedNodes(!hideUnconnectedNodes)
        if (clickedNodeId !== null && copyHideConnectedNodes === true) {
            const filteredEdges = HideEdgesForSelectedNode(clickedNodeId, edges)
            setEdges(filteredEdges)
            const filteredNodes = HideNodesForSelectedNode(clickedNodeId, nodes, edges)
            setNodes(filteredNodes)

        }
        else if (copyHideConnectedNodes === false) {
            const filteredEdges = edges.map((edge) => {
                return {
                    ...edge,
                    style: {
                        ...edge.style,
                        display: 'unset'
                    }
                }
            })
            setEdges(filteredEdges)

            const filteredNodes = nodes.map((node) => {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        display: 'unset'
                    },
                }
            })
            setNodes(filteredNodes)
        }
    }

    const handleNodeClicked = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
        setNodes(changeNodeBG(node.id))
        if (clickedNodeId !== node.id) {
            changeEdgeColors(node.id, edges)
        }
        else {
            setEdges(resetEdgeColors())
        }
    };

    const changeNodeBGAfterResetNodes = (nodeId: string) => {
        const connectedNodesMap: { [key: string]: boolean } = {};

        // Iterate through edges to find directly connected nodes to the selected node
        copyEdges.forEach(edge => {
            if (edge.source === nodeId) {
                connectedNodesMap[edge.target] = true;
            }
            if (edge.target === nodeId) {
                connectedNodesMap[edge.source] = true;
            }
        });

        return nodes.map(node => {
            let newNode = node;
            if (node.id === nodeId) {

                // Update the style of the selected node
                newNode = {
                    ...node,
                    style: {
                        ...node.style,
                        // background: '#00FF00',
                        color: '#fff',
                        background: 'radial-gradient(circle at 6.66px 6.66px, #38FF03, #000)',
                        display: 'unset'
                    },
                };
            } else if (connectedNodesMap[node.id]) {

                // Update the style of directly connected nodes
                newNode = {
                    ...node,
                    style: {
                        ...node.style,
                        color: '#fff',
                        background: 'radial-gradient(circle at 6.66px 6.66px, #5cabff, #000)',
                        display: 'unset'
                    },
                };
            } else {

                // Set the style of nodes not directly connected to white
                newNode = {
                    ...node,
                    style: {
                        ...node.style,
                        // background: '#fff',
                        color: '#000',
                        background: 'radial-gradient(circle at 6.66px 6.66px, #fff, #000)',
                        display: !hideUnconnectedNodes ? 'unset' : 'none'
                    },
                };
            }
            return newNode;
        });

    }


    const handleResetEdges = () => {
        setEdges(copyEdges)
        setFormattedNodes({})
        setResetCount(resetCount + 1)
        if (clickedNodeId != null) {
            changeEdgeColors(clickedNodeId, copyEdges)
            setNodes(changeNodeBGAfterResetNodes(clickedNodeId))
        }
        setChangeCount2(0)
    }

    const handleLoading = () => {
        setIsLoadingStarted(false)
    }

    const handleStartConvergence = () => {

        if (changeCount2 !== 0) {
            let formattedNodesDup: { [key: string]: string } = {};
            if (!isConvergenceStarted) {

                nodes.forEach(node => {
                    if (node.style)
                        formattedNodesDup[node.id] = node.style.background?.toString() ?? '';
                });

                setFormattedNodes(formattedNodesDup)
                setIsLoadingStarted(true)
                setIsConvergenceStarted(true)
                setChangeCount(changeCount + 1)

            } else if (isConvergenceStarted) {

                setIsConvergenceStarted(false)
                setIsLoadingStarted(false)
                // handleResetEdges()
                console.log('cancel here &&&&&&&&&&&&&&&&&&&&&&')
                setFormattedNodes({})

                if (clickedNodeId != null) {
                    changeEdgeColors(clickedNodeId, copyEdges)
                    setNodes(changeNodeBGAfterResetNodes(clickedNodeId))
                }
            }
        } else {
            alert("Please change any edge value")
        }

    }

    const handleCurrentConvergedNode = (nodeids: string[]) => {
        // Trigger the function after 0.5 seconds

        if (isConvergenceStarted && isLoadingStarted) {

            setNodes(nodes => nodes.map((node) => {
                if (nodeids.includes(node.id)) {
                    // Highlighted nodes - set background color to yellow
                    return {
                        ...node,
                        style: { ...node.style, background: 'yellow' }
                    };
                } else {
                    return {
                        ...node,
                        style: { ...node.style, background: formattedNodes[node.id] }
                    };
                }
            }));
        }
    };

    const handleChangeNodeColorAfterConverge = () => {
        handleBlinkedNodeColorReverse()
        setIsConvergenceStarted(false)
    }

    const handleBlinkedNodeColorReverse = () => {

        setNodes(nodes => nodes.map((node) => {
            return {
                ...node,
                style: { ...node.style, background: formattedNodes[node.id] }
            };
        }))
    }

    return (
        <div className="simple-floatingedges px-2 pt-2">
            <div className="dashboard">

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={handleNodeClicked}
                    onConnect={onConnect}
                    edgeTypes={edgeTypes}
                    nodeTypes={nodeTypes}
                    // fitView
                    // fitViewOptions={fitViewOptions}
                    connectionMode={ConnectionMode.Loose}
                    snapToGrid
                    proOptions={{ hideAttribution: true }}
                >
                    <Background />
                    <Controls />
                    <Panel style={{
                        position: "absolute",
                        height: '40px',
                        left: "-15px",
                        top: "-15px",
                        width: '100%',
                        backgroundColor: "white",
                        display: 'flex',
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: '1px solid #E6ECF1',
                        padding: '0 10px',
                        paddingLeft: '15px',
                        fontSize: '14px'

                    }} position="top-left">
                        {/* <Form>
                            <Form.Check // prettier-ignore
                                type="switch"
                                id="as1"
                                label="Show Node Values"
                            // checked={showCurrentValue}
                            // onChange={toggleShowCurrentValue}
                            />
                        </Form> */}
                        <div style={{ fontWeight: '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Causal Graph</span>   </div>
                        <div className='d-flex justify-content-end align-items-center'>
                            <div className='download-btn py-1 px-2 me-2' style={{
                                borderRadius: "3px",
                                backgroundColor: isConvergenceStarted ? "#E74C3C" : "#0EA52E",
                                color: "#fff",
                                textAlign: "center",
                                border: "none",
                                display: 'flex',
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "fit-content",
                                fontSize: '12px',
                                cursor: 'pointer'
                            }} onClick={handleStartConvergence} >{isConvergenceStarted ? 'Terminate' : 'Start'}</div>

                            <DownloadButton />

                        </div>

                    </Panel>

                    <Panel position="top-left" style={{ position: "absolute", top: "30px", display: 'flex', alignItems: 'center' }}>
                        <label className="switch">
                            <input type="checkbox" id="as" checked={hideUnconnectedNodes}
                                onChange={toggleHideUnconnectedNodes} />
                            <span className="slider round"></span>
                        </label>

                        <span className='ms-2'>
                            Hide Unconnected Nodes
                        </span>
                        <br />
                    </Panel>
                    <Panel position="top-left" style={{ position: "absolute", top: "60px", display: 'flex', alignItems: 'center' }}>
                        <button className=' border-0 p-2 d-flex justify-content-center align-items-center'
                            title='Reset Graph'
                            style={{
                                borderRadius: '50%',
                                height: '30px',
                                width: '30px'
                            }}
                            onClick={handleResetEdges}
                        >
                            <GrPowerReset />
                        </button>
                        <span style={{ marginLeft: '14px' }}>Reset Edges</span>
                    </Panel>

                </ReactFlow>
            </div>
            {
                nodes.length > 0 && edges.length > 0 && (<OffCanvasComponent
                    nodeData={nodes}
                    edgeData={edges}
                    count={changeCount}
                    reset={resetCount}
                    isConverging={isConvergenceStarted}
                    isLoadingStarted={isLoadingStarted}
                    handleLoading={handleLoading}
                    handleCurrentConvergedNode={handleCurrentConvergedNode}
                    handleChangeNodeColorAfterConverge={handleChangeNodeColorAfterConverge}
                    handleBlinkedNodeColorReverse={handleBlinkedNodeColorReverse}
                />)
            }
        </div >
    );
};

export default NodeAsHandleFlow;
