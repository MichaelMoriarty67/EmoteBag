import React, { useState } from 'react';
import './styles/FileDrop.css';

function FileDrop(props) {

    const handleDragIn = (e) => {
        e.preventDefault();
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault()
        props.setFile(e.dataTransfer.files[0]);

    }

    return (
        <div 
        className="FileDrop-wrapper"
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragIn(e)}
        onDrop={(e) => handleDrop(e)}>

            

            { props.getFile ? (
                <h4 style={{color: 'black'}}>{props.getFile.name}</h4>
            ) : (
                <p>Drop your Image here</p>
            )}

        </div>
    )
}


export default FileDrop;