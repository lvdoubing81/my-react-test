import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";


const userSlice =  createSlice({
    name: 'user',
    initialState: {
        name: 'bai',
        age: 3
    },
    reducers: {
        nameIncremnet: (state) => {
            state.name += '!'
        },
        nameDecrement: (state) => {
            state.name = state.name.slice(0, state.name.length - 1)
        },
        ageIncrement: (state, action) => {
            state.age += action.payload
        },
        ageDecrement: (state, action) => {
            state.age -= action.payload
        }
    }
})

export const userThunk = createAsyncThunk(
    "user/thunk",
    async (payload, thunkAPI) => {
        console.log(payload);
        const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${payload}`);
        const response = await res.json()
        // 调用普通的action
        thunkAPI.dispatch(ageIncrement(8))
        // 返回值会作为action返回对象payload属性
        return response
    }
)

// 相当于以前的action
export const { nameIncremnet, nameDecrement, ageIncrement, ageDecrement } = userSlice.actions
// 相当于以前的reducer
export default userSlice.reducer