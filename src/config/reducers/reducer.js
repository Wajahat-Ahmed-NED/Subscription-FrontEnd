const INITIAL_STATE = {

}

const reducer = (state = INITIAL_STATE, action) => {
    // console.log(action);

    if (action.type === "DATAFROMLOGIN") {
        // console.log(state)
        return { ...action, ...state };
    }
    else if (action.type === "UPDATEUSERDATA") {

        // console.log('action in reducer', action)
        state.userData = action.userData;

        // console.log({ ...state, ...action })
        // console.log("Now actual state is", state)
        return { ...state }
    }
    else if (action.type === "UPDATEPACKAGEDATA") {

        // console.log('action in reducer', action)
        state.packageData = action.packageData;

        // console.log({ ...state, ...action })
        // console.log("Now actual state is", state)
        return { ...state }
    }
    else if (action.type === "UPDATESUBSCRIPTIONDATA") {

        // console.log('action in reducer', action)
        state.subscriptionData = action.subscriptionData;
        if (action.billingData) {
            state.billingData = action.billingData;
        }

        // console.log({ ...state, ...action })
        // console.log("Now actual state is", state)
        return { ...state }
    }
    else if (action.type === "UPDATECUSTOMERDATA") {

        // console.log('action in reducer', action)
        state.customerData = action.customerData;

        // console.log({ ...state, ...action })
        // console.log("Now actual state is", state)
        return { ...state }
    }
    else if (action.type === "UPDATESUBSCRIPTIONID") {

        // console.log('action in reducer', action)
        state.subsId = action.subsId;

        // console.log({ ...state, ...action })
        // console.log("Now actual state is", state)
        return { ...state }
    }

    return state;
};
export default reducer;