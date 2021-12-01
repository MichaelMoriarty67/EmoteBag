import React, { useState } from 'react';
import './styles/EmoteCard.css';

function EmoteCard(props) {
    const [hover, setHover] = useState(false);

    return (
        <div 
        className="EmoteCard-image-wrapper"
        onClick={() => {props.displayEmote(props.emoteName, props.emoteOwner, props.imgUrl)}}
        onMouseEnter={() => {
            setHover(true)
        }}
        onMouseLeave={() => {
            setHover(false)
        }}
        >
            <img src={props.imgUrl} /> 
            {hover ? (
                <div className="emoteCard-overlay">
                    <p>Name: {props.emoteName}</p>
                    <p>Owner: {props.emoteOwner.substr(0,5)}...{props.emoteOwner.substr(-4,4)}</p>
                    <div className="bottom-arrow"></div>
                </div>
            ) : null }
        </div>
    )
}




export default EmoteCard;