import React, {  } from 'react';


class Student extends React.Component {

   
  constructor(props) {
    super(props);
if (this.props.messfrom==="") {
  this.state = {
    messfrom: this.props.messfrombefore,
    personalMess: "",
    oldMess:this.props.messfrombefore
  }
}
else
    this.state = {
      messfrom: this.props.messfrom,
      personalMess: "",
    oldMess: this.props.messfrom
    }
    
}

  async Skicka(mess,name) {
   
   // alert( this.props.messfrom);
      let response =await fetch("http://localhost:3000/larare/"+this.props.classname, {
        method: 'PATCH',	
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
        Meddelande: mess,
        To: name,	 
        })

    });

      if (!response.ok) {
        return
      }
   
      let students = await response.json()
      
      this.setState({ messfrom: mess })
      console.log(students);


  }

  componentWillReceiveProps() 
  {
    if (this.state.oldMess!==this.props.messfrom && "" !==this.props.messfrom) {
      console.log( "Bytt "+this.state.oldMess+this.props.messfrom);
      this.setState({ messfrom:  this.props.messfrom,
        oldMess: this.props.messfrom

      });

    }
      
  }
    render() {
      return (
        <div  onClick={() => this.Skicka(this.props.personalmess,this.props.name)} className="Student" id={this.props.status}>
          <h1  > {this.props.name}</h1>
         <h3 >  {this.state.messfrom}</h3>
         <h4>  {this.props.mess}</h4>
         <h4> Steg: {this.props.steg}</h4>
        </div>
      );
    }
  }
  
  export default Student;