import React from 'react';

export default  App = ()=> {
    const name = 'Test';
    return <Hello name={name} />
}

const Hello = (props) => {
    return (
        <div>
            <h1>Hello</h1>
            <Greeting name = {props.name} />
        </div>
    )
}

const Greeting = props => {
    return <div>{`my name is ${props.name}`}</div>
}

/* 错误用法 ，effect不支持直接 async await*/
useEffect(async ()=>{
    /* 请求数据 */
  const res = await getData()
},[])


const App = () => {
    useEffect(() => {
      (async function getDatas() {
        await getData();
      })();
    }, []);
    return <div></div>;
};





// import React, {useState, useEffect} from 'react'

// const Test =  ()=> {
//     const [user, setUser] = useState(null)
//     const [name, setName] = useState('test')
//     useEffect(()=>{
//         console.log('component is mounted');
//     }, [])
//     handleClick = ()=> {
//         console.log('click');
//     }

//     return  <div onClick={handleClick}> click </div>
// }
// export default React.memo(Test)
