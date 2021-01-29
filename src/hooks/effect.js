import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

/* 关于怎么在两个dependenci同时改变 */
const Count = props => {
    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);

    return (
        <>
            <button onClick={() => setCount1(x => x + 1)}>计数1</button>
            <p>{count1}</p>
            <button onClick={() => setCount2(x => x + 1)}>计数2</button>
            <p>{count2}</p>
            <button onClick={() => {
                setCount1(x => x + 1);
                setCount2(x => x + 1)
            }}>总计数</button>
            <Test one={count1} two={count2} /> 
        </>
    )
};

const Test = props => {
    let isChange = 0;

    useEffect(() => {
        isChange++
    }, [props.one]);

    useEffect(() => {
        isChange ++;
        if (isChange === 2) console.log('effect');
    }, [props.two]);

    return null;
};

ReactDOM.render(<Count />, document.getElementById('root'));