import React, { } from 'react';
import Student from './Student.js';
import './teach.css';
import Assignment from './assignment.js';
import Helplist from './helplist.js';
import Statestik from './statestik.js';
import RandomUser from './RandomUser.js';

var crypto = require('crypto');
class Students extends React.Component {

  constructor(props) {
    super(props);
    
    this.CloseStatics = this.CloseStatics.bind(this); 
    this.state = {
      start: true,
      loading: true,
      openStatestik:false,
      pass: "",
      students: [],
      classname: "",
      messfrom: "",
      Workmessfrom: "",
      hidOrshow: ["hid","hid"],
      knappopen: ["Öppna","Öppna"],
      render: "render",
      Uppgift: []
    };
  }

  onSethidOrshow(knapp) {
    var i=0;
    if (knapp === "help") {
      i=1;
    }
    else if(knapp === "uppg")
    i=0;
    var values=this.state.hidOrshow;
var openClosed = this.state.knappopen;
    if (this.state.hidOrshow[i] === "hid") {
values[i] = "show";
openClosed[i] = "Stäng";
    }
    else if (this.state.hidOrshow[i] === "show")
    {
      values[i] = "hid";
openClosed[i] =  "Öppna";
    }
      this.setState({ knappopen: openClosed, hidOrshow: values });


  }
  async Regaccount() {

    if (this.state.classname !== "" && this.state.pass !== "") {

      let Password = crypto.createHash('md5').update(this.state.pass).digest('hex');
      console.log(Password);
      let response = await fetch("http://localhost:3000/skapa/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.classname,
          pass: Password,

        })

      });

      if (!response.ok) {
        return
      }

      let students = await response.json()
      this.ConnectEnd(students.message);
    }
    else
      alert("Fyll i samtliga uppgifter");

  }

  ConnectEnd(message) {

    if (message === "Failure") {
      alert("Fel Klassnamn eller lösenord");

    }
    else {
      this.setState({
        start: false
      });
      this.getfromdb();
    }
  }


  async LoginCheck() {
    if (this.state.classname !== "" && this.state.pass !== "") {

      let Password = crypto.createHash('md5').update(this.state.pass).digest('hex');
      console.log(Password);
      let response = await fetch("http://localhost:3000/larare/" + this.state.classname, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Pass: Password,

        })

      });

      if (!response.ok) {
        return
      }

      let students = await response.json()
      this.ConnectEnd(students.message);
    }
    else
      alert("Fyll i samtliga uppgifter");


  }


  async getfromdb() {

    let response = await fetch("http://localhost:3000/larare/" + this.state.classname);
    if (!response.ok) {
      return
    }
    //lägg till failure grejen här med, 
    let students = await response.json();

    console.log(this.state.students);
    if (students.length !== 0) {
      this.setState({ loading: false, students: students })
    }
    else
      this.setState({ loading: false, students: [] })

  }

  async  Getupgift() {
    fetch("http://localhost:3000/uppgifter/")
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            Uppgift: result.parts
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);

        }
      )
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    console.log("hejdå!");
    clearInterval(  this.intervalID);
 }

  intervalID=0;

  async StartStudentTimer() {
    try {
      this.intervalID= setInterval(async () => {
        this.getfromdb();
      }, 15000); //15 sek
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount() {
    this.StartStudentTimer();
    //Titta om det finns några nya elever eller nya statusar varje 15 sekund
  
  }

  async Skicka() {
    let response = await fetch("http://localhost:3000/larare/" + this.state.classname, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Meddelande: this.state.messfrom,
      })

    });

    if (!response.ok) {
      return
    }
    //let output = await response.json();
 
    this.setState({ messfrom: this.state.Workmessfrom });

  }



  handleChange(input, value) {
    if (input === "classname") {
      this.setState({
        classname: value
      });
    }
    else if (input === "pass") {
      this.setState({
        pass: value
      });
    }
    else
      this.setState({
        Workmessfrom: value
      });
  }



  CreateStudents() {
    if (this.state.students.length !== 0|| this.state.students!=null) {

      return this.state.students.map((student, index) => {
        return (
          <Student key={student.Namn} steg={student.steg} name={student.Namn} personalmess={this.state.Workmessfrom} messfrombefore={student.Meddelandefrom} classname={this.state.classname} messfrom={this.state.messfrom} mess={student.Meddelande} status={student.Status} />

        );
      })
    }
  }

  showSettings(event) {
    event.preventDefault();

  }

  CloseStatics() {
    
    this.StartStudentTimer();
    this.setState({
        openStatestik: false
    });
}

shower(){// gör om så det inte ser buggigt ut
  if (this.state.hidOrshow[0]=="show" && this.state.hidOrshow[1]=="show") {
    return (<div> <div id={this.state.hidOrshow[0]}>
      <Assignment uppgifter={this.state.uppgifter} name={this.state.classname}></Assignment>
    </div>
    <div id={this.state.hidOrshow[1]}>
    <Helplist uppgifter={this.state.uppgifter}  name={this.state.classname}       />
    </div></div>
        );
      }
 else if (this.state.hidOrshow[0]=="show") {
    return ( <div id={this.state.hidOrshow[0]}>
  <Assignment uppgifter={this.state.uppgifter} name={this.state.classname}></Assignment>
</div>
    );
  }
  else if (this.state.hidOrshow[1]=="show"){
    return (<div id={this.state.hidOrshow[1]}>
      <Helplist uppgifter={this.state.uppgifter}  name={this.state.classname}       />
      </div>);

  }

}


  render() {

    if (this.state.start) {
      return (
        <div className="row">
          <div className="input-field col s6">

            <input id="first_name" type="text" className="validate" value={this.state.classname} onChange={(e) => this.handleChange("classname", e.target.value)} />
            <label htmlFor="first_name">First Name</label>
          </div>
          <div className="input-field col s6">
            <input id="password" type="password" className="validate" value={this.state.pass} onChange={(e) => this.handleChange("pass", e.target.value)} />
            <label htmlFor="password">Password</label>
            <button className="btn waves-effect waves-light" id="distance" type="submit" onClick={() => this.LoginCheck()} name="action">Logga in
  </button>
            <button className="btn waves-effect waves-light" type="submit" onClick={() => this.Regaccount()} name="action">Regga
  </button>
          </div>
        </div>


      );
    }
    else if (this.state.openStatestik) {
      return ( <Statestik action={this.CloseStatics} name={this.state.classname}></Statestik>);
    }
    else if (!this.state.loading) {
      return (
        <div className="ProductList">
          <div className="buttons">
          <button className="btn waves-effect waves-light green lighten-2"  type="submit" onClick={() => this.setState({openStatestik: true })}>
        Öppna Statistik
        </button>
            <button className="btn waves-effect waves-light teal darken-1"  type="submit" onClick={() => this.onSethidOrshow("uppg")}>
              {this.state.knappopen[0]} uppgifter
        </button>
        <button className="btn waves-effect waves-light red lighten-2"  type="submit" onClick={() => this.onSethidOrshow("help")}>
        {this.state.knappopen[1]} Hjälpkö 
        </button>
        {this.shower()}
           
             
           
          </div>
          {this.state.students.length  > 1 &&
          <RandomUser students={this.state.students} ></RandomUser>
          }
          <h2 className="ProductList-title">Elever i klassrummet: ({this.state.students.length})</h2>
          <div className="ProductList-container">
            <input type="text" value={this.state.Workmessfrom} onChange={(e) => this.handleChange("Workmessfrom", e.target.value)} />
            <button className="btn waves-effect waves-light" type="submit" onClick={() => this.Skicka()}> Skicka till alla </button>

            <div id="render" >
              <div className='SidebySide'>
                {
                  this.CreateStudents()
                }</div>
            </div>
          </div>
        </div>
      );
    }

    return (<h2 className="ProductList-title">Waiting for API...</h2>);
  }
}




export default Students;