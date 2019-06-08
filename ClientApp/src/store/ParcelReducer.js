const getParcelsStart = 'GET_PARCELS_START';
const getParcelsFinish = 'GET_PARCELS_FINISH';
const deleteParcelStart = 'DELETE_PARCEL_START';
const deleteParcelFinish = 'DELETE_PARCEL_FINISH';
const addParcelStart = 'ADD_PARCEL_START';
const addParcelFinish = 'ADD_PARCEL_FINISH';
const getEditParcelStart = 'GET_EDIT_PARCEL_START';
const getEditParcelFinish = 'GET_EDIT_PARCEL_FINISH';
const editParcelStart = 'EDIT_PARCEL_START';
const editParcelFinish = 'EDIT_PARCEL_FINISH';
const deleteParcelsStart = 'DELETE_PARCELS_START';
const deleteParcelsFinish = 'DELETE_PARCELS_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const deleteError = 'DELETE_ERROR';
const deleteErrorClose = 'DELETE_ERROR_CLOSE';
const clearEditParcel = 'CLEAR_EDIT_PARCEL';
const initialState = { parcels: [], editParcel: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetParcelsSet: () => async (dispatch) => {
        dispatch({ type: getParcelsStart });

        const url = `api/ParcelSets`;
        const response = await fetch(url);
        const parcels = await response.json();

        dispatch({ type: getParcelsFinish, parcels });
    },
    ClearEditParcel: () => async (dispatch) => {
        dispatch({ type: clearEditParcel });        
    },
    DeleteParcelSet: (id) => async (dispatch) => {
        dispatch({ type: deleteParcelStart });

        const url2 = `api/ObjectSets/${id}`;
        fetch(url2, { method: 'delete' })
            .then(function (response) {
                if (response.status === 500) {
                    dispatch({ type: deleteError });
                } else {
                    dispatch({ type: deleteParcelFinish, id });
                }
            });
    },
    DeleteParcelsSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteParcelsStart });

        idSet.forEach(async function (id) {
            const url2 = `api/ObjectSets/${id}`;
            fetch(url2, { method: 'delete' })
                .then(function (response) {
                    if (response.status === 500) {
                        dispatch({ type: deleteError });
                    } else {
                        dispatch({ type: deleteParcelFinish, id });
                    }
                });
        });
    },
    AddParcelSet: (data) => async (dispatch) => {
        dispatch({ type: addParcelStart });

        let url = `api/ObjectSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newObject) {              
                data['id'] = newObject.id;
                fetch('api/ParcelSets', { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        return response.json();
                    }).then(function (newClient2) {
                        dispatch({ type: addParcelFinish, data });
                    });
            });
    },
    GetEditParcel: (data) => async (dispatch) => {
        dispatch({ type: getEditParcelStart, data });
    },
    EditParcelSet: (data) => async (dispatch) => {
        dispatch({ type: editParcelStart });

        let parcel = {
            id: data.id,
            area: data.area, usageType: data.usageType
        };
        let object = {
            id: data.id,
            cadastralNumber: data.cadastralNumber, aimOfEvaluation: data.aimOfEvaluation
        };

        let url = `api/AddressSets/${data.addressId}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`api/ObjectSets/${data.id}`, { method: 'put', body: JSON.stringify(object), headers: myHeaders })
            .then(function () {
                fetch(`api/ParcelSets/${data.id}`, { method: 'put', body: JSON.stringify(parcel), headers: myHeaders })
                    .then(function () {
                        dispatch({ type: editParcelFinish, data });
                    });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/ParcelSets/ToExcel`;
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

    if (action.type === getParcelsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getParcelsFinish) {
        let oldParcels = action.parcels;
        let newParcels = [];

        for (let i = 0; i < oldParcels.length; i++) {
            newParcels.push({
                id: oldParcels[i].id, area: oldParcels[i].area, usageType: oldParcels[i].usageType,
                cadastralNumber: oldParcels[i].idNavigation.cadastralNumber, aimOfEvaluation: oldParcels[i].idNavigation.aimOfEvaluation
            });
        }

        return {
            ...state,
            parcels: newParcels,
            isLoading: false
        };
    }

    if (action.type === deleteParcelStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteParcelFinish) {

        let newParcelss = state.parcels;

        for (var i = 0; i < newParcelss.length; i++) {
            if (newParcelss[i].id === action.id) {
                newParcelss.splice(i, 1);
            }
        }

        return {
            ...state,
            parcels: newParcelss,
            isLoading: false
        };
    }

    if (action.type === deleteParcelsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteParcelsFinish) {

        let newParcels = state.parcels;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newParcels.length; k++) {
                if (newParcels[k].id === action.idSet[j]) {
                    newParcels.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            parcels: newParcels,
            isLoading: false
        };
    }

    if (action.type === addParcelStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addParcelFinish) {
        let parcels = state.parcels;
        let newParcel = action.data;

        parcels.push(newParcel);

        return {
            ...state,
            parcels: parcels,
            isLoading: false
        };
    }

    if (action.type === editParcelStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editParcelFinish) {

        let parcels = state.parcels;
        let newParcel = action.data;

        const prcIndex = parcels.findIndex(u => u.id === newParcel.id);

        parcels[prcIndex] = newParcel;

        return {
            ...state,
            parcels: parcels,
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

    if (action.type === getEditParcelStart) {
        return {
            ...state,
            editParcel: action.data
        };
    }

    if (action.type === clearEditParcel) {
        return {
            ...state,
            editParcel: {}
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
