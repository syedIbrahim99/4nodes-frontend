import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Node, Edge } from 'reactflow';
import connectChangedWebSocket from '../socket/ChangedSocketAdapter';
import { TbWaveSawTool } from "react-icons/tb";
import loader from '../assests/images/loader.svg'

import connectInitialWebSocket from '../socket/InitalSocketAdapter';
import useScroll from '../helpers/useScroll';
interface Propstype {
    nodeData: Node[],
    edgeData: Edge[],
    count: number,
    reset: number,
    isConverging: boolean,
    isLoadingStarted: boolean,
    handleLoading: () => void,
    handleCurrentConvergedNode: (nodeids: string[]) => void,
    handleChangeNodeColorAfterConverge: () => void,
    handleBlinkedNodeColorReverse: () => void
}

interface EdgeLabels {
    [sourceTarget: string]: string;
}

interface InputData {
    [key: string]: {
        [key: string]: number;
    };
}


interface Blink {
    node_blink: string[][];
}


interface ConvergenceData {
    x: number;
    y: number;
}

interface TimeseriesDataFinalOutput {
    blinkNodes?: Blink;
    TimeSeriesData: InputData;

}

interface TimeseriesDataFinalOutput2 {
    blinkNodes?: Blink;
    TimeSeriesData: InputData;
    convergenceData: ConvergenceData[]
}

interface OutputData {
    [key: string]: {
        'original-signal'?: {
            [key: string]: number;
        };
        'new-signal'?: {
            [key: string]: number;
        };
    };
}


interface DataPoint {
    name: string;
    [key: string]: number | string;
}


const linkColors: { [key: string]: string } = {
    n1: '#2148C8',
    n2: '#A179E3',
    n3: '#07A537',
    n4: '#E8BD68'
};

function OffCanvasComponent(props: Propstype) {
    const graphArea = useRef<HTMLDivElement>(null);

    const [timeSeriesData, setTimeSeriesData] = useState<OutputData>({})
    const [chartWidth, setChartWidth] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false)
    const [convergenceHistory, setConvergenceHistory] = useState<{ previousData: ConvergenceData[], currentData: ConvergenceData[] }>({ previousData: [], currentData: [] });
    const [currentConvergenceDataLength, setCurrentConvergenceDataLength] = useState<number>(0)
    console.log('convergence History', convergenceHistory);

    const isBottom = useScroll(graphArea);
    let currentIndex = 0;

    // useEffect(() => {
    //     console.log(isBottom)
    //     if (isBottom) {
    //         alert("you reached")
    //     }
    // }, [isBottom])

    useEffect(() => {
        if (graphArea.current) {
            setChartWidth(graphArea.current.offsetWidth);
        }
    }, [graphArea]);


    useEffect(() => {
        console.log(props.edgeData)
        console.log(props.nodeData)
        setLoading(true)
        console.log(props.count)
        const edgeLabels: EdgeLabels = {};
        props.edgeData?.forEach(edge => {
            const { source, target, style } = edge;
            if (style && typeof style.strokeWidth === 'number') {
                const key = `${source}, ${target}`;
                const strokeWidth = style.strokeWidth;
                edgeLabels[key] = String(strokeWidth);
            }
        });
        const nodeIds: string[] = props.nodeData.map((node) => node.id);
        const initializeSocket = async () => {
            if (props.count === 0) {
                try {
                    const socket: TimeseriesDataFinalOutput = await connectInitialWebSocket(nodeIds, edgeLabels);
                    const TimeSeriesData = socket.TimeSeriesData
                    console.log(socket)
                    // console.log('WebSocket data:', socket); // Log received WebSocket data
                    const transformedData = transformSocketData(TimeSeriesData);
                    // console.log('Transformed data:', transformedData); // Log transformed data
                    setTimeSeriesData(transformedData); // Update state with transformed data
                    props.handleLoading();
                    setLoading(false)
                } catch (error) {
                    console.error('Error initializing socket:', error);
                }
            }

        };

        initializeSocket();
    }, [])

    // useEffect(() => {
    //     let intervalId: NodeJS.Timeout;

    //     const initializeChangedSocket = async () => {
    //         console.log(props.count, "props.count")
    //         console.log("before", props.isConverging, props.isLoadingStarted)
    //         if (props.count !== 0 && props.isConverging && props.isLoadingStarted) {
    //             setLoading(true)
    //             console.log(props.count)
    //             const edgeLabels: EdgeLabels = {};
    //             props.edgeData.forEach(edge => {
    //                 const { source, target, style } = edge;
    //                 if (style && typeof style.strokeWidth === 'number') {
    //                     const key = `${source}, ${target}`;
    //                     const strokeWidth = style.strokeWidth;
    //                     edgeLabels[key] = String(strokeWidth);
    //                 }
    //             });
    //             const nodeIds: string[] = props.nodeData.map((node) => node.id);
    //             try {
    //                 const socket: TimeseriesDataFinalOutput2 = await connectChangedWebSocket(nodeIds, edgeLabels);

    //                 console.log(socket.convergenceData)
    //                 let currentIndex = 0;
    //                 const logBlinkNodes = () => {
    //                     console.log("if", props.isConverging, props.isLoadingStarted)
    //                     if ((socket.blinkNodes?.node_blink) && (currentIndex < socket.blinkNodes?.node_blink.length) && (props.isConverging && props.isLoadingStarted && socket.convergenceData)) {
    //                         setCurrentConvergenceDataLength(socket.convergenceData.length)
    //                         setConvergenceHistory(prevHistory => ({
    //                             ...prevHistory,
    //                             currentData: [
    //                                 ...prevHistory.currentData,
    //                                 socket?.convergenceData[currentIndex]
    //                             ]
    //                         }));

    //                         if (currentIndex < socket.blinkNodes?.node_blink.length) {
    //                             props.handleCurrentConvergedNode(socket.blinkNodes?.node_blink[currentIndex]);
    //                         }

    //                         console.log(socket?.convergenceData[currentIndex])
    //                         console.log(socket?.convergenceData[0])

    //                         currentIndex++;
    //                     } else {
    //                         console.log("else", props.isConverging, props.isLoadingStarted)
    //                         props.handleChangeNodeColorAfterConverge()
    //                         props.handleLoading()
    //                         const TimeSeriesData = socket.TimeSeriesData
    //                         console.log(socket.blinkNodes?.node_blink.length)
    //                         const transformedData = transformSocketData(TimeSeriesData);
    //                         setTimeSeriesData(transformedData);
    //                         setLoading(false)
    //                         clearInterval(intervalId);


    //                         setConvergenceHistory(prevHistory => ({
    //                             ...prevHistory,
    //                             previousData: [
    //                                 ...prevHistory.currentData,
    //                             ]
    //                         }));

    //                         // console.log("updated history *************************", updatedHistory)
    //                         // convergenceHistory = updatedHistory
    //                         console.log('cancelling here*********************************')
    //                     }
    //                 };

    //                 intervalId = setInterval(() => {
    //                     if (props.isConverging && props.isLoadingStarted) {
    //                         logBlinkNodes();
    //                         console.log('cancelling here%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    //                         setTimeout(() => {
    //                             props.handleBlinkedNodeColorReverse();
    //                         }, 500);
    //                     } else {
    //                         console.log('cancelling here###########################')
    //                         // Clear the interval if the condition is no longer true
    //                         clearInterval(intervalId);
    //                     }
    //                 }, 1000);


    //             } catch (error) {
    //                 console.error('Error initializing socket:', error);
    //             }
    //         } else if (currentConvergenceDataLength === convergenceHistory.currentData.length) {
    //             setConvergenceHistory(prevHistory => ({
    //                 ...prevHistory,
    //                 previousData: [
    //                     ...prevHistory.currentData,
    //                 ]
    //             }));
    //         }
    //         else {
    //             setConvergenceHistory(prevHistory => ({
    //                 ...prevHistory,
    //                 currentData: [
    //                     ...prevHistory.previousData,
    //                 ]
    //             }));
    //             // console.log("updated history ################", updatedHistory)
    //             // convergenceHistory = updatedHistory
    //         }
    //     };

    //     initializeChangedSocket();

    //     // Clear interval when component unmounts or when conditions change
    //     return () => clearInterval(intervalId);
    // }, [props.isConverging, props.isLoadingStarted])


    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const initializeChangedSocket = async () => {
            console.log(props.count, "props.count");
            console.log("before", props.isConverging, props.isLoadingStarted);
            if (props.count !== 0 && props.isConverging && props.isLoadingStarted) {
                setLoading(true);
                console.log(props.count);
                const edgeLabels: EdgeLabels = {};
                props.edgeData.forEach(edge => {
                    const { source, target, style } = edge;
                    if (style && typeof style.strokeWidth === 'number') {
                        const key = `${source}, ${target}`;
                        const strokeWidth = style.strokeWidth;
                        edgeLabels[key] = String(strokeWidth);
                    }
                });
                const nodeIds: string[] = props.nodeData.map((node) => node.id);
                try {
                    const socket: TimeseriesDataFinalOutput2 = await connectChangedWebSocket(nodeIds, edgeLabels);
                    console.log(socket.convergenceData);
                    setConvergenceHistory(prevHistory => ({
                        ...prevHistory,
                        currentData: []
                    }));

                    const logBlinkNodes = () => {
                        console.log("if", props.isConverging, props.isLoadingStarted);
                        if ((socket.blinkNodes?.node_blink) && (currentIndex <= socket.blinkNodes?.node_blink.length) && (props.isConverging && props.isLoadingStarted && socket.convergenceData)) {
                            setCurrentConvergenceDataLength(socket.convergenceData.length);
                            if (currentIndex == 0) {
                                setConvergenceHistory(prevHistory => ({
                                    ...prevHistory,
                                    currentData: [
                                        ...prevHistory.currentData,
                                        socket.convergenceData[0]
                                    ]
                                }));
                            } else {
                                setConvergenceHistory(prevHistory => ({
                                    ...prevHistory,
                                    currentData: [
                                        ...prevHistory.currentData,
                                        socket.convergenceData[currentIndex]
                                    ]
                                }));

                            }

                            if (currentIndex < socket.blinkNodes?.node_blink.length) {
                                props.handleCurrentConvergedNode(socket.blinkNodes.node_blink[currentIndex]);
                            }
                            console.log(currentIndex)
                            console.log(socket.convergenceData[currentIndex]);
                            console.log(socket.convergenceData[0]);

                            currentIndex++;
                        } else {
                            console.log("else", props.isConverging, props.isLoadingStarted);
                            props.handleChangeNodeColorAfterConverge();
                            props.handleLoading();
                            const TimeSeriesData = socket.TimeSeriesData;
                            console.log(socket.blinkNodes?.node_blink.length);
                            const transformedData = transformSocketData(TimeSeriesData);
                            setTimeSeriesData(transformedData);
                            setLoading(false);
                            clearInterval(intervalId);

                            setConvergenceHistory(prevHistory => ({
                                ...prevHistory,
                                previousData: [
                                    ...prevHistory.currentData,
                                ]
                            }));
                            currentIndex = 0;
                            console.log('cancelling here*********************************');
                        }
                    };

                    // Call logBlinkNodes immediately to ensure 0th index is processed
                    logBlinkNodes();

                    intervalId = setInterval(() => {
                        if (props.isConverging && props.isLoadingStarted) {
                            logBlinkNodes();
                            setTimeout(() => {
                                props.handleBlinkedNodeColorReverse();
                            }, 500);
                        } else {
                            clearInterval(intervalId);
                        }
                    }, 1000);

                } catch (error) {
                    console.error('Error initializing socket:', error);
                }
            } else if (currentConvergenceDataLength === convergenceHistory.currentData.length) {
                setConvergenceHistory(prevHistory => ({
                    ...prevHistory,
                    previousData: [
                        ...prevHistory.currentData,
                    ],
                }));

                currentIndex = 0
            } else {

                setConvergenceHistory(prevHistory => ({
                    ...prevHistory,
                    currentData: [
                        ...prevHistory.previousData,
                    ]
                }));
                currentIndex = 0
            }
        };

        initializeChangedSocket();

        return () => clearInterval(intervalId);
    }, [props.isConverging, props.isLoadingStarted]);



    useEffect(() => {
        if (props.isLoadingStarted) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [props.isLoadingStarted])



    useEffect(() => {
        setTimeSeriesData((prevData) => {
            // Check if 'new-signal' already exists in any node's data
            const hasNewSignal = Object.values(prevData).some((nodeData) => nodeData.hasOwnProperty('new-signal'));

            // If 'new-signal' exists, remove it from each node's data
            if (hasNewSignal) {
                const updatedData: OutputData = {};
                Object.keys(prevData).forEach((nodeId) => {
                    const { 'original-signal': originalSignal } = prevData[nodeId];
                    updatedData[nodeId] = { 'original-signal': originalSignal };
                });
                return updatedData;
            }

            // If 'new-signal' doesn't exist, keep the data unchanged
            return prevData;
        });
    }, [props.reset]);


    const transformData = (rawData: OutputData, key: string): DataPoint[] => {
        const originalSignalData = rawData[key]?.['original-signal'] || {};
        const newSignalData = rawData[key]?.['new-signal'] || {};
        const transformedData: DataPoint[] = Object.keys(originalSignalData).map((index) => ({
            name: index,
            'original signal': originalSignalData[index],
            'new signal': newSignalData[index]
        }));

        return transformedData;
    };


    const transformSocketData = (input: InputData): OutputData => {
        const updatedData: OutputData = { ...timeSeriesData };
        props.nodeData.forEach(node => {
            const nodeId = node.id;
            if (input.hasOwnProperty(nodeId)) {
                if (!updatedData[nodeId]?.['original-signal']) {
                    // If original-signal doesn't exist, set it
                    updatedData[nodeId] = {
                        'original-signal': input[nodeId]
                    };
                } else if (!updatedData[nodeId]?.['new-signal']) {
                    // If new-signal doesn't exist, set it
                    updatedData[nodeId]['new-signal'] = input[nodeId];
                } else {
                    // Replace new data in new-signal
                    updatedData[nodeId]['new-signal'] = input[nodeId];
                }
            }
        });
        return updatedData;
    };
    const dataPoints = Array.from(Array(101).keys()).map(x => ({ x, y: convergenceHistory.currentData.find(item => item.x === x)?.y }));
    return (

        <div className='sidebar'>
            <div style={{ width: '100%', display: convergenceHistory.currentData.length <= 0 ? 'none' : 'unset' }}>
                <div className='ms-2' style={{ fontSize: '14px', fontWeight: '600', padding: '10px 15px', }}>Convergence Graph</div>
                <LineChart width={chartWidth} height={150} data={dataPoints}>
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <YAxis fontSize={10} dataKey="y" padding={{ top: 10, bottom: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" stroke="#2148C8" name="K" dot={false} />
                    <XAxis dataKey="x" domain={[0, 100]} range={[0, 100]} interval={4} padding={{ left: 10, right: 10 }} fontSize={10} />
                </LineChart>
            </div>
            <div className='mt-2' style={{ overflowY: 'hidden', position: 'relative', flex: '1' }}>

                {loading && <div className='loader'>
                    {
                        <img src={loader} />
                    }
                    Please wait...
                </div>}
                <div style={{
                    position: "sticky",
                    height: '40px',
                    width: '100%',
                    backgroundColor: "white",

                    borderTop: '1px solid #E6ECF1',
                    padding: '0 10px',
                    paddingLeft: '15px',
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: '600',
                }} >
                    <div>Time Series Graph </div> <div><TbWaveSawTool stroke='#2148C8' /> <span>Original Signal</span> <TbWaveSawTool stroke='red' /> <span>New Signal</span></div>
                </div>

                <div ref={graphArea} style={{
                    overflowY: 'auto',
                    overflowX: "hidden",
                    height: '90%',
                    padding: '0 20px 8px 20px',
                    marginRight: loading ? '18px' : '0px',
                    position: 'relative',
                    width: '100%'
                }}>

                    {Object.keys(timeSeriesData).map((key) => (
                        <div key={key} style={{ height: '125px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <div style={{ color: '#5B626A', fontSize: '14px' }} >{key}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>{props.nodeData?.find(node => node.id === key)?.data.label}</div>
                                <LineChart width={chartWidth - 60} height={85} data={transformData(timeSeriesData, key)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <YAxis fontSize={8} />
                                    <Tooltip position={{ y: -20 }} />
                                    <Line type="monotone" dataKey="original signal" stroke={'#2148C8'} dot={false} name="Original Signal" />
                                    <Line type="monotone" dataKey="new signal" stroke="red" strokeDasharray={1} dot={false} name="New Signal" />
                                </LineChart>
                            </div>
                        </div>
                    ))}
                    <div style={{ content: '', background: 'white', width: chartWidth, position: 'sticky', bottom: '-10px', height: '30px', opacity: isBottom ? '0' : '1' }}></div>
                </div>

            </div>


        </div >
    );
}

export default OffCanvasComponent;
