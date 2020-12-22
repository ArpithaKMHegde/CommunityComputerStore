import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as TransactionsStore from '../store/Transactions';

// At runtime, Redux will merge together...
type TransactionProps =
  TransactionsStore.TransactionsState // ... state we've requested from the Redux store
  & typeof TransactionsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class Transactions extends React.PureComponent<TransactionProps> {

    public render() {
        return (
            <React.Fragment>
                <h2 id="tabelLabel" className="text-center">Billing Entry</h2>
                <div className="container">
                    {this.renderTransactionsAddEdit()}
                    {this.renderTransactionsTable()}
                    {this.renderTotalBilling()}
                </div>
            </React.Fragment>
        );
    }

  private ensureDataFetched() {
    const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
    this.props.requestTransactions(startDateIndex);
    }

    private renderTransactionsAddEdit() {
        return (
            <div className="Container">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="TransactionId">Transaction Identifier</label>
                            <input type="text" className="form-control" id="TransactionId" placeholder="0-9" disabled value={this.props.uivalues.TransactionId} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ReceiptNumber">Receipt Number</label>
                            <input type="text" className="form-control" id="ReceiptNumber" placeholder="0-9" disabled value={this.props.uivalues.Invoice.ReceiptNumber} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="PaymentType">Payment Type</label>
                            <input type="text" className="form-control" id="PaymentType" placeholder="eg. Laptop, desktop" value="Cash" disabled />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="TransactionStatus">Transaction Status</label>
                            <input type="text" className="form-control" id="TransactionStatus" placeholder="Status" disabled 
                            value={this.props.uivalues.TransactionStatus} onChange={(event) => { this.props.transactionValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="TransactionDate">Transaction Date</label>
                            <input type="date" className="form-control" id="TransactionDate" placeholder="Date" 
                            value={this.formattedDate()} 
                            onChange={(event) => { this.props.transactionValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="lMemberId">Customer Number</label>
                            <input type="text" className="form-control" id="lMemberId" placeholder="Enter Customer Number"
                            value={this.props.uivalues.lMemberId}
                            onChange={(event) => { this.props.transactionValueChange(event.target.id, event.target.value); }} 
                            onBlur={() => { this.props.getMemberName(); }} />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="lFirstName">Customer Name</label>
                            <input type="text" className="form-control" id="lFirstName" placeholder="Find Customer Name" disabled
                            value={this.props.uivalues.lFirstName} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="lProductId">Product Id</label>
                            <input type="text" className="form-control" id="lProductId" placeholder="Enter Product Number" 
                            onChange={(event) => { this.props.transactionValueChange(event.target.id, event.target.value); }} 
                            onBlur={() => { this.props.GetProduct(); }} 
                            value={this.props.uivalues.lProductId}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="lProductNumber">Product Number</label>
                            <input type="text" className="form-control" id="lProductNumber" placeholder="Enter Product Number" 
                            value={this.props.uivalues.lProductNumber}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="Quantity">Quantity</label>
                            <input type="text" className="form-control" id="Quantity" placeholder="Enter Quantity" value={this.props.uivalues.SoldQuantity}
                            onChange={(event) => { this.props.transactionValueChange(event.target.id, event.target.value); }} />
                            <label htmlFor="Quantity" style={{ color: 'red' }}>{this.props.displayAvailableQty}</label>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12 col-sm-6">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={() => { this.props.AddProductToList(); }}>Add Product</div>
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={() => { this.props.ClearUIControls(); }}>Clear</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-5 col-md-5 col-sm-5" />
                    <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group center-block">
                            <div style={{ color: 'red' }}>{this.props.displayMessage} </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3" />
                </div>
            </div>
        );
    }

    private renderTransactionsTable() {
        return (
            <div>
                <h2 className="text-center">Billable Items List</h2>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Product Id</th>
                            <th>Product Number </th>
                            <th>Product Name </th>
                            <th>Unit Price($)</th>
                            <th>Quantity</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.uivalues.Invoice.Items.map((sd: TransactionsStore.SalesDetail) =>
                            <tr key={sd.SoldProduct.ProductId}>
                                <td>{sd.SoldProduct.ProductId}</td>
                                <td>{sd.SoldProduct.ProductNumber}</td>
                                <td>{sd.SoldProduct.ProductName}</td>
                                <td>{sd.SoldProduct.PricePerUnit}</td>
                                <td>{sd.Quantity}</td>
                                <td>
                                    <div className="col-lg-3 col-md-3 col-sm-12">
                                        <div className="form-group center-block">
                                            <div typeof="button" className="btn btn-primary btn-lg" onClick={() => { this.props.DeleteProductFromList(sd.SalesDetailsId, sd.SoldProduct.ProductId); }}>Delete</div>
                                        </div>
                                    </div >
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    private renderTotalBilling() {
        return (
            <div>
                <br/>
                <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-7" />
                    <div className="col-lg-5 col-md-5 col-sm-5">
                        <div className="input-group">
                            <label htmlFor="TotalDiscount" style={{ width: '120px', }}>Total Discount($)<br/>(5% on total)</label>
                            <input type="text" className="form-control" id="TotalDiscount" placeholder="Total Discount Amt" disabled
                             value={this.props.uivalues.Invoice.DiscountAmount} />
                        </div>
                    </div>
                    <div className="col-lg-1 col-md-1 col-sm-1" />
                </div>
                <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-7" />
                    <div className="col-lg-5 col-md-5 col-sm-5">
                        <div className="input-group">
                            <label htmlFor="Total" style={{ width: '120px' }}>Total($)</label>
                            <input type="text" className="form-control" id="Total" placeholder="Total" disabled
                            value={this.props.uivalues.TotalAmount}  />
                        </div>
                    </div>
                    <div className="col-lg-1 col-md-1 col-sm-1" />
                </div>
                <br />
                <div className="row">
                    <div className="col-lg-8 col-md-8 col-sm-8" />
                    <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-success" style={{ marginRight: '10px' }} onClick={() => { this.props.saveTransaction(); }}>Pay Now</div>
                            <div typeof="button" className="btn btn-success" onClick={() => {this.RedirectToHome() }}>Cancel</div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

private RedirectToHome = () => { this.props.history.push("/"); }

private formattedDate()
  {
    let d:Date = this.props.uivalues.TransactionDate;
    return  d.getFullYear() + "-" +  this.pad((d.getMonth() +1 ), 2) + "-" + this.pad((d.getDate() +1 ), 2) 

  }

  private pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
}

export default connect(
  (state: ApplicationState) => state.transactions, // Selects which state properties are merged into the component's props
  TransactionsStore.actionCreators // Selects which action creators are merged into the component's props
)(Transactions as any);
