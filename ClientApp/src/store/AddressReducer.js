const getAddressesStart = 'GET_ADDRESSES_START';
const getAddressesFinish = 'GET_ADDRESSES_FINISH';
const deleteAddressStart = 'DELETE_ADDRESS_START';
const deleteAddressFinish = 'DELETE_ADDRESS_FINISH';
const addAddressStart = 'ADD_ADDRESS_START';
const addAddressFinish = 'ADD_ADDRESS_FINISH';
const deleteAddressesStart = 'DELETE_ADDRESSES_START';
const deleteAddressesFinish = 'DELETE_ADDRESSES_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const editAddressStart = 'EDIT_ADDRESS_START';
const editAddressFinish = 'EDIT_ADDRESS_FINISH';
const clearEditAddress = 'CLEAR_EDIT_ADDRESS';
const initialState = { addresses: [], editAddress: {}, isLoading: false, fileSaved: false, fileError: false };

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
        fetch(url, { method: 'delete' });

        dispatch({ type: deleteAddressFinish, id });
    },
    DeleteAddressesSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteAddressesStart });

        idSet.forEach(async function (id) {
            const url = `api/AddressSets/${id}`;
            fetch(url, { method: 'delete' });
        });

        dispatch({ type: deleteAddressesFinish, idSet });
    },
    AddAddressSet: (data) => async (dispatch) => {
        dispatch({ type: addAddressStart });

        const url = `api/AddressSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newAddress) {
                dispatch({ type: addAddressFinish, newAddress });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/AddressSets/ToExcel`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                if (response.ok) {
                    dispatch({ type: toExcelFinish });
                } else {
                    dispatch({ type: toExcelError });
                }
            });
    },
    ToExcelClose: () => async (dispatch) => {
        dispatch({ type: toExcelClose });
    },
    ToExcelErrorClose: () => async (dispatch) => {
        dispatch({ type: toExcelErrorClose });
    },
    ClearEditAddress: () => async (dispatch) => {
        dispatch({ type: clearEditAddress });
    },
    StartEditAddress: (data) => async (dispatch) => {
        dispatch({ type: editAddressStart, data });
    },
    EditAddressSet: (data) => async (dispatch) => {
        const url = `api/AddressSets/${data.id}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'put', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                dispatch({ type: editAddressFinish, data });
        });
    },
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

    if (action.type === addAddressStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addAddressFinish) {

        let addresses = state.addresses;

        const newAddress = action.newAddress;

        addresses.push(newAddress);

        return {
            ...state,
            addresses: addresses,
            isLoading: false
        };
    }

    if (action.type === toExcelFinish) {
        return {
            ...state,
            fileSaved: true
        };
    }

    if (action.type === toExcelError) {
        return {
            ...state,
            fileError: true
        };
    }

    if (action.type === toExcelClose) {
        return {
            ...state,
            fileSaved: false
        };
    }

    if (action.type === toExcelErrorClose) {
        return {
            ...state,
            fileError: false
        };
    }

    if (action.type === editAddressStart) {
        return {
            ...state,
            editAddress: action.data
        };
    }

    if (action.type === editAddressFinish) {
        let addresses = state.addresses;
        let newAddress = action.data;

        const adrIndex = addresses.findIndex(u => u.id === newAddress.id);

        addresses[adrIndex] = newAddress;

        return {
            ...state,
            addressed: addresses,
            isLoading: false
        };
    }

    if (action.type === clearEditAddress) {
        return {
            ...state,
            editAddress: {}
        };
    }

    return state;
};
