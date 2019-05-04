const getAddressesStart = 'GET_ADDRESSES_START';
const getAddressesFinish = 'GET_ADDRESSES_FINISH';
const deleteAddressStart = 'DELETE_ADDRESS_START';
const deleteAddressFinish = 'DELETE_ADDRESS_FINISH';
const deleteAddressesStart = 'DELETE_ADDRESSES_START';
const deleteAddressesFinish = 'DELETE_ADDRESSES_FINISH';
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

        dispatch({ type: deleteAddressFinish, id });
    },
    DeleteAddressesSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteAddressesStart });

        idSet.forEach(async function (id) {
            const url = `api/AddressSets/${id}`;
            const response = await fetch(url, { method: 'delete' });
        });

        dispatch({ type: deleteAddressesFinish, idSet });
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

    if (action.type === deleteAddressStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteAddressFinish) {

        let newAddresses = state.addresses;

        for (var i = 0; i < newAddresses.length; i++) {
            if (newAddresses[i].id === action.id) {
                newAddresses.splice(i, 1);
            }
        }

        return {
            ...state,
            addresses: newAddresses,
            isLoading: false
        };
    }

    if (action.type === deleteAddressesStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteAddressesFinish) {

        let newAddresses = state.addresses;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newAddresses.length; k++) {
                if (newAddresses[k].id === action.idSet[j]) {
                    newAddresses.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            addresses: newAddresses,
            isLoading: false
        };
    }

    return state;
};
