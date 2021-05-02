import React, {Component } from 'react';
import { Loading } from './LoadingComponent';
import { Input, Button ,Jumbotron , Label, Modal, ModalBody, ModalHeader, Form, FormGroup, Row, Col} from 'reactstrap';
import {Link} from 'react-router-dom';


class AccountData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpenStaff: false ,
            accountData: [],
        }

        this.toggleModalStaff = this.toggleModalStaff.bind(this);
        this.handleSubmitStaff = this.handleSubmitStaff.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }



    handleDate() {
        var arr=[]
        var month=document.getElementById("month").value;
        var year=document.getElementById("year").value;
        var k=this.props.account.flow.length;
        var flow = this.props.account.flow;

       

        for(var i=0;i<k;i++) {
            if(flow[i].month==month && flow[i].year==year) {
                arr.push(flow[i])
                let { accountData } = this.state;
                accountData.push(flow[i]);
            }
        }

        if(arr.length==0) {
            this.setState({
                accountData : []
            })
        }

        else 
        this.setState({
            accountData : [...this.state.accountData]
        })

        console.log(this.state.accountData, arr);

    }
    

    toggleModalStaff () {
        this.setState({
            isModalOpenStaff: !this.state.isModalOpenStaff
        });
    }


    handleSubmitStaff() {
        this.toggleModalStaff();

        var ob= {
            initialReading:this.initialReading.value,
            finalReading: this.finalReading.value, 
            cash: this.cash.value,
            online: this.online.value,
            duesIn:this.duesIn.value, 
            duesOut:this.duesOut.value,
            tokenIn: this.tokenIn.value, 
            tokenOut: this.tokenOut.value,
        };

            const bearer = 'Bearer ' + localStorage.getItem('token');
            console.log("fetch");
        
            fetch(`/account/staff/${this.props.accounts[0].username}`, {
                method: 'POST',
                headers: { 
                    'Content-Type':'application/json' ,
                    'Authorization': bearer
                },
                body: JSON.stringify(ob),
                credentials: 'same-origin'
            })
            .then(response => {
                console.log("res staff",response);
                if (response.ok) {
                    console.log("success");
                    return response;
                } else {
                    console.log("err1");
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
                },
                error => {
                    console.log("Err",error);
                    throw error;
                })
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    alert(response.msg);
                }
             })
            .catch(error => {alert("Failed to add account: ",error)});
    

    }

    render() {
        
                      
        if(this.props.isLoading || this.props.accounts.isLoading) {
            console.log("loading")
            return(
                <Loading />
            );
        }
    
        else if (this.props.errMess) {
            console.log("error")
            return(
                <h4>{this.props.errMess}</h4>
            );
        }
        
        else            
        {
            
            if(this.props.account) {
                console.log(this.props.account)
                var account = this.props.accounts[0]

                return(
                    <div className="container">
                        <h1>{account.firstname + " " + account.lastname}</h1>
                        <br></br>
                        <Button color="primary" outline onClick={this.toggleModalStaff}>
                            Add Account
                        </Button>
                        <br></br>
                        <h5>Submit Month and Year</h5>
                        <Input type="number" id="month" name="month"></Input>
                        <Input type="number" id="year" name="year"></Input>
                        <Button color="primary" outline onClick={this.handleDate}>
                            View
                        </Button>
                        

                        {
                            this.state.accountData.length>0 ? 
                            
                            <div>
                                <table className="table table-striped  table-responsive">
                                <thead>
                                    <tr>
                                    <th>Date(yyyy/mm/dd)</th>
                                    <th>Initial Reading</th>
                                    <th>Final Reading</th>
                                    <th>Expected Total</th>
                                    <th>Cash</th>
                                    <th>Online</th>
                                    <th>Dues Received</th>
                                    <th>Dues Given </th>
                                    <th>Net Dues</th>
                                    <th>Token Received</th>
                                    <th>Token Given</th>
                                    <th>Received Total</th>
                                    <th>Error</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.accountData.reverse().map(product => {
                                    return  (
                                    <tr key={product.fid}>
                                        <td>{(product.date).substring(0,10)}</td>
                                        <td>{product.initialReading}</td>
                                        <td>{product.finalReading}</td>
                                        <td>{product.expectedTotal}</td>
                                        <td>{product.cash}</td>
                                        <td>{product.online}</td>
                                        <td>{product.duesIn}</td>
                                        <td>{product.duesOut}</td>
                                        <td>{product.netDues}</td>
                                        <td>{product.tokenIn}</td>
                                        <td>{product.tokenOut}</td>
                                        <td>{product.receivedTotal}</td>
                                        <td>{product.error}</td>
                                    </tr>
                                    );
                                    
                                    })}
                                </tbody>
                                </table>
                            </div> 
                            
                            : <div><h2>No Data Available</h2></div>
                        }

                        <br></br> <br></br> <br></br> <br></br>

                        <Modal isOpen={this.state.isModalOpenStaff} toggle={this.toggleModalStaff}>
                            <ModalHeader toggle={this.toggleModalStaff}>Add Account</ModalHeader>
                            <ModalBody>
                                <Form>
                                    
                                    <FormGroup>
                                        <Label htmlFor="initialReading">Initial Reading</Label>
                                        <Input type="number" id="initialReading" name="initialReading"
                                            innerRef={(input) => this.initialReading = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="finalReading">Final Reading</Label>
                                        <Input type="number" id="finalReading" name="finalReading"
                                            innerRef={(input) => this.finalReading = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="cash">Cash</Label>
                                        <Input type="number" id="cash" name="cash"
                                            innerRef={(input) => this.cash = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="online">Online</Label>
                                        <Input type="number" id="online" name="online"
                                            innerRef={(input) => this.online = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="duesIn">Dues Received</Label>
                                        <Input type="number" id="duesIn" name="duesIn"
                                            innerRef={(input) => this.duesIn = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="duesOut">Dues Given</Label>
                                        <Input type="number" id="duesOut" name="duesOut"
                                            innerRef={(input) => this.duesOut = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="tokenIn">Token Received</Label>
                                        <Input type="number" id="tokenIn" name="tokenIn"
                                            innerRef={(input) => this.tokenIn = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="tokenOut">Token Given</Label>
                                        <Input type="number" id="tokenOut" name="tokenOut"
                                            innerRef={(input) => this.tokenOut = input}  />
                                    </FormGroup>
                                    <Button  onClick={this.handleSubmitStaff} type="button"  value="submit" color="primary">Add</Button>
                                </Form>
                            </ModalBody>
                            </Modal>
                        
                    </div>
                );
            }
     
        }
    }
}

export default AccountData;