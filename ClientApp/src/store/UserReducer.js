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
    DeleteUserSet: (id) => async (dispatch) => {
        dispatch({ type: deleteUserStart });

        const url = `api/UserSets/${id}`;
        const response = await fetch(url, { method: 'delete' });

        dispatch({ type: deleteUserFinish, id });
    },
    DeleteUsersSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteUsersStart });

        idSet.forEach(async function (id) {
            const url = `api/UserSets/${id}`;
            const response = await fetch(url, { method: 'delete' });
        });

        dispatch({ type: deleteUsersFinish, idSet });
    },
    AddUserSet: (data) => async (dispatch) => {
        dispatch({ type: addUserStart });

        const url = `api/UserSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newUser) {
                const appr = { position: '1-кат', id: newUser.id };
                fetch('api/AppraiserSets', { method: 'post', body: JSON.stringify(appr), headers: myHeaders });
                dispatch({ type: addUserFinish, newUser });
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

        let newUsers = state.users;

        for (var i = 0; i < newUsers.length; i++) {
            if (newUsers[i].id === action.id) {
                newUsers.splice(i, 1);
            }
        }

        return {
            ...state,
            users: newUsers,
            isLoading: false
        };
    }

    if (action.type === deleteUsersStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteUsersFinish) {

        let newUsers = state.users;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newUsers.length; k++) {
                if (newUsers[k].id === action.idSet[j]) {
                    newUsers.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            users: newUsers,
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

        let users = state.users;

        const newUser = action.newUser;

        users.push(newUser);

        return {
            ...state,
            users: users,
            isLoading: false
        };
    }

    return state;
};
