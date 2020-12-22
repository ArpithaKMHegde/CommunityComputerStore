import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
//import { stat } from 'fs';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface MembersState {
    isLoading: boolean;
    startDateIndex?: number;
    members: Member[];
    uivalues: Member;
    displayMessage: string;
}

export interface Member {
    MemberId: number;
    FirstName: string;
    LastName: string;
    Address: string;   
    EmailId: string;
    ContactNumber: string;
    StartDate: string;
    EndDate: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestMembersAction {
    type: 'REQUEST_MEMBERS';
    startDateIndex: number;
}

interface ReceiveMembersAction {
    type: 'RECEIVE_MEMBERS';
    startDateIndex: number;
    members: Member[];
}

export interface ChangeMemberValuesAction { 
    type: 'CHANGES_TEXT_MEMBER'; 
    controlName: string; 
    controlValue: string;
}

export interface MemberSelectionChangedAction {
    type: 'MEMBER_SELECTED_ITEM';
    value: number;
}
export interface SaveStartedAction {
    type: 'SAVE_MEMBER_STARTED';
}

export interface SaveFinishedAction {
    type: 'SAVE_MEMBER_FINISHED';
    savedMember: Member;
}

export interface DeleteMemberAction {
    type: 'DELETE_MEMBER';
    value: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestMembersAction | ReceiveMembersAction | ChangeMemberValuesAction | MemberSelectionChangedAction | SaveStartedAction | SaveFinishedAction | DeleteMemberAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestMembers: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.members && startDateIndex !== appState.members.startDateIndex) {
            fetch(`member`)
                .then(response => response.json() as Promise<Member[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_MEMBERS', startDateIndex: startDateIndex, members: data });
                });

            dispatch({ type: 'REQUEST_MEMBERS', startDateIndex: startDateIndex });
        }
    },
    memberValueChange: (changedControl: string, changedValue: string) => ({ type: 'CHANGES_TEXT_MEMBER', controlName: changedControl, controlValue: changedValue } as ChangeMemberValuesAction),
    triggerAddOrEdit: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let member = getState().members;
        if (member) {
            fetch(`member`,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(member.uivalues),
                }
            ).then(response => response.json() as Promise<Member>)
                .then(data => {
                    dispatch({ type: 'SAVE_MEMBER_FINISHED', savedMember: data });
                });
            dispatch({ type: 'SAVE_MEMBER_STARTED' });
        }
    },

    triggerMemberDelete: (selectedValue: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let member = getState().members;
        if (member) {
            fetch(`member`,
                {
                    method: 'delete',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(member.members.filter(m => m.MemberId === selectedValue)[0]),
                }
            ).then(response => response.json() as Promise<Member>)
                .then(data => {
                    dispatch({ type: 'DELETE_MEMBER', value: selectedValue });
                });
            dispatch({ type: 'DELETE_MEMBER', value: selectedValue });
        }
    },

    selectItem: (selectedValue: number) => ({ type: 'MEMBER_SELECTED_ITEM', value: selectedValue } as MemberSelectionChangedAction)
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const noMemberState = {
    ContactNumber: "", EmailId: "", FirstName: "", MemberId: 0, LastName: "", Address: "", StartDate: "", EndDate: ""
}

const unloadedState: MembersState = {
    members: [], isLoading: false, uivalues: noMemberState, displayMessage:''
};

export const reducer: Reducer<MembersState> = (state: MembersState | undefined, incomingAction: Action): MembersState => {
    if (state === undefined) {
        return unloadedState;
    }

    let nameRegexp = new RegExp("^[A-Za-z ]*$");  //^[a-zA-Z]+ [a-zA-Z]+$
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_MEMBERS':
            return {
                startDateIndex: action.startDateIndex,
                members: state.members,
                isLoading: true,
                uivalues: state.uivalues,
                displayMessage:''
            };
        case 'RECEIVE_MEMBERS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    members: action.members,
                    isLoading: false,
                    uivalues: state.uivalues,
                    displayMessage:''
                };
            };
            break;
        case 'CHANGES_TEXT_MEMBER':
            let lUivalues = {...state.uivalues};
            switch(action.controlName)
            {
                case 'FirstName':
                    if (!action.controlValue.match(nameRegexp)) {
                        action.controlValue = action.controlValue.replace(action.controlValue, "");
                    }
                    lUivalues.FirstName = action.controlValue;
                    break;
                case 'ContactNumber':
                    lUivalues.ContactNumber = action.controlValue;
                    break;
                case 'EmailId':
                    lUivalues.EmailId = action.controlValue;
                    break;
                case 'LastName':
                    if (!action.controlValue.match(nameRegexp)) {
                        action.controlValue = action.controlValue.replace(action.controlValue, "");
                    }
                    lUivalues.LastName = action.controlValue;
                    break;
                case 'Address':
                    lUivalues.Address = action.controlValue;
                    break;
                case 'StartDate':
                    lUivalues.StartDate = action.controlValue;
                    break;
                case 'EndDate':
                    lUivalues.EndDate = action.controlValue;
                    break;
                default:
                    break;
            }
            return  {
                startDateIndex: state.startDateIndex,
                members: state.members,
                isLoading: false,
                uivalues: lUivalues,
                displayMessage:''
            }
        case 'MEMBER_SELECTED_ITEM':
            let sItem = action.value === 0 ? noMemberState : state.members.filter(x => x.MemberId === action.value)[0];
            let lState = { ...state, uivalues: sItem, displayMessage:'' };
            return lState;
        case 'SAVE_MEMBER_FINISHED':
            let mState = { ...state, uivalues: action.savedMember, displayMessage:'Member Saved Successfully' };
            mState.members = mState.members.filter(m => m.MemberId !== action.savedMember.MemberId)
            mState.members.push(action.savedMember);
            return mState;
        case 'DELETE_MEMBER':
            let dState = { ...state, members: state.members.filter(m => m.MemberId !== action.value), uivalues: noMemberState };
            return dState;
        default:
            return state;
    }

    return state;
};
