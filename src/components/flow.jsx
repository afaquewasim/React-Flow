import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlowProvider } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

const rfStyle = {
    backgroundColor: '#000',
};

const initialNodes = [
    { id: 'node-1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Input Node', content: 'Node content' } },
];

const initialEdges = [];

function Flow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [selectedNodeType, setSelectedNodeType] = useState('input'); // Default to input node type
    const [editingNodeId, setEditingNodeId] = useState(null); // Track the ID of the node being edited

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const handleAddNode = useCallback(() => {
        if (selectedNodeType) {
            const newNodeId = `node-${nodes.length + 1}`;
            const newNode = {
                id: newNodeId,
                type: selectedNodeType,
                position: { x: 0, y: 0 },
                data: { label: `${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} Node`, content: 'Node content' },
            };
            setNodes((prevNodes) => [...prevNodes, newNode]);
        }
    }, [nodes, selectedNodeType]);

    const handleContentChange = (event, nodeId) => {
        const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        content: event.target.value,
                    },
                };
            }
            return node;
        });
        setNodes(updatedNodes);
    };

    const handleLabelChange = (event, nodeId) => {
        const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: event.target.value,
                    },
                };
            }
            return node;
        });
        setNodes(updatedNodes);
    };

    const handleDeleteSelected = () => {
        const selectedElements = nodes.concat(edges).filter(el => el.selected);
        if (selectedElements.length > 0) {
            const elementsToRemove = selectedElements.map(el => ({ id: el.id, type: el.type }));
            setNodes(nodes => nodes.filter(node => !node.selected));
            setEdges(edges => edges.filter(edge => !edge.selected));
        }
    };

    const handleNodeDoubleClick = (event, node) => {
        setEditingNodeId(node.id);
    };

    return (
        <div style={{ width: '100%', height: '1000px' }}>
            <div>
                <select value={selectedNodeType} onChange={(e) => setSelectedNodeType(e.target.value)}>
                    <option value="input">Input Node</option>
                    <option value="output">Output Node</option>
                    <option value="default">Default Node</option>
                </select>
                <button onClick={handleAddNode} disabled={!selectedNodeType}>Add Node</button>
                <button onClick={handleDeleteSelected}>Delete Selected</button>
            </div>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    style={rfStyle}
                    snapToGrid={true}
                    snapGrid={[15, 15]}
                    nodeTypes={{
                        custom: ({ data }) => (
                            <div className="editable-node" onDoubleClick={(event) => handleNodeDoubleClick(event, data)}>
                                {editingNodeId === data.id ? (
                                    <input
                                        type="text"
                                        value={data.label}
                                        onChange={(e) => handleLabelChange(e, data.id)}
                                        onBlur={() => setEditingNodeId(null)}
                                        autoFocus
                                    />
                                ) : (
                                    <div>{data.label}</div>
                                )}
                                <textarea
                                    value={data.content}
                                    onChange={(e) => handleContentChange(e, data.id)}
                                    placeholder="Enter content..."
                                />
                            </div>
                        ),
                    }}
                    deleteKeyCode={46} // Set the delete key code
                />
            </ReactFlowProvider>
        </div>
    );
}

export default Flow;
