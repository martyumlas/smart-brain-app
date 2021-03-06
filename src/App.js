import React, { Component } from 'react'
import Navigation from './components/Navigation'
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/rank/Rank'
import Particles from 'react-particles-js'
import './App.css'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import FaceRecognition from './components/facerecognition/FaceRecognition'


const particlesOptions = {
  particles:{
    number:{
      value: 30,
      density:{
        enable: true,
        value_area:300
      }
    }
  }
}

const initialState = {

  user:   {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

 class App extends Component {
   state = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: JSON.parse(localStorage.getItem('isSignedIn')),
    user: JSON.parse(localStorage.getItem('user')),
  } 


  loadUser = () => {
    this.setState({user : JSON.parse(localStorage.getItem('user'))})  
  } 
  onImageChange = (e) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      this.setState({imageUrl: e.target.result, input: e.target.result})
    }
    reader.readAsDataURL(e.target.files[0])
  }


  calculateFaceLocation = (data) => {
      const face = data.outputs[0].data.regions[0].region_info.bounding_box
      const image = document.getElementById('inputImage')
      const width = Number(image.width)
      const height = Number(image.height)
      return {
        left: face.left_col * width,
        top: face.top_row * height,
        right: width - (face.right_col * width),
        bottom: height - (face.bottom_row * height)
      }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (e) => {
    e.preventDefault()
    this.setState({input: e.target.value, imageUrl : e.target.value})
  }
  onButtonSubmit = (e) => {
    e.preventDefault()
    this.setState({imageUrl: this.state.input})

      fetch('https://afternoon-harbor-82707.herokuapp.com/imageUrl', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          input : this.state.input,
        })
      }).then(response => response.json())      
      .then(response => {
        
        //send this to express

        if(response) {
          fetch('https://afternoon-harbor-82707.herokuapp.com/image', {
              method: 'PUT',
              headers: {'Content-Type' : 'application/json'},
              body: JSON.stringify({
                id : this.state.user.id,
              })
          })
          .then(res => res.json())
          .then(count => {

            let loggedInUser = JSON.parse(localStorage.getItem('user'));
            loggedInUser.entries = parseInt(count);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            this.setState(Object.assign(this.state.user, {entries : count}))
          })
        }


        this.displayFaceBox(this.calculateFaceLocation(response))

        console.log(this.state.box)
      })
      .catch(error => {
        console.log(error)
      });
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      localStorage.setItem('user', JSON.stringify(initialState.user))
      localStorage.setItem('isSignedIn', false)   
      this.setState({isSignedIn: JSON.parse(localStorage.getItem('isSignedIn')), imageUrl : ''})
    } else if(route === 'home') {
      localStorage.setItem('isSignedIn', true)   
      this.setState({isSignedIn: JSON.parse(localStorage.getItem('isSignedIn'))})
    } 
   

    this.setState({route: route})
  }

  render() {
   const {isSignedIn, imageUrl, route, box} = this.state


    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {
       isSignedIn ?
        <div>
          <Logo/>
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          {/* <input type="file" name="" id="" onChange={this.onImageChange} /> */}
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition imageUrl={imageUrl} box={box}/>
        </div>

        : ( route === 'signin' ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> )
        }
      </div>
    )
  }
}

export default App
