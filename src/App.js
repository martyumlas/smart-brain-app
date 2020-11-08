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
    box: {}
  }

  onImageChange = (e) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      this.setState({imageUrl: e.target.result})
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
    this.setState({input: e.target.value})

  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response))

        console.log(this.state.box)
      })
      .catch(error => {
        console.log(error.response.data)
      });
  }
  render() {
    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation/>
        <Logo/>
        <Rank/>
        <input type="file" name="" id="" onChange={this.onImageChange} />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    )
  }
}

export default App
