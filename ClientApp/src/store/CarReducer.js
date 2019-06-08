const getCarsStart = 'GET_CARS_START';
const getCarsFinish = 'GET_CARS_FINISH';
const deleteCarStart = 'DELETE_CAR_START';
const deleteCarFinish = 'DELETE_CAR_FINISH';
const addCarStart = 'ADD_CAR_START';
const addCarFinish = 'ADD_CAR_FINISH';
const getEditCarStart = 'GET_EDIT_CAR_START';
const getEditCarFinish = 'GET_EDIT_CAR_FINISH';
const editCarStart = 'EDIT_CAR_START';
const editCarFinish = 'EDIT_CAR_FINISH';
const deleteCarsStart = 'DELETE_CARS_START';
const deleteCarsFinish = 'DELETE_CARS_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const deleteError = 'DELETE_ERROR';
const deleteErrorClose = 'DELETE_ERROR_CLOSE';
const clearEditCar = 'CLEAR_EDIT_CAR';
const initialState = { cars: [], editCar: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetCarsSet: () => async (dispatch) => {
        dispatch({ type: getCarsStart });

        const url = `api/CarSets`;
        const response = await fetch(url);
        const cars = await response.json();

        dispatch({ type: getCarsFinish, cars });
    },
    ClearEditCar: () => async (dispatch) => {
        dispatch({ type: clearEditCar });        
    },
    DeleteCarSet: (id) => async (dispatch) => {
        dispatch({ type: deleteCarStart });

        const url2 = `api/ObjectSets/${id}`;
        fetch(url2, { method: 'delete' })
            .then(function (response) {
                if (response.status === 500) {
                    dispatch({ type: deleteError });
                } else {
                    dispatch({ type: deleteCarFinish, id });
                }
            });
    },
    DeleteCarsSet: (idSet) => async (dispatch) => {
        dispatch({ type: deleteCarsStart });

        idSet.forEach(async function (id) {
            const url2 = `api/ObjectSets/${id}`;
            fetch(url2, { method: 'delete' })
                .then(function (response) {
                    if (response.status === 500) {
                        dispatch({ type: deleteError });
                    } else {
                        dispatch({ type: deleteCarFinish, id });
                    }
                });
        });
    },
    AddCarSet: (data) => async (dispatch) => {
        dispatch({ type: addCarStart });

        let url = `api/ObjectSets`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (newObject) {
                data['id'] = newObject.id;
                fetch('api/CarSets', { method: 'post', body: JSON.stringify(data), headers: myHeaders })
                    .then(function (response) {
                        return response.json();
                    }).then(function (newClient2) {
                        dispatch({ type: addCarFinish, data });
                    });
            });
    },
    GetEditCar: (data) => async (dispatch) => {
        dispatch({ type: getEditCarStart, data });
    },
    EditCarSet: (data) => async (dispatch) => {
        dispatch({ type: editCarStart });

        let car = {
            id: data.id,
            mark: data.mark, model: data.model, year: data.year, licenseNumber: data.licenseNumber
        };
        let object = {
            id: data.id,
            cadastralNumber: data.cadastralNumber, aimOfEvaluation: data.aimOfEvaluation
        };

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`api/ObjectSets/${data.id}`, { method: 'put', body: JSON.stringify(object), headers: myHeaders })
            .then(function () {
                fetch(`api/CarSets/${data.id}`, { method: 'put', body: JSON.stringify(car), headers: myHeaders })
                    .then(function () {
                        dispatch({ type: editCarFinish, data });
                    });
            });
    },
    ToExcel: (data) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/CarSets/ToExcel`;
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

    if (action.type === getCarsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getCarsFinish) {
        let oldCars = action.cars;
        let newCars = [];

        for (let i = 0; i < oldCars.length; i++) {
            newCars.push({
                id: oldCars[i].id, mark: oldCars[i].mark, model: oldCars[i].model, year: oldCars[i].year, licenseNumber: oldCars[i].licenseNumber,
                cadastralNumber: oldCars[i].idNavigation.cadastralNumber, aimOfEvaluation: oldCars[i].idNavigation.aimOfEvaluation
            });
        }

        return {
            ...state,
            cars: newCars,
            isLoading: false
        };
    }

    if (action.type === deleteCarStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteCarFinish) {

        let newClients = state.cars;

        for (var i = 0; i < newClients.length; i++) {
            if (newClients[i].id === action.id) {
                newClients.splice(i, 1);
            }
        }

        return {
            ...state,
            cars: newClients,
            isLoading: false
        };
    }

    if (action.type === deleteCarsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === deleteCarsFinish) {

        let newCars = state.cars;

        for (var j = 0; j < action.idSet.length; j++) {
            for (var k = 0; k < newCars.length; k++) {
                if (newCars[k].id === action.idSet[j]) {
                    newCars.splice(k, 1);
                    break;
                }
            }
        }

        return {
            ...state,
            cars: newCars,
            isLoading: false
        };
    }

    if (action.type === addCarStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === addCarFinish) {
        let cars = state.cars;
        let newCar = action.data;

        cars.push(newCar);

        return {
            ...state,
            cars: cars,
            isLoading: false
        };
    }

    if (action.type === editCarStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === editCarFinish) {

        let cars = state.cars;
        let newCar = action.data;

        const fltIndex = cars.findIndex(u => u.id === newCar.id);

        cars[fltIndex] = newCar;

        return {
            ...state,
            cars: cars,
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

    if (action.type === getEditCarStart) {
        return {
            ...state,
            editCar: action.data
        };
    }

    if (action.type === clearEditCar) {
        return {
            ...state,
            editCar: {}
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
