import React, {useEffect} from 'react';
import PropTypes from "prop-types";

function Title(props) {
    useEffect(() => {
        document.title = props.title;
    });

    return (
        <>
            {props.children}
        </>
    );
}

Title.propTypes = {
    children: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}

export default Title;

