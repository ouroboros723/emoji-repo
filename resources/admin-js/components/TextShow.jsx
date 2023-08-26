import React, {useEffect} from 'react';
import PropTypes from "prop-types";

function TextShow(props) {
    return (
        <div style={{width: '100%', margin: '8px 0'}}>
            <div style={{fontSize: '10px', fontWeight: 'bold', marginBottom: '3px'}}>{props?.label}</div>
            <div style={{fontSize: '18px'}}>{(props.text == '' || props.text == null) ? '　' : props.text}</div>
        </div>
    );
}

TextShow.propTypes = {
    label: PropTypes.string,
    text: PropTypes.string.isRequired,
}

export default TextShow;

