import './App.css';
import Navigation from "./components/Navigation/Navigation"
import Logo from "./components/Logo/Logo"
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from './components/SignIn/SignIn';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Component } from 'react';
import Clarifai from 'clarifai';
import Register from './components/Register/Register';

const app = new Clarifai.App({
 apiKey: 'd09adfaf7e3e4f289c8dce4bc6c04507'
});

const particleOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 150,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      random: false,
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 1100,
      },
      value: 80,
    },
    opacity: {
      value: 0.4,
    },
  },
  detectRetina: true,
}; 
const particlesInit = async (main) => {
  // this loads the tsparticles package bundle
  await loadFull(main);
};


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow:  clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  loadUser = (data) => {
    this.setState({
      user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  onButtonSubmit = (event) => {
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response)) 
      })
      .catch(err => console.log(err));
  }

  render() {
      return (
        <div className="App">
          <Particles id="tsparticles"
            init={particlesInit}
            options={ particleOptions}
            />
           <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          {this.state.route === 'home' 
            ?  <>
                <Logo /> 
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
              </>
            : (this.state.route === "signin" 
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
        </div>
      );
  }
}

export default App;
