import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EmoteCard from './EmoteCard';
import ViewSwitchBtn from './ViewSwitchBtn';
import './styles/EmoteHero.css';


function EmoteHero(props) {
    const [allEmotes, setAllEmotes] = useState([]);
    const [userEmotes, setUserEmotes] = useState([]);
    const [allEmoteCards, setAllEmoteCards] = useState([]);
    const [userEmoteCards, setUserEmoteCards] = useState([]);
    const defaultEmote = {
        name: "Pepe",
        owner: "0xdf..34gF",
        img: "https://ipfs.io/ipfs/QmVHygiswzyGskdhiiKiuHTeb1DfRHaV7FdHzSoE9jxxTB"
    }
    const [renderEmote, setRenderEmote] = useState(defaultEmote);
    const [renderEmoteCardArray, setRenderEmoteCardArray] = useState([]);
    const [btnName, setBtnName] = useState('Display My Emotes');

    const loadAllEmotes = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {

                // query past events from chain
                const eventFilter = [props.ethConnection.contract.filters.emoteTransfer()];
                const eventList = await props.ethConnection.contract.queryFilter(eventFilter);
                console.log(eventList);

                // loop over events and look for emoteTransfer
                for (let i = 0; i < eventList.length; i++) {
                    if (eventList[i].event === "emoteTransfer" & eventList[i].args.ipfsHash !== '') {


                        // retrieve the json from IPFS, create emote obj, add obj to state
                        const response = await fetch(`https://ipfs.io/ipfs/${eventList[i].args.ipfsHash}`);
                        const emoteJson = await response.json(); 

                        let emote = {
                            owner: eventList[i].args.to.toLowerCase(),
                            name: emoteJson.name,
                            ipfsURI: eventList[i].args.ipfsHash,
                            image: emoteJson.image
                        }

                        emoteDataToState(eventList[i].args.to.toLowerCase(), emoteJson.name, eventList[i].args.ipfsHash, emoteJson.image, false);
                        
                    }
                }

                setRenderEmoteCardArray(allEmoteCards); 
            }

        } catch(error) {
            console.error("Error from loadAllEmotes(): ", error);
        }

    }

    // displays emote in ls viewer
    const displayEmote = (name, owner, imgUrl) => {
        const currentEmote = {
            name: name,
            owner: owner,
            img: imgUrl
        }
        setRenderEmote(currentEmote);
    }


    // creates an emote js literal object
    const createEmote = (owner, name, ipfsURI, image) => {
        let emote = {
            owner: owner.toLowerCase(), // lower case because thats how MetaMask address is.
            name: name,
            ipfsURI: ipfsURI,
            image: image
        }
        return emote;
    }

    // creates an emoteCard componnet from an emote obj
    const createEmoteCard = (emote) => {
        let emoteCard = <EmoteCard 
        imgUrl={`https://ipfs.io/ipfs/${emote.image}`}
        emoteName={emote.name}
        emoteOwner={emote.owner}
        displayEmote={displayEmote}
        />
        return emoteCard;
    }


    // Adds emote to allEmote state and myEmote state if you're the owner
    // Renders the cards you've created by adding them to card render state
    const emoteDataToState = (owner, name, ipfsURI, image, render) => {
        let emote = createEmote(owner, name, ipfsURI, image);
        const emoteCard = createEmoteCard(emote);

        // add js obj and component to state
        allEmotes.push(emote);
        allEmoteCards.push(emoteCard);

        // if user owns emote, add js obj and component to state
        if (emote.owner === props.userAddress) {
            userEmotes.push(emote);
            userEmoteCards.push(emoteCard);
        }

        if (render === true) {
            setRenderEmoteCardArray(allEmoteCards);
        } 
    }


    // handles a callback from ViewSwitchBtn
    const handleBtnCallback = () => {
        if (renderEmoteCardArray === allEmoteCards) {
            setRenderEmoteCardArray(userEmoteCards);
            setBtnName("Display All Emotes")
        } else {
            setRenderEmoteCardArray(allEmoteCards);
            setBtnName("Display My Emotes")
        }
    }

    
    const testBtn = () => {
        console.log("All emote objs: ", allEmotes);
        console.log("My emote objs: ", userEmotes );
        console.log("All Emote Cards: ", allEmoteCards);
        console.log("My Emote Cards: ", userEmoteCards);
        console.log("Emotes to render (btn): ", renderEmoteCardArray);
        console.log("Eth Conn: ", props.ethConnection);
        console.log("render Emote: ", renderEmote);
    }


    useEffect(() => {
        loadAllEmotes();
        props.childFunc.current = emoteDataToState;
    }, [])


    return (
        <div className="EmoteHero-container">

            <div className="collection-info-wrapper">
              <div className="collection-info-child">
                <h4 id="text-gradient">Emotes Minted: {props.amtEmotes}</h4>
              </div>
              {props.mintLoading ? (
                  <div className="parent-loading-pulse">
                      <div className="collection-info-child">
                          <h4 id="text-gradient">MINTING...</h4>
                      </div>
                  </div>
              ) : (
                <div onClick={() => {props.togglePopup()}} className="collection-info-child">
                    <h4 id="text-gradient">MINT</h4>
                </div>
              )}
              <ViewSwitchBtn 
              className="collection-info-child" 
              emoteHeroCallback={handleBtnCallback}
              name={btnName}/>
            </div>

            <div className="EmoteHero-wrapper">
                <div className="EmoteHero-ls">
                    <div className="EmoteHero-ls-display">
                        <div className="EmoteHero-ls-display-content">
                            <div className="EmoteHero-ls-imgwrapper">
                                <img src={renderEmote.img} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="EmoteHero-ls-meta-wrapper">
                        <div className="EmoteHero-ls-meta">
                            <p>{renderEmote.name}</p>
                        </div>
                    </div>
                    <div className="EmoteHero-ls-meta-wrapper">
                        <div className="EmoteHero-ls-meta">
                            <p>{renderEmote.owner.substr(0,5).toUpperCase()}...{renderEmote.owner.substr(-4,4).toUpperCase()}</p>
                        </div>
                    </div>
                </div>
                <div className="EmoteHero-rs-border">
                    <div className="EmoteHero-rs">
                        {renderEmoteCardArray}
                    </div>
                </div>
            </div>

        </div>
        
        
    )
}




export default EmoteHero;