// InputNode.jsx
import React from 'react';
import { Handle } from 'react-flow-renderer';

function InputNode({ data, isConnectable }) {
    const handleInputChange = (event) => {
        data.label = event.target.value;
    };

    return (
        <div className="node">
            <Handle type="target" position="left" style={{ background: '#555' }} isConnectable={isConnectable} />
            <div>
                <textarea value={data.label} onChange={handleInputChange} />
            </div>
            <Handle type="source" position="right" style={{ background: '#555' }} isConnectable={isConnectable} />
        </div>
    );
}

export default InputNode;
