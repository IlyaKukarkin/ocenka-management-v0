const getEntitiesStart = 'GET_ENTITIES_START';
const getEntitiesFinish = 'GET_ENTITIES_FINISH';
const deleteEntityStart = 'DELETE_ENTITY_START';
const deleteEntityFinish = 'DELETE_ENTITY_FINISH';
const addEntityStart = 'ADD_ENTITY_START';
const addEntityFinish = 'ADD_ENTITY_FINISH';
const getEditEntityStart = 'GET_EDIT_ENTITY_START';
const getEditEntityFinish = 'GET_EDIT_ENTITY_FINISH';
const editEntityStart = 'EDIT_ENTITY_START';
const editEntityFinish = 'EDIT_ENTITY_FINISH';
const deleteEntitiesStart = 'DELETE_ENTITIES_START';
const deleteEntitiesFinish = 'DELETE_ENTITIES_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const deleteError = 'DELETE_ENTITY_ERROR';
const deleteErrorClose = 'DELETE_ENTITY_ERROR_CLOSE';
const clearEditEntity = 'CLEAR_EDIT_ENTITY';
const initialState = { entities: [], editEntity: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetEntitiesSet: () => async (dispatch) => {
        dispatch({ type: getEntitiesStart });

        const url = `api/EntitySets`;
        const response = await fetch(url);
        const entities = await response.json();

        dispatch({ type: getEntitiesFinish, entities });
    },
    ClearEditEntity: () => async (dispatch) => {
        dispatch({ type: clearEditEntity });        
    },
    DeleteEntitySet: (id) => async (dispatch) => {
        dispatch({ type: deleteEntityStart });

        const url2 = `api/ClientSets/${id}`;

        fetch(url2, { method: 'delete' })
            .then(function (response) {
                if (response.status === 500) {
                    dispatch({ type: deleteError });
                } else {
                    dispatch({ type: deleteEntityFinish, id });
                }
            });
    },
    DeleteEntitiesSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteEntitiesStart });

        idSet.forEach(async function (id) {
            const url2 = `api/ClientSets/${id}`;
            fetch(url2, { method: 'delete' })
                .then(function (response) {
                    if (response.status === 500) {
                        dispatch({ type: deleteError });
                    } else {
                        dispatch({ type: deleteEntityFinish, id });
                    }
                });
        });
    },
    AddEntitySet: (data) => async (dispatch) => {
        dispatch({ type: addEntityStart });

        let clientId, addressId;

        let url = `api/ClientSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newEntity) {
                clientId = newEntity.id;
                url = `api/AddressSets`;
                fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        return response.json();
                    }).then(function (newAddress) {
                        addressId = newAddress.id;
                        data['id'] = clientId;
                        data['LegalAddressId'] = addressId;
                        fetch('api/EntitySets', { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                            .then(function (response) {
                                return response.json();
                            }).then(function (newEntity2) {
                                dispatch({ type: addEntityFinish, data });
                            });
                    });
            });
    },
    GetEditEntity: (data) => async (dispatch) => {
        dispatch({ type: getEditEntityStart, data });
    },
    EditEntitySet: (data) => async (dispatch) => {
        dispatch({ type: editEntityStart });

        let address = {
            id: data.legalAddressId, city: data.city, district: data.district, street: data.street, house: data.house, numberOfFlat: data.numberOfFlat
        };
       
        let client = {
            id: data.id,
            companyName: data.companyName, bin: data.bin, inn: data.inn, mailAddress: data.mailAddress, paymentAccount: data.paymentAccount, legalAddressId: data.legalAddressId
        };

        let url = `api/AddressSets/${data.legalAddressId}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(url, { method: 'put', body: JSON.stringify(address), headers: myHeaders })
            .then(function () {
                fetch(`api/EntitySets/${data.id}`, { method: 'put', body: JSON.stringify(client), headers: myHeaders })
                    .then(function (newEntity2) {
                        dispatch({ type: editEntityFinish, data });
                    });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/EntitySets/ToExcel`;
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

    if (action.type === getEntitiesStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getEntitiesFinish) {
        let oldEntities = action.entities;
        let newEntities = [];

        for (let i = 0; i < oldEntities.length; i++) {
            newEntities.push({
                id: oldEntities[i].id, companyName: oldEntities[i].companyName, bin: oldEntities[i].bin, inn: oldEntities[i].inn, mailAddress: oldEntities[i].mailAddress,
                paymentAccount: oldEntities[i].paymentAccount, legalAddressId: oldEntities[i].legalAddress.id,
                city: oldEntities[i].legalAddress.city, district: oldEntities[i].legalAddress.district, street: oldEntities[i].legalAddress.street,
                house: oldEntities[i].legalAddress.house, numberOfFlat: oldEntities[i].legalAddress.numberOfFlat
            });
        }

        return {
            ...state,
            entities: newEntities,
            isLoading: false
        };
    }

    if (action.type === deleteEntityStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteEntityFinish) {

        let newEntities = state.entities;

        for (var i = 0; i < newEntities.length; i++) {
            if (newEntities[i].id === action.id) {
                newEntities.splice(i, 1);
            }
        }

        return {
            ...state,
            entities: newEntities,
            isLoading: false
        };
    }

    if (action.type === deleteEntitiesStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteEntitiesFinish) {

        let newСlients = state.entities;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newСlients.length; k++) {
                if (newСlients[k].id === action.idSet[j]) {
                    newСlients.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            entities: newСlients,
            isLoading: false
        };
    }

    if (action.type === addEntityStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addEntityFinish) {
        let entities = state.entities;
        let newEntity = action.data;

        entities.push(newEntity);

        return {
            ...state,
            entities: entities,
            isLoading: false
        };
    }

    if (action.type === editEntityStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editEntityFinish) {

        let entities = state.entities;
        let newEntity = action.data;

        const clntIndex = entities.findIndex(u => u.id === newEntity.id);

        entities[clntIndex] = newEntity;

        return {
            ...state,
            entities: entities,
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

    if (action.type === getEditEntityStart) {
        return {
            ...state,
            editEntity: action.data
        };
    }

    if (action.type === clearEditEntity) {
        return {
            ...state,
            editEntity: {}
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
