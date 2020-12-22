import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import register from '../registerServiceWorker';
import { ApplicationState } from '../store';
import * as ProductsStore from '../store/Products';

// At runtime, Redux will merge together...
type ProductProps =
  ProductsStore.ProductsState // ... state we've requested from the Redux store
  & typeof ProductsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class Products extends React.PureComponent<ProductProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
            <h2 id="tableLabel" className="text-center">Product Entry</h2>
        <div className="container">
            {this.renderProductsAddEdit()}
            {this.renderProductsTable()}
            {/* {this.renderPagination()} */}
          </div>
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
    this.props.requestProducts(startDateIndex);
    }

    private renderProductsAddEdit() {
        return (
            <div className="Container">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ProductId">Product Identifier</label>
                            <input type="text" className="form-control" id="ProductId" placeholder="0-9" disabled value={this.props.uivalues.ProductId} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ProductNumber">Product Number</label>
                            <input type="text" className="form-control" id="ProductNumber" placeholder="A-Za-z0-9" value={this.props.uivalues.ProductNumber} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ProductName">Product Name</label>
                            <input type="text" className="form-control" id="ProductName" placeholder="eg. Laptop, desktop" value={this.props.uivalues.ProductName} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ProductDescription">Product Description</label>
                            <input type="text" className="form-control" id="ProductDescription" placeholder="eg. Hard disk size, RAM" value={this.props.uivalues.ProductDescription} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <br />
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ProductName">Brand</label>
                            <input type="text" className="form-control" id="Brand" placeholder="Brand Name" value={this.props.uivalues.Brand} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="MemberId">Member Id</label>
                            <input type="text" className="form-control" id="MemberId" placeholder="0-9" value={this.props.uivalues.MemberId} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ProductName">Price Per Unit ($)</label>
                            <input type="text" className="form-control" id="PricePerUnit" placeholder="Price of a product" value={this.props.uivalues.PricePerUnit} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="Quantity">Quantity</label>
                            <input type="text" className="form-control" id="Quantity" placeholder="0-9" value={this.props.uivalues.InitialQuantity} onChange={(event) => { this.props.productValueChange(event.target.id, event.target.value); }} />
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
                <hr />
                <div className="row">
                    <div className="col-lg-2 col-md-2 col-sm-12"/>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.triggerAddOrEdit(); }}>{this.props.uivalues.ProductId === 0? "Add":"Update"}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.clearFilterItems(); }}>Clear</div>
                        </div>
                    </div >
                </div>
                <hr />
            </div>
        );
    }

    private renderProductsTable() {
        return (
            <div>
            <h2 className="text-center">Products List</h2>
            <table className='table table-striped' aria-labelledby="tableLabel">
                <thead className="thead-dark">
                    <tr>
                        <th>Product Id</th>
                        <th>Product Number</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Brand</th>
                        <th>Supplier Id</th>
                        <th>Unit Price($)</th>
                        <th>Initial Quantity</th>
                        <th>Remaining Quantity</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.UiProducts.map((Product: ProductsStore.Product) =>
                        <tr key={Product.ProductId}>
                            <td><a style={{cursor:'pointer', fontWeight:'bold'}} onClick={() => { this.props.selectItem(Product.ProductId); }}>{Product.ProductId}</a></td>
                            <td>{Product.ProductNumber}</td>
                            <td>{Product.ProductName}</td>
                            <td>{Product.ProductDescription}</td>
                            <td>{Product.Brand}</td>
                            <td>{Product.MemberId}</td>
                            <td>{Product.PricePerUnit}</td>
                            <td>{Product.InitialQuantity}</td>
                            <td>{Product.RemainingQuantity}</td>
                            <td>
                                <div className="col-lg-3 col-md-3 col-sm-12">
                                    <div className="form-group center-block">
                                        <div typeof="button" className="btn btn-primary btn-lg" onClick={() => { this.props.triggerDelete(Product.ProductId); }}>Delete</div>                                       
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

}

export default connect(
  (state: ApplicationState) => state.products, // Selects which state properties are merged into the component's props
  ProductsStore.actionCreators // Selects which action creators are merged into the component's props
)(Products as any);
