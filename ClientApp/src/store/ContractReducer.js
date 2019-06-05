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
            newContracts.push({
                id: oldContracts[i].id, area: oldContracts[i].area, numberOfRooms: oldContracts[i].numberOfRooms, floor: oldContracts[i].floor,
                cadastralNumber: oldContracts[i].idNavigation.cadastralNumber, aimOfEvaluation: oldContracts[i].idNavigation.aimOfEvaluation,
                city: oldContracts[i].address.city, district: oldContracts[i].address.district, street: oldContracts[i].address.street,
                house: oldContracts[i].address.house, numberOfContract: oldContracts[i].address.numberOfContract, addressId: oldContracts[i].address.id
            });
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
