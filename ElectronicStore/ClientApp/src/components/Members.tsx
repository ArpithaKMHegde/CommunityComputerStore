import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as MembersStore from '../store/Members';

// At runtime, Redux will merge together...
type MemberProps =
  MembersStore.MembersState // ... state we've requested from the Redux store
  & typeof MembersStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class Members extends React.PureComponent<MemberProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }


  public render() {
    return (
      <React.Fragment>
        <h2 id="tabelLabel" className="text-center">Member Entry</h2>
        <div className="container">
            {this.renderMemberAddEdit()}
            {this.renderMembersTable()}
            {/* {this.renderPagination()} */}
          </div>
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
    this.props.requestMembers(startDateIndex);
    }

    private renderMemberAddEdit() {
        return (
            <div className="Container">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="MemberId">Member Identifier</label>
                            <input type="text" className="form-control" id="MemberId" placeholder="0-9" disabled value={this.props.uivalues.MemberId} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="FirstName">First Name</label>
                            <input type="text" className="form-control" id="FirstName" placeholder="First Name" value={this.props.uivalues.FirstName} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="LastName">Last Name</label>
                            <input type="text" className="form-control" id="LastName" placeholder="Last Name" value={this.props.uivalues.LastName} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="Address">Address</label>
                            <input type="text" className="form-control" id="Address" placeholder="Address" value={this.props.uivalues.Address} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <br />
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="EmailId">Email</label>
                            <input type="email" className="form-control" id="EmailId" placeholder="email@Address.exn" value={this.props.uivalues.EmailId} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="ContactNumber">Contact Number</label>
                            <input type="text" className="form-control" id="ContactNumber" placeholder="+0-9" value={this.props.uivalues.ContactNumber} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="StartDate">Start Date</label>
                            <input type="date" className="form-control" id="StartDate" placeholder="Start Date" value={this.props.uivalues.StartDate} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="EndDate">End Date</label>
                            <input type="date" className="form-control" id="EndDate" placeholder="End Date" value={this.props.uivalues.EndDate} onChange={(event) => { this.props.memberValueChange(event.target.id, event.target.value); }} />
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
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.triggerAddOrEdit(); }}>{this.props.uivalues.MemberId === 0 ? "Add" : "Update"}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.selectItem(0); }}>Clear</div>
                        </div>
                    </div >
                </div>
                <hr />
            </div>
        );
    }

    private renderMembersTable() {
        return (
            <div>
                <h2 className="text-center">Members List</h2>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead className="thead-dark">
                        <tr>
                            <th>Member Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.members.map((Member: MembersStore.Member) =>
                            <tr key={Member.MemberId}>
                                <td><a style={{cursor:'pointer', fontWeight:'bold'}} onClick={() => { this.props.selectItem(Member.MemberId); }}>{Member.MemberId}</a></td>
                                <td>{Member.FirstName}</td>
                                <td>{Member.LastName}</td>
                                <td>{Member.Address}</td>
                                <td>{Member.EmailId}</td>
                                <td>{Member.ContactNumber}</td>
                                <td>{Member.StartDate}</td>
                                <td>{Member.EndDate}</td>
                                <td>
                                    <div className="col-lg-3 col-md-3 col-sm-12">
                                        <div className="form-group center-block">
                                            <div typeof="button" className="btn btn-primary btn-lg" onClick={(event) => { this.props.triggerMemberDelete(Member.MemberId); }}>Delete</div>
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
  (state: ApplicationState) => state.members, // Selects which state properties are merged into the component's props
  MembersStore.actionCreators // Selects which action creators are merged into the component's props
)(Members as any);
