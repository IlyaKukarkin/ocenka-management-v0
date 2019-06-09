const getClientsStart = 'GET_CLIENTS_START';
const getClientsFinish = 'GET_CLIENTS_FINISH';
const deleteClientStart = 'DELETE_CLIENT_START';
const deleteClientFinish = 'DELETE_CLIENT_FINISH';
const addClientStart = 'ADD_CLIENT_START';
const addClientFinish = 'ADD_CLIENT_FINISH';
const getEditClientStart = 'GET_EDIT_CLIENT_START';
const getEditClientFinish = 'GET_EDIT_CLIENT_FINISH';
const editClientStart = 'EDIT_CLIENT_START';
const editClientFinish = 'EDIT_CLIENT_FINISH';
const deleteClientsStart = 'DELETE_CLIENTS_START';
const deleteClientsFinish = 'DELETE_CLIENTS_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const deleteError = 'DELETE_CLIENT_ERROR';
const deleteErrorClose = 'DELETE_ERROR_CLOSE';
const clearEditClient = 'CLEAR_EDIT_CLIENT';
const initialState = { clients: [], editClient: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetClientsSet: () => async (dispatch) => {
        dispatch({ type: getClientsStart });

        const url = `api/IndividualSets`;
        const response = await fetch(url);
        const clients = await response.json();

        dispatch({ type: getClientsFinish, clients });
    },
    ClearEditClient: () => async (dispatch) => {
        dispatch({ type: clearEditClient });        
    },
    DeleteClientSet: (id) => async (dispatch) => {
        dispatch({ type: deleteClientStart });

        const url2 = `api/ClientSets/${id}`;
        fetch(url2, { method: 'delete' });

        fetch(url2, { method: 'delete' })
            .then(function (response) {
                if (response.status === 500) {
                    dispatch({ type: deleteError });
                } else {
                    dispatch({ type: deleteClientFinish, id });
                }
            });
    },
    DeleteClientsSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteClientsStart });

        idSet.forEach(async function (id) {
            const url2 = `api/ClientSets/${id}`;
            fetch(url2, { method: 'delete' })
                .then(function (response) {
                    if (response.status === 500) {
                        dispatch({ type: deleteError });
                    } else {
                        dispatch({ type: deleteClientFinish, id });
                    }
                });
        });
    },
    AddClientSet: (data) => async (dispatch) => {
        dispatch({ type: addClientStart });

        let clientId, addressId;

        let url = `api/ClientSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newClient) {
                clientId = newClient.id;
                url = `api/AddressSets`;
                fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        return response.json();
                    }).then(function (newAddress) {
                        addressId = newAddress.id;
                        data['id'] = clientId;
                        data['AddressOfResidenceId'] = addressId;
                        fetch('api/IndividualSets', { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                            .then(function (response) {
                                return response.json();
                            }).then(function (newClient2) {
                                dispatch({ type: addClientFinish, data });
                            });
                    });
            });
    },
    GetEditClient: (data) => async (dispatch) => {
        dispatch({ type: getEditClientStart, data });
    },
    EditClientSet: (data) => async (dispatch) => {
        dispatch({ type: editClientStart });

        let address = {
            id: data.addressId, city: data.city, district: data.district, street: data.street, house: data.house, numberOfFlat: data.numberOfFlat
        };
        let client = {
            id: data.id,
            surname: data.surname, name: data.name, patronymic: data.patronymic, series: data.series, number: data.number, dateOfBirth: data.dateOfBirth,
            dateOfIssue: data.dateOfIssue, divisionCode: data.divisionCode, issuedBy: data.issuedBy, addressOfResidenceId: data.addressId
        };

        let url = `api/AddressSets/${data.addressId}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(url, { method: 'put', body: JSON.stringify(address), headers: myHeaders })
            .then(function () {
                fetch(`api/IndividualSets/${data.id}`, { method: 'put', body: JSON.stringify(client), headers: myHeaders })
                    .then(function (newClient2) {
                        dispatch({ type: editClientFinish, data });
                    });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/IndividualSets/ToExcel`;
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

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getClientsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getClientsFinish) {
        let oldClients = action.clients;
        let newClients = [];

        for (let i = 0; i < oldClients.length; i++) {
            newClients.push({
                id: oldClients[i].id, surname: oldClients[i].surname, name: oldClients[i].name, patronymic: oldClients[i].patronymic, dateOfBirth: oldClients[i].dateOfBirth,
                dateOfIssue: oldClients[i].dateOfIssue, divisionCode: oldClients[i].divisionCode, issuedBy: oldClients[i].issuedBy, series: oldClients[i].series, number: oldClients[i].number,
                city: oldClients[i].addressOfResidence.city, district: oldClients[i].addressOfResidence.district, street: oldClients[i].addressOfResidence.street,
                house: oldClients[i].addressOfResidence.house, numberOfFlat: oldClients[i].addressOfResidence.numberOfFlat, addressId: oldClients[i].addressOfResidence.id
            });
        }

        return {
            ...state,
            clients: newClients,
            isLoading: false
        };
    }

    if (action.type === deleteClientStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteClientFinish) {

        let newClients = state.clients;

        for (var i = 0; i < newClients.length; i++) {
            if (newClients[i].id === action.id) {
                newClients.splice(i, 1);
            }
        }

        return {
            ...state,
            clients: newClients,
            isLoading: false
        };
    }

    if (action.type === deleteClientsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteClientsFinish) {

        let newСlients = state.clients;

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
            clients: newСlients,
            isLoading: false
        };
    }

    if (action.type === addClientStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addClientFinish) {
        let clients = state.clients;
        let newClient = action.data;

        newClient = fixData(newClient);

        clients.push(newClient);

        return {
            ...state,
            clients: clients,
            isLoading: false
        };
    }

    if (action.type === editClientStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editClientFinish) {

        let clients = state.clients;
        let newClient = action.data;

        newClient = fixData(newClient);

        const clntIndex = clients.findIndex(u => u.id === newClient.id);

        clients[clntIndex] = newClient;

        return {
            ...state,
            clients: clients,
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

    if (action.type === getEditClientStart) {
        return {
            ...state,
            editClient: action.data
        };
    }

    if (action.type === clearEditClient) {
        return {
            ...state,
            editClient: {}
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
