import { w3cwebsocket as WebSocket } from 'websocket';

interface EdgeLabels {
    [sourceTarget: string]: string;
}


interface TimeseriesData {
    [key: string]: {
        [key: string]: number;
    };
}

interface TimeseriesDataFinalOutput {
    TimeSeriesData: TimeseriesData;
}

export default function connectInitialWebSocket(nodeIds: string[], edgeLabels: EdgeLabels): Promise<TimeseriesDataFinalOutput> {
    return new Promise<TimeseriesDataFinalOutput>((resolve, reject) => {

        let timeSeriesData: TimeseriesData = {};
        let timeseriesFinalData: TimeseriesDataFinalOutput = {TimeSeriesData: {} }; // Initialize timeseriesFinalData with the correct structure
        let socket: WebSocket | null = null;

        const connectForOriginalSignalMatrix = (): void => {
            const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_BASE_URL}/initial-matrix`);

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
