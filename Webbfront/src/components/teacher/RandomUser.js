import React, { } from 'react';
import './teach.css';

class RandomUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name:""
        }
    }

    handleClick = () => this.GetStudent()
    GetStudent(){
            console.log(this.props.students.length + "längd " +this.props.students )
        let students= this.props.students;
        let randnummer= Math.floor(Math.random()*students.length);
let name =students[randnummer].Namn;//random(this.state.names.length);
        this.setState({name: name});
    }

    render() {
        return (

                <div className="input-field">
                    <div className="row randbox">   <p  onClick={() => this.GetStudent()}  className="btn waves-effect waves-light red lighten-1"><i >Slumpa elev: {this.state.name} </i></p>
                        {/* <h5>Namn: {this.state.name} </h5> */}
                        {/* </div> */}

                    </div>
                </div>
        );
    }
}

export default RandomUser;