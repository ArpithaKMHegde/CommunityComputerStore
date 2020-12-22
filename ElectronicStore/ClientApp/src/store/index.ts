import * as Login from './Login';
import * as Products from './Products';
import * as Members from './Members';
import * as Users from './Users';
import * as Transactions from './Transactions';
import * as SalesDetails from './SalesDetails';

// The top-level state object
export interface ApplicationState {
    login: Login.LoginsState | undefined;
    products: Products.ProductsState | undefined;
    members: Members.MembersState | undefined;
    users: Users.UsersState | undefined;
    transactions: Transactions.TransactionsState | undefined;
    salesDetails: SalesDetails.SalesDetailsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    login: Login.reducer ,
    products: Products.reducer ,
    members: Members.reducer ,
    users: Users.reducer ,
    transactions: Transactions.reducer,
    salesDetails: SalesDetails.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
