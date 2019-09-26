/* eslint-disable */ 

// libs
import React, { useState, useEffect, useRef } from 'react';
import ClassNames from 'classnames';

// components
import MenuButtonChild from './MenuButtonChild';

// styles
import '../styles/components/MenuButtonParent.scss';

const MenuButtonParent = (props) => {

    // track elements inside the menu
    const node = useRef();

    // set state
    const [isOpen, setIsOpen] = useState(true);
    const [openChildIndex, setOpenChildIndex] = useState(-1);
    const numOfChildren = props.childButtonProps.length;

    // set classes
    const classPrefix = 'menu-button-parent';
    const classNames = ClassNames({
        [classPrefix]: true,
        [`${classPrefix}-open`]: isOpen,
    });

    // handle click events outside of the node's dom
    const handleOutsideClick = (e) => {
        if(!node.current.contains(e.target)) {
            // if a child menu is open, close it
            if(openChildIndex !== -1) {
                setOpenChildIndex(-1);
                return;
            // if child menus are all close, close the parent menu
            } else if(isOpen) {
                setIsOpen(false);
                return;
            }
        }
    }

    // add and remove event listeners to handle outside clicks
    useEffect(() => {
        if(isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick); }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, openChildIndex]);

    return (
        
        <div className = 'menu-button' ref = {node}>

            <button 
                className = {classNames}
                style = {{
                    zIndex: numOfChildren + 1,
                    width: props.parentSize,
                    height: props.parentSize
                }}
                onClick = { (e) => {
                    e.preventDefault();
                    isOpen && setOpenChildIndex(-1);
                    props.clickToOpen && setIsOpen(!isOpen);
                }}
                >                
            </button>

            {props.childButtonProps.map((child, index) => (
                
                <MenuButtonChild 

                    // button content
                    id = { child.id }
                    key = { child.id }
                    content = { props.childButtonProps[index].content }
                    
                    // button appearance
                    autoOpen = { child.autoOpen }
                    icon = { child.icon }
                    direction = { props.direction }
                    index = { index + 1 }
                    openChildIndex = { openChildIndex }
                    setOpenChildIndex = { setOpenChildIndex }
                    zIndex = { numOfChildren - index }
                    separation = { props.separation }
                    size = { props.childSize }
                    parentSize = { props.parentSize }
                    parentWidth = { `calc(${props.parentSize} + ((${props.childSize} + ${props.separation}) * ${numOfChildren - 1}))`}
                    parentIsOpen = { isOpen }

                />

            ))}
            
        </div>
    )

}

export default MenuButtonParent;