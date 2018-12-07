import React from "react";
import { Link } from "react-router";

export default class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: '',
       };
  }
  onSubmit(event){
    event.preventDefault();
    this.setState({
      error: "Something went wrong."
    })
  }
  render() {
    return (
      <div>
        <h1>Singup component here</h1>

        {this.state.error ? <p>{this.state.error}</p>: undefined}
        
        
        <Link to="/">Already have an acount? </Link>
      <form onSubmit={this.onSubmit.bind(this)}>
      <input type="email" name="email" placeholder="Email" required="true"/>
      <input type="password" name="password" placeholder="Password" required="true"/>
      <button> Create Account</button>
      
      </form>
        </div>
    );
  
}}