import React, {Component } from 'react';
import { Loading } from './LoadingComponent';
import { Input, Button ,Jumbotron , Label, Modal, ModalBody, ModalHeader, Form, FormGroup, Row, Col} from 'reactstrap';
import {Link} from 'react-router-dom';

class Account extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpenStaff: false ,
        }

        this.toggleModalStaff = this.toggleModalStaff.bind(this);
        this.handleSubmitStaff = this.handleSubmitStaff.bind(this);
    }

    toggleModalStaff () {
        this.setState({
            isModalOpenStaff: !this.state.isModalOpenStaff
        });
    }

    

    

    handleSubmitStaff() {
        this.toggleModalStaff();

        var ob= {
            firstname:this.firstname.value, 
            lastname:this.lastname.value,
            username: this.username.value, 
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
        
            fetch('/account/addstaff', {
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
            .catch(error => {alert("Failed to create Staff: ",error)});
    

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

            var accounts = this.props.accounts
            if(this.props.accounts) {
                console.log(this.props.accounts)

                const items = []

                for(var i=0;i<accounts.length;i++) {
                    items.push(
                                <div class="card text-center">
                                <div class="card-header">
                                    {accounts[i].username}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">{accounts[i].firstname + " " + accounts[i].lastname}</h5>
                                    <p class="card-text">Earned : {accounts[i].earned}</p>
                                    <Link to={`/accounts/${accounts[i].username}`}>
                                        <Button className="btn btn-primary" >
                                            View Accounts
                                        </Button>
                                    </Link>
                                    
                                </div>
                                </div>
                    )
                }

                    return(
                        <div className="container">
                            <br></br> <br></br>
                            
                            <div class="text-center">
                                <Button className="btn btn-lg" color="primary" outline onClick={this.toggleModalStaff}>
                                    Create Staff
                                </Button>
                            </div>     
                            <br></br> <br></br>
                            <div>
                                 {items}
                            <br></br> <br></br>
                            </div>   

                            <Modal isOpen={this.state.isModalOpenStaff} toggle={this.toggleModalStaff}>
                            <ModalHeader toggle={this.toggleModalStaff}>Create Staff</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label htmlFor="firstname">First Name</Label>
                                        <Input type="text" id="firstname" name="firstname"
                                            innerRef={(input) => this.firstname = input} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="lastname">Last Name</Label>
                                        <Input type="text" id="lastname" name="lastname"
                                            innerRef={(input) => this.lastname = input}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="username">Username</Label>
                                        <Input type="text" id="username" name="username"
                                            innerRef={(input) => this.username = input} />
                                    </FormGroup>
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
                                    <Button  onClick={this.handleSubmitStaff} type="button"  value="submit" color="primary">Create</Button>
                                </Form>
                            </ModalBody>
                            </Modal>




                            

                            </div>
                    );
                        
                    


                }
            
     
        }
    }
}

export default Account;