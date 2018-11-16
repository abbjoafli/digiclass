import React, { } from 'react';


class Helplist extends React.Component {


    constructor(props) {
        super(props);
        this.PersonHelped = this.PersonHelped.bind(this);
        this.state = {
            name: this.props.name,
            yourname: this.props.yourname,
            names: [],
            steg: [],
            amount: 0,
            activeIndex: 0,//SKA GÖRAS KLART!
            remove: 9999,
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(  this.intervalID);
     }
intervalID=0;
    async componentDidMount() {
        this.hamta()

        //Titta om det finns några nya elever eller nya statusar varje 15 sekund
        try {
           this.intervalID= setInterval(async () => {
                this.hamta();


            }, 25000);
        } catch (e) {
            console.log(e);
        }


    }

    async hamta() {

        fetch("http://localhost:3000/help/"+this.state.name)
            .then(res => res.json())
            .then(
                (responses) => {


                    var names = [];
                    var steg = [];
                    var arr = responses.parts;

                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        names.push(element.Namn);
                        steg.push(element.steg);
                    }


                    this.setState({ names: names, steg: steg, amount: responses.parts.length });
                 
                },
                (error) => {
                    console.log(error);
                })
    }

    handleClick = (name) => this.PersonHelped(name)
    // //Removes from the helplist
    PersonHelped(Name) {
        var adress = "http://localhost:3000/help/" + this.state.name + "&" + Name;

        fetch(adress, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
            .then(res => res.json())
            .then(
                (result) => {
this.hamta();
                },
                (error) => {
                    console.log(error);
                })
    }

    CreateParts() {

        var rows = [], i = 0, len = this.state.names.length;
        while (++i <= len) rows.push(i);
        return (
            <div id="insidebox">
                {
                    rows.map((i) => {
                        
                            return <Del key={this.state.names[i - 1]}
                        
                            isActive={ this.state.activeIndex === i }
                            onClick={this.PersonHelped}
                            number={i} steg={this.state.steg[i - 1]} Removehandler={this.PersonHelped} name={this.state.names[i - 1]}   ></Del>;
                      
                    })}
            </div>
        );

    }

    render() {
        return (
            <div id="box" >

                <h3>Hjälpkö [{this.state.amount}] </h3>

                {this.CreateParts()
                }
            </div>
        );
    }
}

class Del extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            number: this.props.number,
            name: this.props.name,
            steg: this.props.steg,
        }
    }
    handleClick = () => this.props.onClick(this.props.name)
    handleClick = () => this.props.onClick(this.props.name)
    componentWillReceiveProps() 
    {
        this.setState({ number:  this.props.number});

    }
    render() {
        return (
            <div className="stepOne"  id={
                this.props.isActive ? 'choosen' : 'notchoosen'
              }
            >

                <div className="input-field">
                    <h4 id="namn"> {this.state.name} </h4>
                    <label htmlFor="namn">Plats {this.state.number}</label>
                    <div className="row">
                        <div className="col s6"> <h5>Steg: {this.state.steg} </h5></div>
                        <div className="col s6">  <p onClick={this.handleClick} className="btn-floating btn-large waves-effect waves-light red lighten-1"><i className="material-icons">remove</i></p>
                        </div>

                    </div>
                </div>


            </div>
        );
    }
}

export default Helplist;