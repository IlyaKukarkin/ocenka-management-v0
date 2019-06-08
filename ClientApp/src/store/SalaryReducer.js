const getSalaryStart = 'GET_SALARY_START';
const getSalaryFinish = 'GET_SALARY_FINISH';
const getEditSalaryStart = 'GET_EDIT_SALARY_START';
const getEditSalaryFinish = 'GET_EDIT_SALARY_FINISH';
const toExcelStart = 'TO_EXCEL_START';
const toExcelFinish = 'TO_EXCEL_FINISH';
const toExcelError = 'TO_EXCEL_ERROR';
const toExcelErrorClose = 'TO_EXCEL_ERROR_CLOSE';
const toExcelClose = 'TO_EXCEL_CLOSE';
const clearEditSalary = 'CLEAR_EDIT_SALARY';
const initialState = { salary: [], editSalary: {}, isLoading: false, fileSaved: false, fileError: false, deleteError: false };

export const actionCreators = {
    GetSalary: (id) => async (dispatch) => {
        dispatch({ type: getSalaryStart });

        const url = `api/Salary/${id}`;
        const response = await fetch(url);
        const salary = await response.json();

        dispatch({ type: getSalaryFinish, salary });
    },
    ClearEditSalary: () => async (dispatch) => {
        dispatch({ type: clearEditSalary });        
    },
    GetEditSalary: (data) => async (dispatch) => {
        dispatch({ type: getEditSalaryStart, data });
    },
    ToExcel: (id) => async (dispatch) => {
        dispatch({ type: toExcelStart });

        const url = `api/Salary/ToExcel/${id}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(id), headers: myHeaders })
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

    if (action.type === getSalaryStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getSalaryFinish) {
        let oldSalary = action.salary;
        let newSalary = [];

        for (let i = 0; i < oldSalary.length; i++) {
            newSalary.push({
                ...oldSalary[i],
                id: i,
            });
        }

        return {
            ...state,
            salary: newSalary,
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

    if (action.type === getEditSalaryStart) {
        return {
            ...state,
            editClient: action.data
        };
    }

    if (action.type === clearEditSalary) {
        return {
            ...state,
            editClient: {}
        };
    }

    return state;
};
