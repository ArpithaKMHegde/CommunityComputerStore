import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';

// At runtime, Redux will merge together...
type UserProps =
  UsersStore.UsersState // ... state we've requested from the Redux store
  & typeof UsersStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class Users extends React.PureComponent<UserProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

    public render() {
        return (
            <React.Fragment>
                <h2 id="tabelLabel" className="text-center">User Entry</h2>
                <div className="container">
                    {this.renderUserAddEdit()}
                    {this.renderUsersTable()}
                    {/* {this.renderPagination()} */}
                </div>
            </React.Fragment>
        );
    }

  private ensureDataFetched() {
    const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
    this.props.requestUsers(startDateIndex);
    }

  private renderUserAddEdit() {
    return (
      <div className="Container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="form-group">
                  <label htmlFor="UserId">User Identifier</label>
                  <input type="text" className="form-control" id="UserId" placeholder="0-9" disabled value={this.props.uivalues.UserId}  />
              </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="form-group">
                  <label htmlFor="UserName">User Name</label>
                  <input type="text" className="form-control" id="UserName" placeholder="User Name" value={this.props.uivalues.UserName} onChange={(event) => { this.props.userValueChange(event.target.id, event.target.value); }}/>
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
                        <div typeof="button" className="btn btn-secondary btn-block" onClick={(event) => { this.props.triggerAddOrEdit(); }}>{this.props.uivalues.UserId === 0 ? "Add" : "Update"}</div>
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

    private renderUsersTable() {
        return (
            <div>
                <h2 className="text-center">Users List</h2>
                <table className='table table-striped' aria-labelledby="tableLabel">
                    <thead className="thead-dark">
                        <tr>
                            <th>User          Id</th>
                            <th>User        Name</th>
                            <th> Delete </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.map((User: UsersStore.User) =>
                            <tr key={User.UserId}>
                                <td><a style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={(event) => { this.props.selectItem(User.UserId); }}>{User.UserId}</a></td>
                                <td>{User.UserName}</td>
                                <td>
                                    <div className="col-lg-3 col-md-3 col-sm-12">
                                        <div className="form-group center-block">
                                            <div typeof="button" className="btn btn-primary btn-lg" onClick={(event) => { this.props.triggerUserDelete(User.UserId); }}>Delete</div>
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
  (state: ApplicationState) => state.users, // Selects which state properties are merged into the component's props
  UsersStore.actionCreators // Selects which action creators are merged into the component's props
)(Users as any);
