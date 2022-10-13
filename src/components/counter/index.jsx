import React from 'react';
import { connect } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, add } from '../../store/slices/counterSlice';
import { ageIncrement } from '../../store/slices/userSlice';

class Counter extends React.Component{
    render() {
        return (
            <div>
                <div>{this.props.counter}</div>
                <div>{this.props.userName}</div>
                <div>{this.props.userAge}</div>
            </div>
        )
    }
}

const mapStateToProps = (state, preProps) => {
    return {
        counter: state.counter.value,
        userName: state.user.name,
        userAge: state.user.age
    }
};

const mapDispatchToProps = (dispatch, preProps) => {
    return {
        handleIncrement() {
            dispatch(increment())
        },
        handleDecrement() {
            dispatch(decrement())
        },
        handleAdd() {
            dispatch(add(10))
        },
        handleUseAge() {
            dispatch(ageIncrement(10))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)

// export function Counter () {
//     const counter = useSelector((state)=> state.counter.value)
//     const userName = useSelector((state)=>state.user.name)
//     const userAge = useSelector((state) => state.user.age)
//     const disaptch = useDispatch()

//     const countIncrement = () => {
//         disaptch(increment())
//     }
//     const countDecrement = () => {
//         disaptch(decrement())
//     }
//     const handleAdd = () => {
//         disaptch(add(10))
//     }
//     return (
//         <div>
//             <div>{counter}</div>
//             <div>{userName}</div>
//             <div>{userAge}</div>

//             <div>
//                 <button onClick={countIncrement}>increment++</button>
//                 <button onClick={countDecrement}>decrement--</button>
//                 <button onClick={handleAdd}>add++</button>
//             </div>
//         </div>
//     )
// }