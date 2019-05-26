const getAppraisersStart = 'GET_APPRAISERS_START';
const getAppraisersFinish = 'GET_APPRAISERS_FINISH';
const deleteAppraiserStart = 'DELETE_APPRAISER_START';
const deleteAppraiserFinish = 'DELETE_APPRAISER_FINISH';
const addAppraiserStart = 'ADD_APPRAISER_START';
const addAppraiserFinish = 'ADD_APPRAISER_FINISH';
const deleteAppraisersStart = 'DELETE_APPRAISERS_START';
const deleteAppraisersFinish = 'DELETE_APPRAISERS_FINISH';
const initialState = { appraisers: [], isLoading: false };

export const actionCreators = {
    GetAppraisersSet: () => async (dispatch) => {
        dispatch({ type: getAppraisersStart });

        const url = `api/AppraiserSets`;
        const response = await fetch(url);
        const appraisers = await response.json();

        dispatch({ type: getAppraisersFinish, appraisers });
    },
    DeleteAppraiserSet: (id) => async (dispatch) => {
        dispatch({ type: deleteAppraiserStart });

        const url = `api/AppraiserSets/${id}`;
        const response = await fetch(url, { method: 'delete' });

        dispatch({ type: deleteAppraiserFinish, id });
    },
    DeleteAppraisersSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteAppraisersStart });

        idSet.forEach(async function (id) {
            const url = `api/AppraiserSets/${id}`;
            const response = await fetch(url, { method: 'delete' });
        });

        dispatch({ type: deleteAppraisersFinish, idSet });
    },
    AddAppraiserSet: (data) => async (dispatch) => {
        dispatch({ type: addAppraiserStart });

        const url = `api/AppraiserSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newAddress) {
                dispatch({ type: addAppraiserFinish, newAddress });
            });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getAppraisersStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getAppraisersFinish) {
        let oldAppraisers = action.appraisers;
        let newAppraisers = [];

        for (let i = 0; i < oldAppraisers.length; i++) {
            newAppraisers.push({ id: oldAppraisers[i].id, surname: oldAppraisers[i].idNavigation.surname, name: oldAppraisers[i].idNavigation.name, patronymic: oldAppraisers[i].idNavigation.patronymic, birthday: oldAppraisers[i].idNavigation.birthday, worksSince: oldAppraisers[i].idNavigation.worksSince, position: oldAppraisers[i].position });
        }

        return {
            ...state,
            appraisers: newAppraisers,
            isLoading: false
        };
    }

    if (action.type === deleteAppraiserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteAppraiserFinish) {

        let newAddresses = state.addresses;

        for (var i = 0; i < newAddresses.length; i++) {
            if (newAddresses[i].id === action.id) {
                newAddresses.splice(i, 1);
            }
        }

        return {
            ...state,
            appraisers: newAddresses,
            isLoading: false
        };
    }

    if (action.type === deleteAppraiserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteAppraiserFinish) {

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
            appraisers: newAddresses,
            isLoading: false
        };
    }

    if (action.type === addAppraiserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addAppraiserFinish) {

        let addresses = state.addresses;

        const newAddress = action.newAddress;

        addresses.push(newAddress);

        return {
            ...state,
            addresses: addresses,
            isLoading: false
        };
    }

    return state;
};
