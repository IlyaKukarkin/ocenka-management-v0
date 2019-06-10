const getContractsStart = 'GET_CONTRACTS_START';
const getContractsFinish = 'GET_CONTRACTS_FINISH';
const deleteContractStart = 'DELETE_CONTRACT_START';
const deleteContractFinish = 'DELETE_CONTRACT_FINISH';
const addContractStart = 'ADD_CONTRACT_START';
const addContractFinish = 'ADD_CONTRACT_FINISH';
const getEditContractStart = 'GET_EDIT_CONTRACT_START';
const getMoreContractStart = 'GET_MORE_CONTRACT_START';
const clearMoreContract = 'CLEAR_MORE_CONTRACT';
const getListsStart = 'GET_LISTS_START';
const getListsFinish = 'GET_LISTS_FINISH';
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
const initialState = {
    contracts: [], editContract: {}, moreContract: {}, isLoading: false, fileSaved: false, fileError: false, addIsLoading: false,
    indivList: [], entList: [], flatList: [], carList: [], parcelList: [], apprList: []
};

export const actionCreators = {
    GetContractsSet: () => async (dispatch) => {
        dispatch({ type: getContractsStart });

        const url = `api/ContractSets`;
        const response = await fetch(url);
        const contracts = await response.json();

        dispatch({ type: getContractsFinish, contracts });
    },
    GetListsSet: () => async (dispatch) => {
        dispatch({ type: getListsStart });

        let url = `api/IndividualSets`;
        let response = await fetch(url);
        const indivList = await response.json();

        url = `api/EntitySets`;
        response = await fetch(url);
        const entList = await response.json();

        url = `api/FlatSets`;
        response = await fetch(url);
        const flatList = await response.json();

        url = `api/CarSets`;
        response = await fetch(url);
        const carList = await response.json();

        url = `api/ParcelSets`;
        response = await fetch(url);
        const parcelList = await response.json();

        url = `api/AppraiserSets`;
        response = await fetch(url);
        const apprList = await response.json();

        dispatch({ type: getListsFinish, indivList, entList, flatList, carList, parcelList, apprList });
    },
    ClearEditContract: () => async (dispatch) => {
        dispatch({ type: clearEditContract });        
    },
    ClearMoreContract: () => async (dispatch) => {
        dispatch({ type: clearMoreContract });
    },
    DeleteContractSet: (id) => async (dispatch) => {
        dispatch({ type: deleteContractStart });

        const url = `api/ContractSets/${id}`;
        fetch(url, { method: 'delete' });

        //const url2 = `api/AppraiserContracts/${id}`;
        //fetch(url2, { method: 'delete' });

        dispatch({ type: deleteContractFinish, id });
    },
    DeleteContractsSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteContractsStart });

        idSet.forEach(async function (id) {
            const url = `api/ContractSets/${id}`;
            fetch(url, { method: 'delete' });

            //const url2 = `api/AppraiserContracts/${id}`;
            //fetch(url2, { method: 'delete' });
        });

        dispatch({ type: deleteContractsFinish, idSet });
    },
    AddContractSet: (data) => async (dispatch) => {
        dispatch({ type: addContractStart });

        let appraiserId = data.appraiserId, aprContr;

        let url = `api/ContractSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newContract) {
                aprContr = { contractId: newContract.id, appraiserId: appraiserId };
                fetch('api/AppraiserContracts', { method: 'post', body: JSON.stringify(aprContr), headers: myHeaders })
                    .then(function (response) {
                        return response.json();
                    }).then(function (newContract2) {
                        dispatch({ type: addContractFinish, data });
                    });
            });
    },
    GetEditContract: (data) => async (dispatch) => {
        dispatch({ type: getEditContractStart, data });
    },
    GetMoreContract: (data) => async (dispatch) => {
        dispatch({ type: getMoreContractStart, data });
    },
    EditContractSet: (data) => async (dispatch) => {
        dispatch({ type: editContractStart });

        let appraiserId = data.appraiserId, aprContr;

        let url = `api/ContractSets/${data.id}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'put', body: JSON.stringify(data), headers: myHeaders })
            .then(function (newContract) {
                aprContr = { contractId: data.id, appraiserId: appraiserId };
                fetch(`api/AppraiserContracts/${data.id}`, { method: 'put', body: JSON.stringify(aprContr), headers: myHeaders })
                    .then(function (newContract2) {
                        dispatch({ type: editContractFinish, data });
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

const fixData = (contract) => {
    let y1, m1, d1, y2, m2, d2;

    m1 = contract.startDate.substring(0, 2);
    d1 = contract.startDate.substring(3, 5);
    y1 = contract.startDate.substring(6, 10);

    m2 = contract.finishDate.substring(0, 2);
    d2 = contract.finishDate.substring(3, 5);
    y2 = contract.finishDate.substring(6, 10);

    contract.startDate = y1 + '.' + m1 + '.' + d1;
    contract.finishDate = y2 + '.' + m2 + '.' + d2;

    return contract;
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
    let resType = 'Indiv';

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
                        mark: oldContracts[i].object.objectSetCar.mark, model: oldContracts[i].object.objectSetCar.model, licenseNumber: oldContracts[i].object.objectSetCar.licenseNumber,
                        year: oldContracts[i].object.objectSetCar.year
                    };

                    contract['object'] = object;
                    break;
                case 'Parcel':
                    contract['objectType'] = 'Parcel';

                    object = {
                        id: oldContracts[i].object.id, cadastralNumber: oldContracts[i].object.cadastralNumber, aimOfEvaluation: oldContracts[i].object.aimOfEvaluation,
                        area: oldContracts[i].object.objectSetParcel.area, usageType: oldContracts[i].object.objectSetParcel.usageType
                    };

                    contract['object'] = object;
                    break;
                default:
                    contract['objectType'] = 'Flat';
                    break;
            }

            switch (getClientType(oldContracts[i].client)) {
                case 'Indiv':
                    contract['clientType'] = 'Indiv';

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
                        id: oldContracts[i].client.clientSetEntity.id,
                        companyName: oldContracts[i].client.clientSetEntity.companyName, bin: oldContracts[i].client.clientSetEntity.bin, inn: oldContracts[i].client.clientSetEntity.inn,
                        mailAddress: oldContracts[i].client.clientSetEntity.mailAddress, paymentAccount: oldContracts[i].client.clientSetEntity.paymentAccount,
                        city: oldContracts[i].client.clientSetEntity.legalAddress.city, district: oldContracts[i].client.clientSetEntity.legalAddress.district, street: oldContracts[i].client.clientSetEntity.legalAddress.street,
                        house: oldContracts[i].client.clientSetEntity.legalAddress.house, numberOfFlat: oldContracts[i].client.clientSetEntity.legalAddress.numberOfFlat, addressId: oldContracts[i].client.clientSetEntity.legalAddress.id
                    };

                    contract['client'] = client;
                    break;
                default:
                    contract['clientType'] = 'Indiv';
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

    if (action.type === getListsStart) {
        return {
            ...state,
            addIsLoading: true
        };
    }

    if (action.type === getListsFinish) {
        const indiv = action.indivList;
        const ent = action.entList;
        const flt = action.flatList;
        const car = action.carList;
        const prcl = action.parcelList;
        const appr = action.apprList;
        let newIndiv = [];
        let newEnt = [];
        let newFlt = [];
        let newCar = [];
        let newPrcl = [];
        let newAppr = [];
        let listEntry = {};

        for (let i = 0; i < indiv.length; i++) {

            listEntry = { value: indiv[i].id, label: indiv[i].surname + ' ' + indiv[i].name + ' ' + indiv[i].patronymic };

            newIndiv.push(listEntry);
        }

        for (let i = 0; i < ent.length; i++) {

            listEntry = { value: ent[i].id, label: ent[i].companyName };

            newEnt.push(listEntry);
        }

        for (let i = 0; i < flt.length; i++) {

            listEntry = { value: flt[i].id, label: flt[i].address.street + ', ' + flt[i].address.house };

            newFlt.push(listEntry);
        }

        for (let i = 0; i < car.length; i++) {

            listEntry = { value: car[i].id, label: car[i].mark + ' ' + car[i].model + ' (' + car[i].licenseNumber + ')' };

            newCar.push(listEntry);
        }

        for (let i = 0; i < prcl.length; i++) {

            listEntry = { value: prcl[i].id, label: prcl[i].area + ' ' + prcl[i].usageType };

            newPrcl.push(listEntry);
        }

        for (let i = 0; i < appr.length; i++) {

            listEntry = { value: appr[i].id, label: appr[i].idNavigation.surname + ' ' + appr[i].idNavigation.name + ' ' + appr[i].idNavigation.patronymic };

            newAppr.push(listEntry);
        }

        return {
            ...state,
            indivList: newIndiv,
            entList: newEnt,
            flatList: newFlt,
            carList: newCar,
            parcelList: newPrcl,
            apprList: newAppr,
            addIsLoading: false
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

        return {
            ...state
        };
    }

    if (action.type === editContractStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editContractFinish) {

        return {
            ...state
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

    if (action.type === getMoreContractStart) {
        return {
            ...state,
            moreContract: action.data
        };
    }

    if (action.type === clearEditContract) {
        return {
            ...state,
            editContract: {}
        };
    }

    if (action.type === clearEditContract) {
        return {
            ...state,
            moreContract: {}
        };
    }

    return state;
};
