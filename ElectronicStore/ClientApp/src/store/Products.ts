import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ProductsState {
    isLoading: boolean;
    startDateIndex?: number;
    products: Product[];
    UiProducts: Product[];
    uivalues: Product;
    displayMessage: string;
}

export interface Product {
    ProductId: number;
    ProductNumber: string;
    ProductName: string;
    ProductDescription: string;
    Brand: string;
    MemberId: number;
    InitialQuantity: number;
    RemainingQuantity: number;
    PricePerUnit: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

export interface RequestProductsAction {
    type: 'REQUEST_PRODUCTS';
    startDateIndex: number;
}

export interface ReceiveProductsAction {
    type: 'RECEIVE_PRODUCTS';
    startDateIndex: number;
    products: Product[];
}

export interface ChangeProductValuesAction { 
    type: 'CHANGES_TEXT_PRODUCT'; 
    controlName: string; 
    controlValue: string;
}
export interface ProductSelectionChangedAction { 
    type: 'PRODUCT_SELECTED_ITEM'; 
    value: number;
}
export interface SaveStartedAction { 
    type: 'SAVE_PRODUCT_STARTED'; 
}

export interface SaveFinishedAction { 
    type: 'SAVE_PRODUCT_FINISHED'; 
    savedProduct: Product;
}

export interface DeleteAction {
    type: 'DELETED_ITEM';
    value: number;
}

export interface ApplyFilterAction {
    type: 'APPLY_PRODUCT_FILTER';
}

export interface ClearFilterAction {
    type: 'CLEAR_PRODUCT_FILTER';
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestProductsAction | ReceiveProductsAction | ChangeProductValuesAction | ProductSelectionChangedAction | 
SaveStartedAction | SaveFinishedAction | DeleteAction | ApplyFilterAction | ClearFilterAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestProducts: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
            fetch(`product`)
                .then(response => response.json() as Promise<Product[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PRODUCTS', startDateIndex: startDateIndex, products: data });
                });

            dispatch({ type: 'REQUEST_PRODUCTS', startDateIndex: startDateIndex });
    },
    productValueChange: (changedControl: string, changedValue: string) => ({ type: 'CHANGES_TEXT_PRODUCT', controlName: changedControl, controlValue: changedValue } as ChangeProductValuesAction),
    triggerAddOrEdit: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let product = getState().products;
        if(product)
        {
            fetch(`product`,
                {  
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(product.uivalues),
                }
            ).then(response => response.json() as Promise<Product>)
            .then(data => {
                dispatch({ type: 'SAVE_PRODUCT_FINISHED', savedProduct : data });
            });
            dispatch({ type: 'SAVE_PRODUCT_STARTED' });
        }
    },
    triggerDelete: (selectedValue: number): AppThunkAction <KnownAction> => (dispatch, getState) => {
        let product = getState().products;
        if (product) {
            fetch(`product`,
                {
                    method: 'delete',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product.products.filter(v => v.ProductId === selectedValue)[0]),
                }
            ).then(response => response.json() as Promise<Product>)
                .then(data => {
                    dispatch({ type: 'DELETED_ITEM', value: selectedValue });
                });
            //dispatch({ type: 'DELETE_ITEM', value: selectedValue });
        }
    },
    selectItem: (selectedValue: number) => ({ type: 'PRODUCT_SELECTED_ITEM', value:selectedValue } as ProductSelectionChangedAction),
    applyFilter: () => ({ type: 'APPLY_PRODUCT_FILTER' }) as ApplyFilterAction,
    clearFilterItems:  () => ({ type: 'CLEAR_PRODUCT_FILTER' }) as ClearFilterAction,
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const noProductState = {
    ProductId: 0, ProductNumber: '', ProductName: '', ProductDescription: '',
    Brand: '', MemberId: 0, InitialQuantity: 0, PricePerUnit:0.0,RemainingQuantity:0
}
const unloadedState: ProductsState = {
    products: [], isLoading: false, uivalues: noProductState, UiProducts:[], displayMessage:''
};

export const reducer: Reducer<ProductsState> = (state: ProductsState | undefined, incomingAction: Action): ProductsState => {
    if (state === undefined) {
        return unloadedState;
    }
    let regexpNumber = new RegExp("^[0-9]+$");
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_PRODUCTS':
            return {...state,
                startDateIndex: action.startDateIndex,
                isLoading: true,
               };
        case 'RECEIVE_PRODUCTS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {...state,
                products: action.products,
                UiProducts: [...action.products],
                startDateIndex: action.startDateIndex,
                isLoading: false,
                displayMessage: ''
            };
        case 'CHANGES_TEXT_PRODUCT':
            let lUivalues = {...state.uivalues};
            switch(action.controlName)
            {
                case 'ProductName':
                    lUivalues.ProductName = action.controlValue;
                    break;
                case 'ProductNumber':
                    lUivalues.ProductNumber = action.controlValue;
                    break;
                case 'ProductDescription':
                    lUivalues.ProductDescription = action.controlValue;
                    break;
                case 'Brand':
                    lUivalues.Brand = action.controlValue;
                    break;
                case 'MemberId':
                    if (!action.controlValue.match(regexpNumber)) {
                        action.controlValue = action.controlValue.replace(action.controlValue, "0");
                    }
                    lUivalues.MemberId = Number(action.controlValue);
                    break;
                case 'Quantity':                   
                    if(!action.controlValue.match(regexpNumber)) {
                        action.controlValue = action.controlValue.replace(action.controlValue, "0");
                    }
                    lUivalues.InitialQuantity = Number(action.controlValue);
                    break;
                case 'PricePerUnit':
                    let regExpDecimal = new RegExp("([0-9]*[.])?[0-9]{0,2}");//^[0-9]+(\.[0-9]{0,2})?
                    if (!action.controlValue.match(regExpDecimal)) {
                        action.controlValue = action.controlValue.replace(action.controlValue, "0");
                    }
                    lUivalues.PricePerUnit = Number(action.controlValue);
                    break;
                default:
                    break;
            }
            return  {...state,
                isLoading: false,
                uivalues: lUivalues
            }
        case 'PRODUCT_SELECTED_ITEM':
            let sItem = state.products.filter(x => x.ProductId === action.value)[0];
            return {...state, uivalues:sItem, displayMessage:'' };
        case 'CLEAR_PRODUCT_FILTER':
            let lState = {...state, uivalues:noProductState, UiProducts: [...state.products], displayMessage:'' };
            return lState;
        case 'SAVE_PRODUCT_FINISHED':
            let mState = {...state, uivalues:action.savedProduct, displayMessage:'Product Saved Successfully'};
            mState.products = mState.products.filter(x => x.ProductId != action.savedProduct.ProductId );
            mState.products.push(action.savedProduct);
            mState.UiProducts = [...mState.products.sort((n1,n2) => { if (n1.ProductId > n2.ProductId) { return 1; } if (n1.ProductId < n2.ProductId) { return -1;} return 0; })];
            return mState;
        case 'DELETED_ITEM':
            let dState = { ...state, products: state.products.filter(x => x.ProductId !== action.value), uivalues: noProductState  };
            dState.UiProducts = [...dState.products.sort((n1,n2) => { if (n1.ProductId > n2.ProductId) { return 1; } if (n1.ProductId < n2.ProductId) { return -1;} return 0; })];
            return dState;
        case 'APPLY_PRODUCT_FILTER':
            let uiProducts = [...state.products];
            if(state.uivalues.Brand.length > 0) uiProducts = state.products.filter(x => x.Brand.includes(state.uivalues.Brand))
            if(state.uivalues.MemberId > 0) uiProducts = uiProducts.filter(x => x.MemberId === state.uivalues.MemberId)
            if(state.uivalues.PricePerUnit  > 0) uiProducts = uiProducts.filter(x => x.PricePerUnit === state.uivalues.PricePerUnit)
            if(state.uivalues.ProductDescription.length > 0) uiProducts = uiProducts.filter(x => x.ProductDescription.includes(state.uivalues.ProductDescription))
            if(state.uivalues.ProductId  > 0) uiProducts = uiProducts.filter(x => x.ProductId === state.uivalues.ProductId)
            if(state.uivalues.ProductName.length > 0) uiProducts = uiProducts.filter(x => x.ProductDescription.includes(state.uivalues.ProductDescription))
            if(state.uivalues.ProductNumber.length > 0) uiProducts = uiProducts.filter(x => x.ProductDescription.includes(state.uivalues.ProductDescription))
            if(state.uivalues.RemainingQuantity  > 0) uiProducts = uiProducts.filter(x => x.RemainingQuantity === state.uivalues.RemainingQuantity)
            if(state.uivalues.InitialQuantity  > 0) uiProducts = uiProducts.filter(x => x.InitialQuantity === state.uivalues.InitialQuantity)

            let aFilterState = { ...state, UiProducts: uiProducts  };
            return aFilterState;
        default:
            return state;
    }

};
