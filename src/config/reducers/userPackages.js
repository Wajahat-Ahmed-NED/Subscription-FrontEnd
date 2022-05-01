const INITIAL_STATE = {
    
}

const reducer = (state = INITIAL_STATE, action) => {
    console.log(action);

    if (action.type === "DATAFROMLOGIN") {
        // state.apiData = action.apiData;
        return { ...action, ...state };
    }
    return state;
};
export default reducer;