import React, { Component } from 'react';
import { registerUser } from '../../actions/user_actions';
import { connect } from 'react-redux';

class Register extends Component {

    state = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    displayErrors = (errors) =>
      errors.map((error, index) => <p key={index}>{error}</p>);

    isFormValid = () => {
      let errors = [];
      let error;

      if(this.isFormEmpty(this.state)) {
        error = { message: "Fill in all the fields" };
        this.setState({ errors: errors.concat(error) })
      } else if (!this.isPasswordValid(this.state)) {
        error = { message: "Password is invalid"};
        this.setState({ errors: errors.concat(error)});
      } else {
        return true;
      }
    }

    isPasswordValid = ({ password, confirmPassword }) => {
      if(password.length < 6 || confirmPassword.length < 6) {
        return false;
      } else if (password !== confirmPassword) {
        return false;
      } else {
        return true;
      }
    }

    isFormEmpty = ({ firstname, lastname, email, password, confirmPassword }) => {
      return (
        !firstname.length ||
        !lastname.length ||
        !email.length ||
        !password.length ||
        !confirmPassword.length 
      );
    }

    submitForm = (event) => {
      event.preventDefault();
  
      let dataToSubmit = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      }
      

      if(this.isFormValid()) {
        this.setState({ errors: [] })
        this.props.dispatch(registerUser(dataToSubmit))
        .then(response => {
          console.log(response);
          if(response.payload.success) {
            this.props.history.push('/login')
          } else {
            this.setState({
              errors: this.state.errors.concat("Your attempt to send dtata to DB was failed")
            })
          }
        })
        .catch(err => {
          this.setState({
            errors: this.state.errors.concat(err)
          });
        })
      } else {
        console.error("Form is not valid")
      }

    }
    
    render() {
        return (

            <div className="container">
            <h2>Sign Up</h2>
        
            <div className="row">
          <form
            action=""
            className="col s9"
            onSubmit={(event) => this.submitForm(event)}
          >
            <div className="row">
              <div className="input-field col s9">
                <input
                  name="firstname"
                  value={this.state.firstname}
                  onChange={(e) => this.handleChange(e)}
                  id="firstname"
                  type="text"
                  className="validate"
                />
                <label htmlFor="email">Firstname</label>
                <span
                  className="helper-text"
                  data-error="Enter a valid type email"
                  data-success="right"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s9">
                <input
                  name="lastname"
                  value={this.state.lastname}
                  onChange={(e) => this.handleChange(e)}
                  id="lastname"
                  type="text"
                  className="validate"
                />
                <label htmlFor="password">Lastname</label>
                <span
                  className="helper-text"
                  data-error="wrong"
                  data-success="right"
                />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s9">
                <input
                  name="email"
                  value={this.state.email}
                  onChange={(e) => this.handleChange(e)}
                  id="email"
                  type="email"
                  className="validate"
                />
                <label htmlFor="email">Email</label>
                <span
                  className="helper-text"
                  data-error="Enter a valid type email"
                  data-success="right"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s9">
                <input
                  name="password"
                  value={this.state.password}
                  onChange={(e) => this.handleChange(e)}
                  id="password"
                  type="password"
                  className="validate"
                />
                <label htmlFor="password">Password</label>
                <span
                  className="helper-text"
                  data-error="wrong"
                  data-success="right"
                />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s9">
                <input
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={(e) => this.handleChange(e)}
                  id="confirmPassword"
                  type="password"
                  className="validate"
                />
                <label htmlFor="password">Confirm Password</label>
                <span
                  className="helper-text"
                  data-error="wrong"
                  data-success="right"
                />
              </div>
            </div>

            {this.state.errors.length > 0 && (
              <div>{this.displayErrors(this.state.errors)}</div>
            )}

            <div className="row">
              <div className="col s6">
                <button
                  className="btn waves-effect red lighter-2"
                  type="submit"
                  name="action"
                  onClick={this.submitForm}
                >
                  Create account
                </button>
              </div>
            </div>
          </form>
        </div>
        </div>
        )
    }
}

export default connect()(Register);
