import React, { Component } from 'react'
import Navigation from './components/Navigation'
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/rank/Rank'
import Particles from 'react-particles-js'
import './App.css'
import Clarifai from 'clarifai'
import FaceRecognition from './components/facerecognition/FaceRecognition'

const app = new Clarifai.App({
  apiKey: 'de319c321b4a441ea089c8fee08832d4'
 });

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


export class App extends Component {
   state = {
    input: '',
    imageUrl: '',
    boxes: []
  }

  onImageChange = (e) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      this.setState({imageUrl: e.target.result})
    }
    reader.readAsDataURL(e.target.files[0])
  }




  onInputChange = (e) => {
    this.setState({input: e.target.value})

  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        // console.log(response.outputs[0].data)
        this.setState({boxes: response.outputs[0].data})

     
      })
      .catch(error => {
        // There was an error
      });
  }
  render() {
    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation/>
        <Logo/>
        <Rank/>
        <input type="file" name="" id="" onChange={this.onImageChange}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl}/>



      </div>
    )
  }
}

export default App
