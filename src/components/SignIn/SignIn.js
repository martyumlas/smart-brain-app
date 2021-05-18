import React from 'react'

export default class SignIn extends React.Component {

    state = {
        signInEmail : '',
        signInPassword : '',
        error: ''
    }

    onEmailChange = (event) => {
      this.setState({signInEmail: event.target.value})
    }
    
    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    onSubmitSignIn = (e) => {
        e.preventDefault()
        this.setState({error: ''})
        fetch('https://afternoon-harbor-82707.herokuapp.com/signin', {
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                email : this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(res => res.json())
        .then(user => {
            if(user.id) {
                localStorage.setItem('user', JSON.stringify(user))
                this.props.loadUser()
                this.props.onRouteChange('home')

            } else {
                this.setState({error: user})
            }
        }).catch(e => console.log(e))
    }
  
    render() {

        const {onRouteChange} = this.props

        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure" onSubmit={this.onSubmitSignIn}>
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <p style={{'color' :'red'}}> {this.state.error}</p>
                           
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" required onChange={this.onEmailChange} type="email" name="email-address"  id="email-address"/>
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" onChange={this.onPasswordChange} id="password"/>
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in"/>
                        </div>
                        <div className="lh-copy mt3">
                            <p  className="f6 link dim black db pointer" onClick={() => onRouteChange('register')}>Register</p>
                        </div>
                    </form>
                </main>
            </article>
        )
    }
   
}
