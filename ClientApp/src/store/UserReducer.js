const getUsersStart = 'GET_USERS_START';
const getUsersFinish = 'GET_USERS_FINISH';
const deleteUserStart = 'DELETE_USER_START';
const deleteUserFinish = 'DELETE_USER_FINISH';
const addUserStart = 'ADD_USER_START';
const addUserFinish = 'ADD_USER_FINISH';
const editUserStart = 'EDIT_USER_START';
const editUserFinish = 'EDIT_USER_FINISH';
const deleteUsersStart = 'DELETE_USERS_START';
const deleteUsersFinish = 'DELETE_USERS_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const getEditUserStart = 'GET_EDIT_USER_START';
const getEditApprFinish = 'GET_APPR_USER_FINISH';
const getEditUserFinish = 'GET_EDIT_USER_FINISH';
const getEditDirFinish = 'GET_EDIT_DIR_FINISH';
const deleteError = 'DELETE_ERROR';
const deleteErrorClose = 'DELETE_ERROR_CLOSE';
const clearEditUser = 'CLEAR_EDIT_USER';
const initialState = { users: [], editUser: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetUsersSet: () => async (dispatch) => {
        dispatch({ type: getUsersStart });

        const url = `api/UserSets`;
        const response = await fetch(url);
        const users = await response.json();

        dispatch({ type: getUsersFinish, users });
    },
    GetEditUser: (data) => async (dispatch) => {
        dispatch({ type: getEditUserStart, data });
        let url, response, user;

        if (data.roleId === 1) {
            url = `api/AppraiserSets/${data.id}`;
            return fetch(url)
                .then(function (response) {
                    return response.json();
                }).then(function (user) {
                    dispatch({ type: getEditApprFinish, user });
                    return user;
                });
        } else {
            if (data.roleId === 2) {
                url = `api/AccountantSets/${data.id}`;
                response = await fetch(url);
                user = await response.json();
                dispatch({ type: getEditUserFinish, user });
                return user;
            } else {
                url = `api/DirectorSets/${data.id}`;
                response = await fetch(url);
                user = await response.json();
                dispatch({ type: getEditDirFinish, user });
                return user;
            }
        }
    },
    ClearEditUser: () => async (dispatch) => {
        dispatch({ type: clearEditUser });        
    },
    DeleteUserSet: (id) => async (dispatch) => {
        dispatch({ type: deleteUserStart });

        const url = `api/UserSets/${id}`;
        fetch(url, { method: 'delete' })
            .then(function (response) {
                if (response.status === 500) {
                    dispatch({ type: deleteError });
                } else {
                    dispatch({ type: deleteUserFinish, id });
                }
            });
    },
    DeleteUsersSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteUsersStart });

        idSet.forEach(async function (id) {
            const url = `api/UserSets/${id}`;
            fetch(url, { method: 'delete' })
                .then(function (response) {
                    if (response.status === 500) {
                        dispatch({ type: deleteError });
                    } else {
                        dispatch({ type: deleteUserFinish, id });
                    }
                });
        });
    },
    AddUserSet: (data) => async (dispatch) => {
        dispatch({ type: addUserStart });

        if (data.roleId === 1) {
            const url = `api/UserSets`;
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                .then(function (response) {
                    return response.json();
                }).then(function (newUser) {
                    const appr = { position: data.extra, id: newUser.id };
                    fetch('api/AppraiserSets', { method: 'post', body: JSON.stringify(appr), headers: myHeaders });
                    dispatch({ type: addUserFinish, newUser });
                });
        } else {
            const url = `api/UserSets`;
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                .then(function (response) {
                    return response.json();
                }).then(function (newUser) {
                    const acc = { salary: data.extra, id: newUser.id };
                    fetch('api/AccountantSets', { method: 'post', body: JSON.stringify(acc), headers: myHeaders });
                    dispatch({ type: addUserFinish, newUser });
                });
        }        
    },
    EditUserSet: (data) => async (dispatch) => {
        dispatch({ type: editUserStart });

        if (data.roleId === 1) {
            const url = `api/UserSets/${data.id}`;
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            fetch(url, { method: 'put', body: JSON.stringify(data), headers: myHeaders })
                .then(function (response) {
                    const appr = { position: data.extra, id: data.id };
                    fetch(`api/AppraiserSets/${data.id}`, { method: 'put', body: JSON.stringify(appr), headers: myHeaders });
                    dispatch({ type: editUserFinish, data });
                });
        } else {
            if (data.roleId === 2) {
                const url = `api/UserSets/${data.id}`;
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                fetch(url, { method: 'put', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        const acc = { salary: data.extra, id: data.id };
                        fetch(`api/AccountantSets/${data.id}`, { method: 'put', body: JSON.stringify(acc), headers: myHeaders });
                        dispatch({ type: editUserFinish, data });
                    });
            } else {
                const url = `api/UserSets/${data.id}`;
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                fetch(url, { method: 'put', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        const acc = { salary: data.extra, id: data.id };
                        fetch(`api/DirectorSets/${data.id}`, { method: 'put', body: JSON.stringify(acc), headers: myHeaders });
                        dispatch({ type: editUserFinish, data });
                    });
            }
        }
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/UserSets/ToExcel`;
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

const fixData = (user) => {
    let y1, m1, d1, y2, m2, d2;

    m1 = user.birthday.substring(0, 2);
    d1 = user.birthday.substring(3, 5);
    y1 = user.birthday.substring(6, 10);

    m2 = user.worksSince.substring(0, 2);
    d2 = user.worksSince.substring(3, 5);
    y2 = user.worksSince.substring(6, 10);

    user.birthday = y1 + '.' + m1 + '.' + d1;
    user.worksSince = y2 + '.' + m2 + '.' + d2;

    return user;
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

    if (action.type === editUserStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editUserFinish) {

        let users = state.users;
        let newUser = action.data;

        newUser = fixData(newUser);

        const usrIndex = users.findIndex(u => u.id === newUser.id);

        users[usrIndex] = newUser;

        return {
            ...state,
            users: users,
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

    if (action.type === getEditUserStart) {
        return {
            ...state,
            editUser: action.data
        };
    }

    if (action.type === getEditUserFinish) {
        return {
            ...state,
            editUser: {
                ...state.editUser,
                salary: action.user.salary,
                category: ""
            }
        };
    }

    if (action.type === getEditDirFinish) {
        return {
            ...state,
            editUser: {
                ...state.editUser,
                salary: action.user.salary,
                category: ""
            }
        };
    }

    if (action.type === getEditApprFinish) {
        return {
            ...state,
            editUser: {
                ...state.editUser,
                category: action.user.position,
                salary: ""
            }
        };
    }

    if (action.type === clearEditUser) {
        return {
            ...state,
            editUser: {}
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
