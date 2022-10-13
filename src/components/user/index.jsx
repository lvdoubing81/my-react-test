import { useSelector, useDispatch } from 'react-redux'
import { nameIncremnet, nameDecrement, ageIncrement, ageDecrement, userThunk } from '../../store/slices/userSlice'

export function User () {
    const userName = useSelector(state => state.user.name)
    const userAge = useSelector(state => state.user.age)
    const counter = useSelector(state => state.counter.value)
    const disaptch = useDispatch()

    const userNameIncrement = ()=>{
        disaptch(nameIncremnet())
    }
    const userNameDecrement = ()=>{
        disaptch(nameDecrement())
    }
    const userAgeIncrement = ()=>{
        disaptch(ageIncrement(5))
    }
    const userAgeDecrement = ()=>{
        disaptch(ageDecrement(3))
    }
    const handleUserThunk = async() => {
        const res = await disaptch(userThunk(6))
        console.log(res);
        userAgeIncrement()
    }


    return (
        <div>
            <div>{userName}</div>
            <div>{userAge}</div>
            <div>{counter}</div>

            <button onClick={userNameDecrement}>nameIncremnet</button>
            <button onClick={userNameIncrement}>nameDecremnet</button>
            <button onClick={userAgeIncrement}>ageIncremnet</button>
            <button onClick={userAgeDecrement}>ageDecremnet</button>
            <button onClick={handleUserThunk}>handleUserThunk</button>

        </div>
    )
}