import React, {  } from 'react';
import './student.css';
import Assignment from './assignment.js';

import Interval from 'react-interval-rerender';

export const Clock = () => (
  <Interval delay={1000}>
    {() => new Date().toLocaleTimeString()}
  </Interval>
)

class Studentview extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
         name: "",
         start: true,
         classname: "",
         classStatus: "action-button shadow animate blue",
         Meddelande:"",
         messfrom:"",
         students:[],
         steg: 0,
         hidOrshow:"hid",
         uppgopen:"Öppna",
         statusbutt: "Status"
       };
   }

   onSethidOrshow() 
   {
     if (this.state.hidOrshow==="hid") {
       
     this.setState({  uppgopen:"Stäng", hidOrshow: "show", statusbutt:"Status2" });
     }
     else
     this.setState({uppgopen:"Öppna",  hidOrshow: "hid" , statusbutt:"Status"});
   }
//När de uppdaterar sin text så ska den typ varje halvminut pusha den till servern, den ska samtidigt hämta lärarens meddelande.

    async LoginCheck() {
   let Old =  await this.CheckifExist();
      if (!Old) {
           let response =await fetch("http://localhost:3000/skapa/"+this.state.classname, {
            method: 'POST',	
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              },
            body: JSON.stringify({
            name: this.state.name
            })
    
        });
    
          if (!response.ok) {
            return
          }
       
          let students = await response.json()
          if(students.message==="Failure")
            {
                alert("Felaktigt angivet klassnamn.");

            }
            else
            {
                this.setState({
                    start: false
                });

            }
        }


      }




      componentWillUnmount() {
     
         window.removeEventListener('beforeunload', this.handleWindowClose);


    };



      async componentDidMount() {
        window.addEventListener('beforeunload', (ev) => 
        {  
          alert("Alerted Browser Close");
          var adress="http://localhost:3000/elev/logout/"+this.state.classname+"&"+ this.state.name;

          fetch(adress, {
          method: 'PATCH',	
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            }
          
          });
            ev.preventDefault();
            return ev.returnValue = 'Are you sure you want to close?';
        });
        try {
          setInterval(async () => {this.CheckifExist();
            }, 15000);
        } catch(e) {
          console.log(e);
        }
  }




    async CheckifExist() {
        let response = await fetch("http://localhost:3000/elev/"+this.state.classname+"&"+ this.state.name);
        if (!response.ok) { 
          return
        }
    
        let student = await response.json()
        //console.log(student);
  if (student[0].Namn===this.state.name) {
    if (this.state.start===true) {
      this.Skicka("");
    }
    this.setState({ messfrom: student[0].Meddelandefrom, steg: student[0].steg ,  start: false });
   
    return true;
  }
     return false;
      }


      async Skicka(color) {
      
      //var status = this.refs.status;
      if(color==="red")
      this.setState({
        classStatus: "action-button shadow animate red"
    }); 
    else if(color==="yellow")
    this.setState({
      classStatus: "action-button shadow animate yellow"
  });
  else if(color==="green")
  this.setState({
    classStatus: "action-button shadow animate green"
});

var adress="http://localhost:3000/elev/"+this.state.classname+"&"+ this.state.name;
//console.log(adress);
let response =await fetch(adress, {
method: 'PATCH',	
  headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  },
body: JSON.stringify({
Status: color,
Meddelande: this.state.Meddelande,	 
})
});
if (!response.ok) {
  return
}
//let output = await response.json();
//console.log(output);
    }
    
    handleChange(input, value) {
        if (input==="classname") {
            this.setState({
                classname: value
            });
        }
        else if (input==="name") {
            this.setState({
                name: value
            });
        }
       else 
       this.setState({
            Meddelande: value
        });

      }
    



  
    render() {
       
        if (this.state.start===true) {
            return ( 

            

                    <div className="row">
                <div className="input-field col s6">
                  <input placeholder="" id="first_name" type="text" className="validate" value={this.state.classname} onChange={(e) =>this.handleChange("classname",e.target.value)}/>
                  <label htmlFor="first_name">Klassnamn</label>
                </div>
                <div className="input-field col s6">
                <input id="password" type="text" className="validate"  value={this.state.pass} onChange={(e) =>this.handleChange("name",e.target.value)} />
          <label htmlFor="password">Namn</label>
          <button className="btn waves-effect waves-light" type="submit" onClick={() => this.LoginCheck()}  name="action">Anslut  </button>
                </div>
              </div>
                  );
        }
        else if (!this.state.start) {
            return (
              <div className="ProductList">

  <div >
        <button className="btn waves-effect waves-light" id="uppg1" type="submit" onClick={() => this.onSethidOrshow()}>
          {this.state.uppgopen} uppgifter
        </button>
        <div id={this.state.hidOrshow}>
          <Assignment yourname={this.state.name} name={this.state.classname} steg={this.state.steg}></Assignment>
        </div>
        </div>

  <p id={this.state.statusbutt} className={this.state.classStatus}></p>
                <div className="ProductList-container">

                <Interval delay={1000}>
    {() => new Date().toLocaleTimeString()}
                </Interval>
                
            

                <div className="input-field col s5">
                <h5 id="topmess">Meddelande från {this.state.classname}:</h5>
               
                <h2 id="bottmess">{this.state.messfrom}</h2>
                </div>
                <div className="input-field col s6">
                
                <input type="text" id="message"   onChange={(e) =>this.handleChange("Meddelande",e.target.value)} />
                <label htmlFor="message">Meddelande</label>
                </div>
           <p  className="action-button shadow animate red" onClick={() => this.Skicka("red")}>Dåligt</p>
  <p className="action-button shadow animate yellow" onClick={() => this.Skicka("yellow")} >Sådär</p>
  <p className="action-button shadow animate green" onClick={() => this.Skicka("green")} >Bra</p>

             
                </div>
              </div>
            );
          }
      else
          return (<h2 className="ProductList-title">Waiting for API...</h2>);
        }
      }
  export default Studentview;