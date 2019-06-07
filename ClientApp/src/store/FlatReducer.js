const getFlatsStart = 'GET_FLATS_START';
const getFlatsFinish = 'GET_FLATS_FINISH';
const deleteFlatStart = 'DELETE_FLAT_START';
const deleteFlatFinish = 'DELETE_FLAT_FINISH';
const addFlatStart = 'ADD_FLAT_START';
const addFlatFinish = 'ADD_FLAT_FINISH';
const getEditFlatStart = 'GET_EDIT_FLAT_START';
const getEditFlatFinish = 'GET_EDIT_FLAT_FINISH';
const editFlatStart = 'EDIT_FLAT_START';
const editFlatFinish = 'EDIT_FLAT_FINISH';
const deleteFlatsStart = 'DELETE_FLATS_START';
const deleteFlatsFinish = 'DELETE_FLATS_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const deleteError = 'DELETE_ERROR';
const deleteErrorClose = 'DELETE_ERROR_CLOSE';
const clearEditFlat = 'CLEAR_EDIT_FLAT';
const initialState = { flats: [], editFlat: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetFlatsSet: () => async (dispatch) => {
        dispatch({ type: getFlatsStart });

        const url = `api/FlatSets`;
        const response = await fetch(url);
        const flats = await response.json();

        dispatch({ type: getFlatsFinish, flats });
    },
    ClearEditFlat: () => async (dispatch) => {
        dispatch({ type: clearEditFlat });        
    },
    DeleteFlatSet: (id) => async (dispatch) => {
        dispatch({ type: deleteFlatStart });

        const url2 = `api/ObjectSets/${id}`;
        fetch(url2, { method: 'delete' })
            .then(function (response) {
                if (response.status === 500) {
                    dispatch({ type: deleteError });
                } else {
                    dispatch({ type: deleteFlatFinish, id });
                }
            });
    },
    DeleteFlatsSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteFlatsStart });

        idSet.forEach(async function (id) {
            const url2 = `api/ObjectSets/${id}`;
            fetch(url2, { method: 'delete' })
                .then(function (response) {
                    if (response.status === 500) {
                        dispatch({ type: deleteError });
                    } else {
                        dispatch({ type: deleteFlatFinish, id });
                    }
                });
        });
    },
    AddFlatSet: (data) => async (dispatch) => {
        dispatch({ type: addFlatStart });

        let objectId, addressId;

        let url = `api/ObjectSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newObject) {
                objectId = newObject.id;
                url = `api/AddressSets`;
                fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        return response.json();
                    }).then(function (newAddress) {
                        addressId = newAddress.id;
                        data['id'] = objectId;
                        data['AddressId'] = addressId;
                        fetch('api/FlatSets', { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                            .then(function (response) {
                                return response.json();
                            }).then(function (newClient2) {
                                dispatch({ type: addFlatFinish, data });
                            });
                    });
            });
    },
    GetEditFlat: (data) => async (dispatch) => {
        dispatch({ type: getEditFlatStart, data });
    },
    EditFlatSet: (data) => async (dispatch) => {
        dispatch({ type: editFlatStart });

        let address = {
            id: data.addressId, city: data.city, district: data.district, street: data.street, house: data.house, numberOfFlat: data.numberOfFlat
        };
        let flat = {
            id: data.id,
            area: data.area, numberOfRooms: data.numberOfRooms, floor: data.floor, addressId: data.addressId
        };
        let object = {
            id: data.id,
            cadastralNumber: data.cadastralNumber, aimOfEvaluation: data.aimOfEvaluation
        };

        let url = `api/AddressSets/${data.addressId}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(url, { method: 'put', body: JSON.stringify(address), headers: myHeaders })
            .then(function () {
                fetch(`api/ObjectSets/${data.id}`, { method: 'put', body: JSON.stringify(object), headers: myHeaders })
                    .then(function () {
                        fetch(`api/FlatSets/${data.id}`, { method: 'put', body: JSON.stringify(flat), headers: myHeaders })
                            .then(function () {
                                dispatch({ type: editFlatFinish, data });
                            });
                    });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/FlatSets/ToExcel`;
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
    DeleteErrorClose: () => async (dispatch) => {
        dispatch({ type: deleteErrorClose });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getFlatsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getFlatsFinish) {
        let oldFlats = action.flats;
        let newFlats = [];

        for (let i = 0; i < oldFlats.length; i++) {
            newFlats.push({
                id: oldFlats[i].id, area: oldFlats[i].area, numberOfRooms: oldFlats[i].numberOfRooms, floor: oldFlats[i].floor,
                cadastralNumber: oldFlats[i].idNavigation.cadastralNumber, aimOfEvaluation: oldFlats[i].idNavigation.aimOfEvaluation,
                city: oldFlats[i].address.city, district: oldFlats[i].address.district, street: oldFlats[i].address.street,
                house: oldFlats[i].address.house, numberOfFlat: oldFlats[i].address.numberOfFlat, addressId: oldFlats[i].address.id
            });
        }

        return {
            ...state,
            flats: newFlats,
            isLoading: false
        };
    }

    if (action.type === deleteFlatStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteFlatFinish) {

        let newClients = state.flats;

        for (var i = 0; i < newClients.length; i++) {
            if (newClients[i].id === action.id) {
                newClients.splice(i, 1);
            }
        }

        return {
            ...state,
            flats: newClients,
            isLoading: false
        };
    }

    if (action.type === deleteFlatsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteFlatsFinish) {

        let newFlats = state.flats;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newFlats.length; k++) {
                if (newFlats[k].id === action.idSet[j]) {
                    newFlats.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            flats: newFlats,
            isLoading: false
        };
    }

    if (action.type === addFlatStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addFlatFinish) {
        let flats = state.flats;
        let newFlat = action.data;

        flats.push(newFlat);

        return {
            ...state,
            flats: flats,
            isLoading: false
        };
    }

    if (action.type === editFlatStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editFlatFinish) {

        let flats = state.flats;
        let newFlat = action.data;

        const fltIndex = flats.findIndex(u => u.id === newFlat.id);

        flats[fltIndex] = newFlat;

        return {
            ...state,
            flats: flats,
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

    if (action.type === getEditFlatStart) {
        return {
            ...state,
            editFlat: action.data
        };
    }

    if (action.type === clearEditFlat) {
        return {
            ...state,
            editFlat: {}
        };
    }

    if (action.type === deleteError) {
        return {
            ...state,
            isLoading: false,
            deleteError: true
        };
    }

    if (action.type === deleteErrorClose) {
        return {
            ...state,
            deleteError: false
        };
    }

    return state;
};
