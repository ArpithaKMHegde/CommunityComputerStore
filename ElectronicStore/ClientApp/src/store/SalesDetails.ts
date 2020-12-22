import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { Member } from './Members';
import { Product } from './Products';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface SalesDetailsState {
    isLoading: boolean;
    startDateIndex?: number;
    sales: SalesAndDetail[];
    transactionDetails: Transaction[];
    uivalues: UIControls;
    isSalesVisible: boolean;
}

export interface UIControls {
    FromDate: Date;
    ToDate: Date;
}

export interface Transaction {
    TransactionId: number;
    Invoice: Sales;
    TotalAmount: number;
    PaymentType: string;
    TransactionStatus: number;
    TransactionDate: Date;
}

export interface Sales
{
    SalesId: number;
    BuyingMember: Member;
    SalesDateTime: Date;
    ReceiptNumber: string;
    DiscountAmount: number;
    Items: SalesDetail[];
    TotalBillAmount: number;
}

export interface SalesDetail
{
    SalesDetailsId: number;
    SoldProduct: Product;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
    IsDeleted: number;
}

export interface SalesAndDetail
{
    SalesId: number;
    SalesDetailsId: number;
    MemberId: number;
    FirstName: string;
    SalesDateTime: Date;
    ReceiptNumber: string;
    DiscountAmount: number;
    TotalBillAmount: number;
    ProductId: number;
    ProductNumber: string;
    ProductName: string;
    Quantity: number;
    TotalPrice: number;
    IsDeleted: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestTransactionDetailsAction {
    type: 'REQUEST_TRANSACTIONDETAILS';
    startDateIndex: number;
}

interface ReceiveTransactionDetailsAction {
    type: 'RECEIVE_TRANSACTIONDETAILS';
    startDateIndex: number;
    transactionDetails: Transaction[];
}

interface RequestSalesDetailsAction {
    type: 'REQUEST_SALESDETAILS';
    startDateIndex: number;
}

interface ReceiveSalesDetailsAction {
    type: 'RECEIVE_SALESDETAILS';
    startDateIndex: number;
    transactionDetails: Transaction[];
}

export interface ChangeSalesValuesAction {
    type: 'CHANGES_TEXT_SALES';
    controlName: string;
    controlValue: string;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestTransactionDetailsAction | ReceiveTransactionDetailsAction | ChangeSalesValuesAction | RequestSalesDetailsAction | ReceiveSalesDetailsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    triggerGetSalesDetails: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.salesDetails) {
            fetch(`transaction`)
                .then(response => response.json() as Promise<Transaction[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_SALESDETAILS', startDateIndex: startDateIndex, transactionDetails: data });
                });

            dispatch({ type: 'REQUEST_SALESDETAILS', startDateIndex: startDateIndex });
        }
    },
    triggerGetTransactionDetails: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.transactions) {
            fetch(`transaction`)
                .then(response => response.json() as Promise<Transaction[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TRANSACTIONDETAILS', startDateIndex: startDateIndex, transactionDetails: data });
                });

            dispatch({ type: 'REQUEST_TRANSACTIONDETAILS', startDateIndex: startDateIndex });
        }
    },
    userValueChange: (changedControl: string, changedValue: string) => ({ type: 'CHANGES_TEXT_SALES', controlName: changedControl, controlValue: changedValue } as ChangeSalesValuesAction),
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const salesDet = {
    SalesId: 0, SalesDateTime: new Date(), ProductName: "", UnitPrice: 0.0, Quantity: 0, DiscountAmount: 0.0, TotalPrice: 0.0, ReceiptNumber: "", CustomerName: ""
}
const transactionDet = {
    TransactionId: 0, SalesId: 0, TotalAmount: 0.0, PaymentType: "", TransactionDate: new Date(), TransactionStatus: "", CustomerName: ""
}
const unloadedState: SalesDetailsState = { sales: [], isLoading: false, uivalues: { FromDate: new Date(), ToDate: new Date() }, transactionDetails: [], isSalesVisible:true };

export const reducer: Reducer<SalesDetailsState> = (state: SalesDetailsState | undefined, incomingAction: Action): SalesDetailsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_SALESDETAILS':
            return {
                startDateIndex: action.startDateIndex,
                sales: state.sales,
                isLoading: true,
                uivalues: state.uivalues,
                transactionDetails: state.transactionDetails,
                isSalesVisible: true
            };
        case 'REQUEST_TRANSACTIONDETAILS':
            return {
                startDateIndex: action.startDateIndex,
                sales: state.sales,
                isLoading: true,
                uivalues: state.uivalues,
                transactionDetails: state.transactionDetails,
                isSalesVisible: false
            };
        case 'RECEIVE_SALESDETAILS':
            let snd : SalesAndDetail[] = [];
            action.transactionDetails.map(tr =>
            {
                tr.Invoice.Items.map( sl => {
                    let trow : SalesAndDetail =
                    {
                        SalesId: tr.Invoice.SalesId,
                        SalesDetailsId: sl.SalesDetailsId,
                        MemberId: tr.Invoice.BuyingMember.MemberId,
                        FirstName: tr.Invoice.BuyingMember.FirstName,
                        SalesDateTime: tr.TransactionDate,
                        ReceiptNumber: tr.Invoice.ReceiptNumber,
                        DiscountAmount: tr.Invoice.DiscountAmount,
                        TotalBillAmount: tr.Invoice.TotalBillAmount,
                        ProductId: sl.SoldProduct.ProductId,
                        ProductNumber: sl.SoldProduct.ProductNumber,
                        ProductName: sl.SoldProduct.ProductName,
                        Quantity:sl.Quantity,  //sl.SoldProduct.InitialQuantity,
                        TotalPrice:  tr.TotalAmount,
                        IsDeleted: 0,
                    } 
                    snd.push(trow);
                });
            });
            
            return {
                startDateIndex: action.startDateIndex,
                sales: snd,
                isLoading: false,
                uivalues: state.uivalues,
                transactionDetails: action.transactionDetails,
                isSalesVisible: true
            };

        case 'RECEIVE_TRANSACTIONDETAILS':
            let sndt : SalesAndDetail[] = [];
            action.transactionDetails.map(tr =>
            {
                tr.Invoice.Items.map( sl => {
                    let trow : SalesAndDetail =
                    {
                        SalesId: tr.Invoice.SalesId,
                        SalesDetailsId: sl.SalesDetailsId,
                        MemberId: tr.Invoice.BuyingMember.MemberId,
                        FirstName: tr.Invoice.BuyingMember.FirstName,
                        SalesDateTime: tr.TransactionDate,
                        ReceiptNumber: tr.Invoice.ReceiptNumber,
                        DiscountAmount: tr.Invoice.DiscountAmount,
                        TotalBillAmount: tr.Invoice.TotalBillAmount,
                        ProductId: sl.SoldProduct.ProductId,
                        ProductNumber: sl.SoldProduct.ProductNumber,
                        ProductName: sl.SoldProduct.ProductName,
                        Quantity:sl.SoldProduct.InitialQuantity,
                        TotalPrice:  tr.TotalAmount,
                        IsDeleted: 0,
                    } 
                    sndt.push(trow);
                });
            });
            
            return {
                startDateIndex: action.startDateIndex,
                sales: sndt,
                isLoading: false,
                uivalues: state.uivalues,
                transactionDetails: action.transactionDetails,
                isSalesVisible: false
            };
        case 'CHANGES_TEXT_SALES':
            let lUivalues = { ...state.uivalues };
            switch (action.controlName) {
                case 'FromDate':
                    lUivalues.FromDate = new Date(action.controlValue);
                    break;
                case 'ToDate':
                    lUivalues.ToDate = new Date(action.controlValue);
                    break;
                default:
                    break;
            }
            return {
                startDateIndex: state.startDateIndex,
                sales: state.sales,
                isLoading: false,
                uivalues: lUivalues,
                transactionDetails: state.transactionDetails,
                isSalesVisible: true
            }
        default:
            return state;
    }

};
