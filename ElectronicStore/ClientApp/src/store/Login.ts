import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LoginsState {
    isLoading: boolean;
    startDateIndex?: number;
    logins: Login[];
    uivalues: Login;
    isError: boolean;
    helperText: string;
    isLoggedIn:boolean;
}

export interface Login {
    UserName: string;
    Password: string;
}

export interface LoginResponse {
    status: boolean;
    message: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestLoginsAction {
    type: 'REQUEST_LOGINS'
}


export interface ChangeLoginValuesAction {
    type: 'CHANGES_TEXT_LOGIN';
    controlName: string;
    controlValue: string;
}

export interface LoginResponseAction {
    type: 'LOGIN_RESPONSE';
    response: LoginResponse;
}

export interface LogoutAction {
    type: 'LOGOUT';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestLoginsAction | ChangeLoginValuesAction | LoginResponseAction | LogoutAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestLogins: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.login ) {
            fetch(`Login`,
            {  
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(appState.login.uivalues),
            })
            .then(response => response.json() as Promise<LoginResponse>)
            .then(data => {
                dispatch({ type: 'LOGIN_RESPONSE', response : data  });
            });

            dispatch({ type: 'REQUEST_LOGINS' });
        }
    },
    loginValueChange: (changedContol: string, changedValue: string) => ({ type: 'CHANGES_TEXT_LOGIN', controlName: changedContol, controlValue: changedValue } as ChangeLoginValuesAction),
    logOut: () => ({type:'LOGOUT'}) as LogoutAction
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: LoginsState = {
    logins: [], isLoading: false, uivalues: { UserName: 'Administrator', Password: 'Administrator' }, isError: false, helperText:'', isLoggedIn:false
};

export const reducer: Reducer<LoginsState> = (state: LoginsState | undefined, incomingAction: Action): LoginsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_LOGINS':
            return {
                
                logins: state.logins,
                isLoading: true,
                uivalues: state.uivalues,
                isError: false,
                helperText: '',
                isLoggedIn: false
            };
        case 'CHANGES_TEXT_LOGIN':
            let lUivalues = { ...state.uivalues };
            switch (action.controlName)
            {
                case 'UserName':
                    lUivalues.UserName = action.controlValue;
                    break;
                case 'Password':
                    lUivalues.Password = action.controlValue;
                    break;
                default:
                    break;
            }
            return {...state, uivalues: lUivalues};

        case 'LOGIN_RESPONSE':
            return {
                ...state,
                helperText: action.response.message,
                isLoggedIn: action.response.status,
                isError: false
            };
        case 'LOGOUT':
            return { ...state, isLoggedIn: false, helperText:'Logged out succussfully' };
        default:
            return {...state};
    }

};
