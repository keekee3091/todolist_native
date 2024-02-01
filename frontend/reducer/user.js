import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { email: null, token: null, username: null },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.value.email = action.payload.email;
            state.value.token = action.payload.token;
            state.value.username = action.payload.username;
        },
        logoutUser: (state) => {
            state.value.email = null;
            state.value.token = null;
            state.value.username = null;
        },
    },
});

export const { loginUser, logoutUser, } = userSlice.actions;
export default userSlice.reducer