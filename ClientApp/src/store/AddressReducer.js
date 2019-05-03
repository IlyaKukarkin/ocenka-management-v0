﻿const getAddressesStart = 'GET_ADDRESSES_START';
const getAddressesFinish = 'GET_ADDRESSES_FINISH';
const deleteAddressStart = 'DELETE_ADDRESS_START';
const deleteAddressFinish = 'DELETE_ADDRESS_FINISH';
const initialState = { addresses: [], isLoading: false };

export const actionCreators = {
    GetAddressSet: () => async (dispatch) => {
        dispatch({ type: getAddressesStart });

        const url = `api/AddressSets`;
        const response = await fetch(url);
        const adresses = await response.json();

        dispatch({ type: getAddressesFinish, adresses });
    },
    DeleteAddressSet: (id) => async (dispatch) => {
        dispatch({ type: deleteAddressStart });

        const url = `api/AddressSets/${id}`;
        const response = await fetch(url, { method: 'delete' });

        dispatch({ type: deleteAddressFinish });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getAddressesStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getAddressesFinish) {
        return {
            ...state,
            addresses: action.adresses,
            isLoading: false
        };
    }

    return state;
};