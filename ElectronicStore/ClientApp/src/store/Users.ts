import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UsersState {
    isLoading: boolean;
    startDateIndex?: number;
    users: User[];
    uivalues: User;
    displayMessage: string;
}

export interface User {
    UserId: number;
    UserName: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestUsersAction {
    type: 'REQUEST_USERS';
    startDateIndex: number;
}

interface ReceiveUsersAction {
    type: 'RECEIVE_USERS';
    startDateIndex: number;
    users: User[];
}

export interface ChangeUserValuesAction { 
    type: 'CHANGES_TEXT_USER'; 
    controlName: string; 
    controlValue: string;
}

export interface UserSelectionChangedAction {
    type: 'SELECTED_USER';
    value: number;
}
export interface SaveStartedAction {
    type: 'SAVE_USER_STARTED';
}

export interface SaveFinishedAction {
    type: 'SAVE_USER_FINISHED';
    savedUser: User;
}

export interface DeleteUserAction {
    type: 'DELETE_USER';
    value: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestUsersAction | ReceiveUsersAction | ChangeUserValuesAction | UserSelectionChangedAction | SaveStartedAction | SaveFinishedAction | DeleteUserAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestUsers: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.users && startDateIndex !== appState.users.startDateIndex) {
            fetch(`user`)
                .then(response => response.json() as Promise<User[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_USERS', startDateIndex: startDateIndex, users: data });
                });

            dispatch({ type: 'REQUEST_USERS', startDateIndex: startDateIndex });
        }
    },
    userValueChange: (changedControl: string, changedValue: string) => ({ type: 'CHANGES_TEXT_USER', controlName: changedControl, controlValue: changedValue } as ChangeUserValuesAction),
    triggerAddOrEdit: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let user = getState().users;
        if (user) {
            fetch(`user`,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user.uivalues),
                }
            ).then(response => response.json() as Promise<User>)
                .then(data => {
                    dispatch({ type: 'SAVE_USER_FINISHED', savedUser: data });
                });
            dispatch({ type: 'SAVE_USER_STARTED' });
        }
    },
    triggerUserDelete: (selectedValue: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let user = getState().users;
        if (user) {
            fetch(`user`,
                {
                    method: 'delete',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user.users.filter(v => v.UserId === selectedValue)[0]),
                }
            ).then(response => response.json() as Promise<User>)
                .then(data => {
                    dispatch({ type: 'DELETE_USER', value: selectedValue });
                });
            dispatch({ type: 'DELETE_USER', value: selectedValue });
        }
    },
    selectItem: (selectedValue: number) => ({ type: 'SELECTED_USER', value: selectedValue } as UserSelectionChangedAction)
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const noUserState = {
    UserId: 0, UserName: ''
}

const unloadedState: UsersState = { users: [], isLoading: false, uivalues:{UserId:0, UserName:''}, displayMessage:'' };

export const reducer: Reducer<UsersState> = (state: UsersState | undefined, incomingAction: Action): UsersState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_USERS':
            return {
                startDateIndex: action.startDateIndex,
                users: state.users,
                isLoading: true,
                uivalues: state.uivalues,
                displayMessage:''
            };
        case 'RECEIVE_USERS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    users: action.users,
                    isLoading: false,
                    uivalues: state.uivalues,
                    displayMessage:''
                };
            }
            break;
        case 'CHANGES_TEXT_USER':
            let lUivalues = {...state.uivalues};
            switch(action.controlName)
            {
                case 'UserName':
                    let sVal = action.controlValue.substr(0, 10);
                    lUivalues.UserName = sVal;
                    break;
                default:
                    break;
            }
            return  {
                startDateIndex: state.startDateIndex,
                users: state.users,
                isLoading: false,
                uivalues: lUivalues,
                displayMessage:''
            }
        case 'SELECTED_USER':
            let sItem = action.value === 0 ? noUserState : state.users.filter(x => x.UserId === action.value)[0];
            let lState = { ...state, uivalues: sItem, displayMessage:'' };
            return lState;
        case 'SAVE_USER_FINISHED':
            let mState = { ...state, uivalues: action.savedUser, displayMessage:'User Added Successfully' };
            mState.users.push(action.savedUser);
            return mState;
        case 'DELETE_USER':
            let dState = { ...state, users: state.users.filter(x => x.UserId !== action.value), uivalues: noUserState };
            return dState;
        default:
            return state;
    }

    return state;
};
