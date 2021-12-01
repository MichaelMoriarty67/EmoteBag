import React from 'react';
import './styles/ViewSwitchBtn.css'

function ViewSwitchBtn(props) {

    const handleBtnClick = () => {
        props.emoteHeroCallback();
    }

    return (
        <div>
            <button className="info-btn" onClick={handleBtnClick}>
                <h4 id="text-gradient">{props.name.toUpperCase()}</h4>
            </button>
        </div>
        
    )
}


export default ViewSwitchBtn;