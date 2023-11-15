import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { IMessage } from '../common/interfaces';

// Define a type for the slice state
export interface CommonState {
    message?: IMessage;
}

// Define the initial state using that type
const initialState: CommonState = {
    message: undefined
};

export const commonSlice = createSlice({
    name: 'common',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        addMessage: (state, action: PayloadAction<IMessage>) => {
            state.message = action.payload;
        }
    }
});

export const { addMessage } = commonSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getMessage = (state: RootState) => state.common.message;

export default commonSlice.reducer;