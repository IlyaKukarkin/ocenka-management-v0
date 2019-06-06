const getContractsStart = 'GET_CONTRACTS_START';
const getContractsFinish = 'GET_CONTRACTS_FINISH';
const deleteContractStart = 'DELETE_CONTRACT_START';
const deleteContractFinish = 'DELETE_CONTRACT_FINISH';
const addContractStart = 'ADD_CONTRACT_START';
const addContractFinish = 'ADD_CONTRACT_FINISH';
const getEditContractStart = 'GET_EDIT_CONTRACT_START';
const getEditContractFinish = 'GET_EDIT_CONTRACT_FINISH';
const editContractStart = 'EDIT_CONTRACT_START';
const editContractFinish = 'EDIT_CONTRACT_FINISH';
const deleteContractsStart = 'DELETE_CONTRACTS_START';
const deleteContractsFinish = 'DELETE_CONTRACTS_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const clearEditContract = 'CLEAR_EDIT_CONTRACT';
const initialState = {    contracts: [], editContract: {}, isLoading: false, fileSaved: false, fileError: false };

export const actionCreators = {
    GetContractsSet: () => async (dispatch) => {
        dispatch({ type: getContractsStart });

        const url = `api/ContractSets`;
        const response = await fetch(url);
        const contracts = await response.json();

        dispatch({ type: getContractsFinish, contracts });
    },
    ClearEditContract: () => async (dispatch) => {
        dispatch({ type: clearEditContract });        
    },
    DeleteContractSet: (id) => async (dispatch) => {
        dispatch({ type: deleteContractStart });

        const url = `api/ContractSets/${id}`;
        fetch(url, { method: 'delete' });

        const url2 = `api/ObjectSets/${id}`;
        fetch(url2, { method: 'delete' });

        dispatch({ type: deleteContractFinish, id });
    },
    DeleteContractsSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteContractsStart });

        idSet.forEach(async function (id) {
            const url = `api/ContractSets/${id}`;
            fetch(url, { method: 'delete' });

            const url2 = `api/ObjectSets/${id}`;
            fetch(url2, { method: 'delete' });
        });

        dispatch({ type: deleteContractsFinish, idSet });
    },
    AddContractSet: (data) => async (dispatch) => {
        dispatch({ type: addContractStart });

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
                        fetch('api/ContractSets', { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                            .then(function (response) {
                                return response.json();
                            }).then(function (newClient2) {
                                dispatch({ type: addContractFinish, data });
                            });
                    });
            });
    },
    GetEditContract: (data) => async (dispatch) => {
        dispatch({ type: getEditContractStart, data });
    },
    EditContractSet: (data) => async (dispatch) => {
        dispatch({ type: editContractStart });

        let address = {
            id: data.addressId, city: data.city, district: data.district, street: data.street, house: data.house, numberOfContract: data.numberOfContract
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
                        fetch(`api/ContractSets/${data.id}`, { method: 'put', body: JSON.stringify(flat), headers: myHeaders })
                            .then(function () {
                                dispatch({ type: editContractFinish, data });
                            });
                    });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/ContractSets/ToExcel`;
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
    }
};

const fixData = (client) => {
    let y1, m1, d1, y2, m2, d2;

    m1 = client.dateOfIssue.substring(0, 2);
    d1 = client.dateOfIssue.substring(3, 5);
    y1 = client.dateOfIssue.substring(6, 10);

    m2 = client.dateOfBirth.substring(0, 2);
    d2 = client.dateOfBirth.substring(3, 5);
    y2 = client.dateOfBirth.substring(6, 10);

    client.dateOfIssue = y1 + '.' + m1 + '.' + d1;
    client.dateOfBirth = y2 + '.' + m2 + '.' + d2;

    return client;
};

const getObjectType = (object) => {
    let resType = 'Flat';

    if (object.objectSetCar !== null) {
        resType = 'Car';
        return resType;
    }

    if (object.objectSetFlat !== null) {
        resType = 'Flat';
        return resType;
    }

    if (object.objectSetParcel !== null) {
        resType = 'Parcel';
        return resType;
    }

    return resType;
};

const getClientType = (client) => {
    let resType = 'Indv';

    if (client.clientSetIndividual !== null) {
        return resType;
    }

    if (client.clientSetEntity !== null) {
        resType = 'Ent';
        return resType;
    }

    return resType;
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getContractsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getContractsFinish) {
        let oldContracts = action.contracts;
        let newContracts = [];

        for (let i = 0; i < oldContracts.length; i++) {

            let contract, object, client, appraiser;

            contract = {
                id: oldContracts[i].id, contractSumm: oldContracts[i].contractSumm, prepaid: oldContracts[i].prepaid, startDate: oldContracts[i].startDate, finishDate: oldContracts[i].finishDate,
                clientId: oldContracts[i].clientId, objectId: oldContracts[i].objectId, appraiserId: oldContracts[i].appraiserContract[0].appraiserId
            };

            switch (getObjectType(oldContracts[i].object)) {
                case 'Flat':
                    contract['objectType'] = 'Flat';

                    object = {
                        id: oldContracts[i].object.id, cadastralNumber: oldContracts[i].object.cadastralNumber, aimOfEvaluation: oldContracts[i].object.aimOfEvaluation,
                        area: oldContracts[i].object.objectSetFlat.area, numberOfRooms: oldContracts[i].object.objectSetFlat.numberOfRooms, floor: oldContracts[i].object.objectSetFlat.floor,
                        city: oldContracts[i].object.objectSetFlat.address.city, district: oldContracts[i].object.objectSetFlat.address.district, street: oldContracts[i].object.objectSetFlat.address.street,
                        house: oldContracts[i].object.objectSetFlat.address.house, numberOfFlat: oldContracts[i].object.objectSetFlat.address.numberOfFlat, addressId: oldContracts[i].object.objectSetFlat.address.id
                    };

                    contract['object'] = object;
                    break;
                case 'Car':
                    contract['objectType'] = 'Car';

                    object = {
                        id: oldContracts[i].object.id, cadastralNumber: oldContracts[i].object.cadastralNumber, aimOfEvaluation: oldContracts[i].object.aimOfEvaluation,
                        area: oldContracts[i].object.objectSetFlat.area, numberOfRooms: oldContracts[i].object.objectSetFlat.numberOfRooms, floor: oldContracts[i].object.objectSetFlat.floor,
                        city: oldContracts[i].object.objectSetFlat.address.city, district: oldContracts[i].object.objectSetFlat.address.district, street: oldContracts[i].object.objectSetFlat.address.street,
                        house: oldContracts[i].object.objectSetFlat.address.house, numberOfFlat: oldContracts[i].object.objectSetFlat.address.numberOfFlat, addressId: oldContracts[i].object.objectSetFlat.address.id
                    };

                    contract['object'] = object;
                    break;
                case 'Parcel':
                    contract['objectType'] = 'Parcel';

                    object = {
                        id: oldContracts[i].object.id, cadastralNumber: oldContracts[i].object.cadastralNumber, aimOfEvaluation: oldContracts[i].object.aimOfEvaluation,
                        area: oldContracts[i].object.objectSetFlat.area, numberOfRooms: oldContracts[i].object.objectSetFlat.numberOfRooms, floor: oldContracts[i].object.objectSetFlat.floor,
                        city: oldContracts[i].object.objectSetFlat.address.city, district: oldContracts[i].object.objectSetFlat.address.district, street: oldContracts[i].object.objectSetFlat.address.street,
                        house: oldContracts[i].object.objectSetFlat.address.house, numberOfFlat: oldContracts[i].object.objectSetFlat.address.numberOfFlat, addressId: oldContracts[i].object.objectSetFlat.address.id
                    };

                    contract['object'] = object;
                    break;
                default:
                    contract['objectType'] = 'Flat';
                    break;
            }

            switch (getClientType(oldContracts[i].client)) {
                case 'Indv':
                    contract['clientType'] = 'Indv';

                    client = {
                        id: oldContracts[i].client.clientSetIndividual.id,
                        surname: oldContracts[i].client.clientSetIndividual.surname, name: oldContracts[i].client.clientSetIndividual.name, patronymic: oldContracts[i].client.clientSetIndividual.patronymic, dateOfBirth: oldContracts[i].client.clientSetIndividual.dateOfBirth,
                        dateOfIssue: oldContracts[i].client.clientSetIndividual.dateOfIssue, divisionCode: oldContracts[i].client.clientSetIndividual.divisionCode, issuedBy: oldContracts[i].client.clientSetIndividual.issuedBy, series: oldContracts[i].client.clientSetIndividual.series, number: oldContracts[i].client.clientSetIndividual.number,
                        city: oldContracts[i].client.clientSetIndividual.addressOfResidence.city, district: oldContracts[i].client.clientSetIndividual.addressOfResidence.district, street: oldContracts[i].client.clientSetIndividual.addressOfResidence.street,
                        house: oldContracts[i].client.clientSetIndividual.addressOfResidence.house, numberOfFlat: oldContracts[i].client.clientSetIndividual.addressOfResidence.numberOfFlat, addressId: oldContracts[i].client.clientSetIndividual.addressOfResidence.id
                    };

                    contract['client'] = client;
                    break;
                case 'Ent':
                    contract['clientType'] = 'Ent';

                    client = {
                        id: oldContracts[i].client.clientSetIndividual.id,
                        surname: oldContracts[i].client.clientSetIndividual.surname, name: oldContracts[i].client.clientSetIndividual.name, patronymic: oldContracts[i].client.clientSetIndividual.patronymic, dateOfBirth: oldContracts[i].client.clientSetIndividual.dateOfBirth,
                        dateOfIssue: oldContracts[i].client.clientSetIndividual.dateOfIssue, divisionCode: oldContracts[i].client.clientSetIndividual.divisionCode, issuedBy: oldContracts[i].client.clientSetIndividual.issuedBy, series: oldContracts[i].client.clientSetIndividual.series, number: oldContracts[i].client.clientSetIndividual.number,
                        city: oldContracts[i].client.clientSetIndividual.addressOfResidence.city, district: oldContracts[i].client.clientSetIndividual.addressOfResidence.district, street: oldContracts[i].client.clientSetIndividual.addressOfResidence.street,
                        house: oldContracts[i].client.clientSetIndividual.addressOfResidence.house, numberOfFlat: oldContracts[i].client.clientSetIndividual.addressOfResidence.numberOfFlat, addressId: oldContracts[i].client.clientSetIndividual.addressOfResidence.id
                    };

                    contract['client'] = client;
                    break;
                default:
                    contract['clientType'] = 'Indv';
                    break;
            }            

            appraiser = {
                id: oldContracts[i].appraiserContract[0].appraiser.id, surname: oldContracts[i].appraiserContract[0].appraiser.idNavigation.surname, name: oldContracts[i].appraiserContract[0].appraiser.idNavigation.name, patronymic: oldContracts[i].appraiserContract[0].appraiser.idNavigation.patronymic,
                birthday: oldContracts[i].appraiserContract[0].appraiser.idNavigation.birthday, worksSince: oldContracts[i].appraiserContract[0].appraiser.idNavigation.worksSince, position: oldContracts[i].appraiserContract[0].appraiser.position
            };

            contract['appraiser'] = appraiser;

            newContracts.push(contract);
        }

        return {
            ...state,
            contracts: newContracts,
            isLoading: false
        };
    }

    if (action.type === deleteContractStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteContractFinish) {

        let newClients = state.contracts;

        for (var i = 0; i < newClients.length; i++) {
            if (newClients[i].id === action.id) {
                newClients.splice(i, 1);
            }
        }

        return {
            ...state,
            contracts: newClients,
            isLoading: false
        };
    }

    if (action.type === deleteContractsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteContractsFinish) {

        let newContracts = state.contracts;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newContracts.length; k++) {
                if (newContracts[k].id === action.idSet[j]) {
                    newContracts.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            contracts: newContracts,
            isLoading: false
        };
    }

    if (action.type === addContractStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addContractFinish) {
        let contracts = state.contracts;
        let newContract = action.data;

        contracts.push(newContract);

        return {
            ...state,
            contracts: contracts,
            isLoading: false
        };
    }

    if (action.type === editContractStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editContractFinish) {

        let contracts = state.contracts;
        let newContract = action.data;

        const fltIndex = contracts.findIndex(u => u.id === newContract.id);

        contracts[fltIndex] = newContract;

        return {
            ...state,
            contracts: contracts,
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

    if (action.type === getEditContractStart) {
        return {
            ...state,
            editContract: action.data
        };
    }

    if (action.type === clearEditContract) {
        return {
            ...state,
            editContract: {}
        };
    }

    return state;
};
