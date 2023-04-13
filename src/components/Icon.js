import React, { useState } from "react";
import { SortAlphaDown, SortAlphaUp } from "react-bootstrap-icons";


function Icon(props) {


    return (
        <>
        {
            props.sort === 'asc' && props.order===props.type  ? <SortAlphaDown {...props} className="sort" /> : <SortAlphaUp {...props} className="sort" />
        }</>
    )
}
export default Icon;