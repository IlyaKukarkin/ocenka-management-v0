const getUsersStart = 'GET_USERS_START';
const getUsersFinish = 'GET_USERS_FINISH';
const deleteUserStart = 'DELETE_USER_START';
const deleteUserFinish = 'DELETE_USER_FINISH';
const addUserStart = 'ADD_USER_START';
const addUserFinish = 'ADD_USER_FINISH';
const deleteUsersStart = 'DELETE_USERS_START';
const deleteUsersFinish = 'DELETE_USERS_FINISH';
const initialState = { users: [], isLoading: false };

export const actionCreators = {
    GetUsersSet: () => async (dispatch) => {
        dispatch({ type: getUsersStart });

        const url = `api/UserSets`;
        const response = await fetch(url);
        const users = await response.json();

        dispatch({ type: getUsersFinish, users });
    },
    DeleteAppraiserSet: (id) => async (dispatch) => {
        dispatch({ type: deleteUserStart });

        const url = `api/AppraiserSets/${id}`;
        const response = await fetch(url, { method: 'delete' });

        dispatch({ type: deleteUserFinish, id });
    },
    DeleteAppraisersSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteUsersStart });

        idSet.forEach(async function (id) {
            const url = `api/AppraiserSets/${id}`;
            const response = await fetch(url, { method: 'delete' });
        });

        dispatch({ type: deleteUsersFinish, idSet });
    },
    AddAppraiserSet: (data) => async (dispatch) => {
        dispatch({ type: addUserStart });

        const url = `api/AppraiserSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newAddress) {
                dispatch({ type: addUserFinish, newAddress });
            });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getUsersStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getUsersFinish) {
        return {
            ...state,
            users: action.users,
            isLoading: false
        };
    }

    if (action.type === deleteUserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteUserFinish) {

        let newAddresses = state.addresses;

        for (var i = 0; i < newAddresses.length; i++) {
            if (newAddresses[i].id === action.id) {
                newAddresses.splice(i, 1);
            }
        }

        return {
            ...state,
            users: newAddresses,
            isLoading: false
        };
    }

    if (action.type === deleteUserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteUserFinish) {

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
            users: newAddresses,
            isLoading: false
        };
    }

    if (action.type === addUserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addUserFinish) {

        let addresses = state.addresses;

        const newAddress = action.newAddress;

        addresses.push(newAddress);

        return {
            ...state,
            users: addresses,
            isLoading: false
        };
    }

    return state;
};
