import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as SalesDetailsStore from '../store/SalesDetails';

// At runtime, Redux will merge together...
type SalesDetailsProps =
    SalesDetailsStore.SalesDetailsState // ... state we've requested from the Redux store
    & typeof SalesDetailsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class SalesDetails extends React.PureComponent<SalesDetailsProps> {
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h2 id="tabelLabel" className="text-center">View Sales and Transactions</h2>
                <div className="container">
                    {this.renderSearchOptions()}
                    {this.renderSearchTable()}
                    {/* {this.renderPagination()} */}
                </div>
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        //this.props.requestUsers(startDateIndex);
    }

    private renderSearchOptions() {
        return (
            <div className="Container">
                <hr />
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.triggerGetSalesDetails((this.props.match.params.startDateIndex, 10) || 0); }}>View Sales</div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.triggerGetTransactionDetails((this.props.match.params.startDateIndex, 10) || 0); }}> View Transactions</div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    private renderSearchTable() {
        return (
            <div>
                <h2 className="text-center">{this.props.isSalesVisible ? "Sales Details" : "Transaction Details"}</h2>
                <table className='table table-striped' aria-labelledby="tableLabel">
                    <thead className="thead-dark">

                        { this.props.isSalesVisible  ?
                            <tr>
                                <th>SalesId</th>
                                <th>SalesDetailsId</th>
                                <th>MemberId</th>
                                <th>FirstName</th>
                                <th>SalesDateTime</th>
                                <th>ReceiptNumber</th>
                                <th>DiscountAmount</th>
                                <th>TotalBillAmount</th>
                                <th>ProductId</th>
                                <th>ProductNumber</th>
                                <th>ProductName</th>
                                <th>Quantity</th>
                                <th>TotalPrice</th>
                            </tr>
                            :
                            <tr>
                                <th>Transaction Id</th>
                                <th>TransactionDate</th>
                                <th>TotalAmount</th>
                                <th>Payment Type</th>
                                <th>TransactionStatus</th>
                            </tr>}
                    </thead>
                    {this.props.isSalesVisible ?
                        <tbody>

                            {this.props.sales.map((SaleItem: SalesDetailsStore.SalesAndDetail) =>
                                <tr>
                                    <td>{SaleItem.SalesId}</td>
                                    <td>{SaleItem.SalesDetailsId}</td>
                                    <td>{SaleItem.MemberId}</td>
                                    <td>{SaleItem.FirstName}</td>
                                    <td>{SaleItem.SalesDateTime}</td>
                                    <td>{SaleItem.ReceiptNumber}</td>
                                    <td>{SaleItem.DiscountAmount}</td>
                                    <td>{SaleItem.TotalBillAmount}</td>
                                    <td>{SaleItem.ProductId}</td>
                                    <td>{SaleItem.ProductNumber}</td>
                                    <td>{SaleItem.ProductName}</td>
                                    <td>{SaleItem.Quantity}</td>
                                    <td>{SaleItem.TotalPrice}</td>
                                </tr>
                            )}
                        </tbody>
                        :
                        <tbody>
                            {this.props.transactionDetails.map((TransactionDetails: SalesDetailsStore.Transaction) =>
                                <tr>
                                    <td>{TransactionDetails.TransactionId}</td>
                                    <td>{TransactionDetails.TransactionDate}</td>
                                    <td>{TransactionDetails.TotalAmount}</td>
                                    <td>{TransactionDetails.PaymentType}</td>
                                    <td>{TransactionDetails.TransactionStatus}</td>
                                </tr>
                            )
                            }
                        </tbody>
                    }
                </table>
            </div>
        );
    }

    private formattedFromDate() {
        let d: Date = this.props.uivalues.FromDate;
        return d.getFullYear() + "-" + this.pad((d.getMonth() + 1), 2) + "-" + this.pad((d.getDate() + 1), 2)
    }

    private formattedToDate() {
        let d: Date = this.props.uivalues.ToDate;
        return d.getFullYear() + "-" + this.pad((d.getMonth() + 1), 2) + "-" + this.pad((d.getDate() + 1), 2)
    }

    private pad(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
}

export default connect(
    (state: ApplicationState) => state.salesDetails, // Selects which state properties are merged into the component's props
    SalesDetailsStore.actionCreators // Selects which action creators are merged into the component's props
)(SalesDetails as any);
