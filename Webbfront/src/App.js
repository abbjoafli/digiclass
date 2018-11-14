import React, { Component } from 'react';
import logo from './logo.svg';
import Students from './components/teacher/Students'
import './App.css';
import Studentview from './components/student/studentview';





class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
        screen:1//1=start, 2= lärare , 3=elever
     
    }
}

gotoElev(){
  this.setState({screen: 3});
}
gotoLarare(){
  this.setState({screen: 2});
}

  render() {
    if (this.state.screen===1) {
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      
      <h2 className="startknapp" onClick={() => this.gotoElev()}>Elever</h2>
      <h2 className="startknapp" onClick={() => this.gotoLarare()}>Lärare</h2>        
      
      </header>
    </div>
    )
  }
  else  if (this.state.screen===2) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        
        <Students></Students>

          
        
        </header>
      </div>
    );
  }
  else 
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        
        <Studentview/>

          
        
        </header>
      </div>
    );
  }
}



export default App;
