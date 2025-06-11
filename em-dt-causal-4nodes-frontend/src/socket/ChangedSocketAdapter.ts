import { w3cwebsocket as WebSocket } from 'websocket';

interface ConvergenceData {
    x: number;
    y: number;
}
interface EdgeLabels {
    [sourceTarget: string]: string;
}

interface Blink {
    node_blink: string[][];
}

interface TimeseriesData {
    [key: string]: {
        [key: string]: number;
    };
}

interface TimeseriesDataFinalOutput {
    blinkNodes: Blink;
    TimeSeriesData: TimeseriesData;
    convergenceData: ConvergenceData[]
}

export default function connectChangedWebSocket(nodeIds: string[], edgeLabels: EdgeLabels): Promise<TimeseriesDataFinalOutput> {
    return new Promise<TimeseriesDataFinalOutput>((resolve, reject) => {

        let timeSeriesData: TimeseriesData = {};
        let convergenceData: ConvergenceData[] = []
        let blinkNode: Blink = { node_blink: [] }; // Initialize blinkNode with an empty array
        let timeseriesFinalData: TimeseriesDataFinalOutput = { blinkNodes: blinkNode, TimeSeriesData: {}, convergenceData:[] }; // Initialize timeseriesFinalData with the correct structure
        let socket: WebSocket | null = null;

        const connectForOriginalSignalMatrix = (): void => {
            const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_BASE_URL}/changed-matrix`);

            ws.onopen = () => {
                socket = ws;
                const message = JSON.stringify({
                    nodes: nodeIds,
                    edge_labels: edgeLabels
                });
                ws.send(message);   
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reconnect();
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            ws.onmessage = async (event) => {
                if (typeof event.data === 'string') {
                    const data = JSON.parse(event.data);
                    const nodeId = data.node;
                    const timelineData = data.data;
                    blinkNode = { node_blink: data.node_blink }; // Update blinkNode with received data
                    console.log(data.convergence, "123456789098765434567890")
                    convergenceData = data.convergence
                    // Ensure responseData[nodeId] is initialized
                    if (!timeSeriesData[nodeId]) {
                        timeSeriesData[nodeId] = {};
                    }

                    // Assign values to responseData[nodeId]
                    Object.assign(timeSeriesData[nodeId], timelineData);
                }

                if (Object.keys(timeSeriesData).length === nodeIds.length) {
                    timeseriesFinalData = {
                        TimeSeriesData: timeSeriesData,
                        blinkNodes: blinkNode,
                        convergenceData: convergenceData
                    }
                    resolve(timeseriesFinalData);
                    ws.close();
                    console.log('Received message:', timeseriesFinalData);
                }

                // Resolve the promise with the received data before closing the connection
               
            };

            socket = ws;
        };

        const reconnect = (): void => {
            console.log('Attempting to reconnect...');
            setTimeout(() => {
                connectForOriginalSignalMatrix();
            }, 3000); // Reconnect after 3 seconds
        };

        connectForOriginalSignalMatrix();
    });
}
