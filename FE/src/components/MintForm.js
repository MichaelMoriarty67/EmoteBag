import './styles/MintForm.css';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import MintLoadLine from './MintLoadLine';
import FileDrop from './FileDrop';

const uploadImg = require('../public/upload.png');
const client = create('https://ipfs.infura.io:5001/api/v0');


function MintForm(props) {

    const [emoteName, setEmoteName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [ipfsMeta, setIpfsMeta] = useState('');
    const [mintStatus, setMintStatus] = useState(false)



    // Calls Emotes.sol to mint an NFT
    const mintEmote = async (tokenURI) => {
        try {

            const { ethereum } = window;

            if (ethereum && ipfsMeta !== '') { // wont call if you dont have MM or have a URI to pass

                props.setLoading(true); // sets mint loader to ON

                let txn = await props.ethConnection.contract.uploadEmote(tokenURI);
                console.log("Emote minted! Here's your transaction: ", txn);
                props.togglePopup()

            } else {
                alert("Either you dont have metamask or you didnt upload metadata from IPFS")
            }

        } catch(error) {
            console.error("Fromt mintEmote(): ", error);
            props.setLoading(false);
        }
    }



    // adds image and metadata to IPFS
     async function handleSubmit(e) {
        e.preventDefault(); // prevents reload 

        try {
            const added = await client.add(selectedFile); // adds file to IPFS
            const hash = added.path; // gets IPFS CID
            setIpfsHash(hash);

            // create the json metadata object
            const metaObj = {
                "name": emoteName,
                "image": hash
            };
            const jsonObj = JSON.stringify(metaObj);

            // add json metadata to IPFS
            const jsonAdded = await client.add(jsonObj);
            const jsonHash = jsonAdded.path;
            setIpfsMeta(jsonHash);

        } catch(error) {
            console.log('Error uploading metadata to IPFS: ', error);
        }
            
    }

    // handles the drop [NOT DONE OR WORKS]


    // tester function for things I gotta test on the fly
    const testBtn = () => {
        console.log('Image Hash: ', ipfsHash);
        console.log('MetaData Hash: ', ipfsMeta);
    }

    

    return (
        
        <div>
            <form onSubmit={handleSubmit} className='mintForm'>
                <div className="MintForm-close">
                    <h4 onClick={() => props.togglePopup()}>X</h4>
                </div>
                <h2 id="text-gradient">Mint Your Emote</h2>

                { ipfsHash ? (
                    <div className='mintForm-content' >
                        <div className='image-wrapper'>
                            <img src={`https://ipfs.io/ipfs/${ipfsHash}`} />
                            <h4>IPFS Metadata:</h4>
                            <div id="text-scroll">
                                <p>{`https://ipfs.io/ipfs/${ipfsMeta}`}</p>
                            </div>
                            <h4>Name:</h4>
                            <div id="text-scroll">
                                <p>{emoteName}</p>
                            </div>
                        </div>
                        <button onClick={() => { mintEmote(ipfsMeta) }}>
                            <h3>Mint!</h3>
                        </button>
                    </div>
                ) : (
                    <div className='mintForm-content'>
                        <label className="MintForm-file">
                            <FileDrop 
                            setFile={setSelectedFile}
                            getFile={selectedFile}/>
                        </label>
                        <label className="MintForm-text">
                            <input
                            placeholder=":EmoteName:"
                            type="text"
                            value={emoteName}
                            onChange={(e) => setEmoteName(e.target.value)}
                            />
                        </label>
                        
                        <button type="submit">
                            <p>{props.name}</p>
                        </button>
                    </div>
                )}
            </form>
                
        </div>    
        
    )
}


export default MintForm;