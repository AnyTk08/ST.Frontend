import React from 'react'
import { DividerProp } from './DividerProps'
import './Divider.css'
const Divider = (props: DividerProp) => {
    return (
        <div className="divider line one-line" style={{ textAlign: "left" }}>
            <span>{props.children}</span>
        </div>
    )
};

export default Divider;