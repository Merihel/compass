import React, { useEffect, useState } from 'react';
import AbstractComponent from "./AbstractComponent"
import Bus from "../utils/Bus"

export const FlashMessage = () => {
    let [visibility, setVisibility] = useState(true);
    let [message, setMessage] = useState('');   
    let [title, setTitle] = useState('');   
    let [type, setType] = useState('info');
    let [closable, setClosable] = useState(false);

    useEffect(() => {
        Bus.addListener('showMessage', (title, message, timeout, type) => {
            console.log("on event listener", timeout)
            setVisibility(true);
            setTitle(title);
            setMessage(message);
            setType(type);
            setTimeout(() => {
                setVisibility(false);
            }, timeout);
        });
    }, []);

    useEffect(() => {
        if(document.querySelector('.close') !== null) {
            document.querySelector('.close').addEventListener('click', () => setVisibility(false));
        }
    })

    let classes = "ui floating message"
    classes = classes + " " + type

    return visibility && (
        <div className={classes}>
            {closable && <i className="close icon"></i>}
            <div className="header">
                {title}
            </div>
            <p>{message}</p>
        </div>
    ) 
}