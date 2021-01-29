import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import useDraggableList from './useDraggable';
import {DRAG_TYPE} from './useDraggable';

import './index.css';

const list = [
    {
      src:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586970234373&di=a665d347ed7acfed0f39aad0bb78509a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201504%2F05%2F20150405H5939_PJwYi.jpeg",
      title: "万事屋找我"
    },
    {
      title: "吃吃吃……",
      src:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586970602470&di=e3071fc352ca96f73bf2e75725d3f7bf&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201208%2F31%2F20120831140113_ayLse.thumb.700_0.jpeg"
    },
    {
      title: "Egg",
      src:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=968093909,4033932240&fm=26&gp=0.jpg"
    }
  ];

const App = () => {
    return (
        <DraggableList list={list} Card={Card} />
    );
};

function DraggableList({list, Card}) {
    const {dragList, createDraggerProps, createDropperProps} = useDraggableList(list);

    return dragList.map((item, index) => {
        if (item.type === DRAG_TYPE[Symbol.for('draggable')]) {
            return <Draggable key={item.id} {...createDraggerProps(index)}>
                <Card {...item.data} />
            </Draggable>
        } else {
            return <Bar key={item.id} id={item.id}  {...createDropperProps(index)} />
        }
    })
}

function Draggable({children, index, eventHandlers, dragging}) {
    return <div className={classnames('draggable', {dragging: dragging === index})} draggable={true} {...eventHandlers}>
        {children}
    </div>
}

function Bar({index, dragging, dragover, eventHandlers}) {
    if (index === dragging + 1) return null;

    return <div {...eventHandlers} className={classnames('draggable_bar', {draggable_over_bar: dragover === index})}>
        <div style={{height: index === dragover ? '80px': '0'}} className="inner"></div>
    </div>
}

function Card ({src, title}) {
    return (
        <div className="card">
            <img src={src} />
            <span>{title}</span>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));