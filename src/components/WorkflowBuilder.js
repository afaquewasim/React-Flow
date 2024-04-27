import React, { useState } from 'react';
import ReactFlow, { addEdge } from 'react-flow-renderer';

const WorkflowBuilder = () => {
    const [elements, setElements] = useState([]);

    const onConnect = (params) => {
        console.log("onConnect called");
        setElements((els) => addEdge(params, els));
    };

    const onNodeDragStop = (event, node) => {
        console.log("onNodeDragStop called");
        const updatedNode = { ...node, position: { x: node.position.x + event.movementX, y: node.position.y + event.movementY } };
        const newElements = elements.map((el) => {
            if (el.id === node.id) {
                return updatedNode;
            }
            return el;
        });
        setElements(newElements);
    };

    const onLoad = (reactFlowInstance) => {
        console.log("onLoad called");
        reactFlowInstance.fitView();
    };

    const addNode = () => {
        console.log("Adding Node...");
        const newNode = {
            id: Date.now().toString(),
            type: 'default',
            data: { label: 'New Node' },
            position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        };
        setElements((els) => els.concat(newNode));
    };

    return (
        <div style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
            <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onLoad={onLoad}
                snapToGrid={true}
                snapGrid={[15, 15]}
                nodeTypes={{
                    default: ({ node }) => (
                        <div onDragEnd={(event) => onNodeDragStop(event, node)} style={{ background: '#fff', padding: 10, borderRadius: 5 }}>
                            {node.data.label}
                        </div>
                    ),
                }}
            />
            <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={addNode}>Add Node</button>
        </div>
    );
};

export default WorkflowBuilder;
