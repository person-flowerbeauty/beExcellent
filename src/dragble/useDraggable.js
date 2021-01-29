import React, {useState} from 'react';

export const DRAG_TYPE = {
    [Symbol.for('draggable')]: 'DRAGGABLE',
    [Symbol.for('bar')]: 'BAR'
};

const useDraggable = list => {
    const [dragList, setDragList] = useState(usableList(list));
    const [dragover, setDragover] = useState(null);
    const [dragging, setDragging] = useState(null);

    return {
        dragList,
        createDraggerProps: index => {
            return {
                index,
                dragging,
                eventHandlers: {
                    onDragStart: () => setDragging(index),
                    onDragEnd: () => setDragging(null)
                }
            }
        },
        createDropperProps: index => {
            return {
                index,
                dragging,
                dragover,
                eventHandlers: {
                    onDragOver: e => {
                        e.preventDefault();
                        setDragover(index)
                    },
                    onDragLeave: e => {
                        e.preventDefault();
                        setDragover(null)
                    },
                    onDrop: e => {
                        e.preventDefault();
                        setDragover(null); 
                        setDragList(list => clacChanging(list, dragging, index));
                    }
                }
            }
        }
    }
};

const usableList = list => {
    let i = 0;
    return [insetBars(i++)].concat(
        ...list.map(item => [draggable(item, i++), insetBars(i++)])
    );
};

const insetBars = (index) => {
    return {
        type: DRAG_TYPE[Symbol.for(['bar'])],
        id: index
    }; 
};

const draggable = (item, index) => {
    return {
        type: DRAG_TYPE[Symbol.for(['draggable'])],
        id: index,
        data: item
    };
};

const clacChanging = (list, dragging, id) => {
    const dragList = list.slice();
    
    if (dragging - 1 === id) return dragList;

    dragList.splice(id + 1, 0, ...dragList.splice(dragging, 2));
    
    return dragList;
};

export default useDraggable;