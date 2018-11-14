import React, { } from 'react';


class Statestik extends React.Component {


    constructor(props) {
        super(props);
        this.changeSelectPerson = this.changeSelectPerson.bind(this);
        this.state = {
            name: this.props.name,
            fromBackend: "",
            SelectPerson:"",
            chartData: [
                
            ],
            chartOptions: {}
        }
    }

    async componentDidMount() {
        this.hamta()

        //Titta om det finns några nya elever eller nya statusar varje 15 sekund
        try {
            setInterval(async () => {
                this.hamta();


            }, 25000);
        } catch (e) {
            console.log(e);
        }


    }

    async hamta() {
        fetch("http://localhost:3000/board/"+this.state.name)
            .then(res => res.json())
            .then((responses) => {

                console.log(responses.parts);
                    this.setState({ fromBackend: responses.parts });
                 
                },
                (error) => {
                    console.log(error);
                })
    }

    changeSelectPerson(Name){

var AllValues= this.state.fromBackend;
var ChartValues=[];
 AllValues.forEach(element => {
     if (element.Name===Name) {
         var lab=element.Status;
         var color = "#F7464A";
         var highlight="#FF5A5E";
         if (lab==="green") {
            color= "#00cc00";
            highlight= " #ccffcc";
         }
         else if (lab==="yellow") {
            color= "#FDB45C";
            highlight= "#FFC870";
         }
         var Newdata=   {
            value: 300,
            color:color,
            highlight: highlight,
            label: lab
        }
         ChartValues.push(Newdata);
     }
 });
this.setState({SelectPerson: Name,
    chartData:ChartValues,
chartOptions: {
	//Boolean - Show a backdrop to the scale label
	scaleShowLabelBackdrop : true,

	//String - The colour of the label backdrop
	scaleBackdropColor : "rgba(255,255,255,0.75)",

	// Boolean - Whether the scale should begin at zero
	scaleBeginAtZero : true,

	//Number - The backdrop padding above & below the label in pixels
	scaleBackdropPaddingY : 2,

	//Number - The backdrop padding to the side of the label in pixels
	scaleBackdropPaddingX : 2,

	//Boolean - Show line for each value in the scale
	scaleShowLine : true,

	//Boolean - Stroke a line around each segment in the chart
	segmentShowStroke : true,

	//String - The colour of the stroke on each segment.
	segmentStrokeColor : "#fff",

	//Number - The width of the stroke value in pixels
	segmentStrokeWidth : 2,

	//Number - Amount of animation steps
	animationSteps : 100,

	//String - Animation easing effect.
	animationEasing : "easeOutBounce",

	//Boolean - Whether to animate the rotation of the chart
	animateRotate : true,

	//Boolean - Whether to animate scaling the chart from the centre
	animateScale : false,
}


});
console.log(this.state.SelectPerson);


    }


    CreateStudentsbuttons() {

        var rows = [], i = 0, len = this.state.fromBackend.length;
        var names =[]
        while (++i <= len) rows.push(i);
        return (
            <div id="insidebox">
                {
                    rows.map((i) => {
                        var add=true;
                        names.forEach(element => {
                         if (this.state.fromBackend[i-1].Name=== element) {
                            add= false;
                            
                        } 
                        });
                        if(add===true)
                         {
                            names.push(this.state.fromBackend[i-1].Name);
                            return <button // key={this.state.names[i - 1]}
                            className="btn waves-effect waves-light pink lighten-2" 
                            //isActive={ this.state.activeIndex === i }
                            onClick={() => {this.changeSelectPerson(this.state.fromBackend[i-1].Name)}}
                          
                            //number={i}  Removehandler={this.PersonHelped} name={this.state.names[i - 1]}  
                             >{this.state.fromBackend[i-1].Name}</button>;
                      
                    }
                }
                )}

            </div>
        );

    }

    render() {
        return (

            <div  >

                         <button className="btn waves-effect waves-light green lighten-2"  type="submit"  onClick={this.props.action}>
            Stäng Statistik
            </button>
                {this.CreateStudentsbuttons()
                }
                <PieChart data={this.state.chartData} options={this.state.chartOptions}/>
            </div>
        );
    }
}

var PieChart = require("react-chartjs").Pie;

// var PieCharter = React.createClass({
//   render: function() {
//     return <PieChart data={chartData} options={chartOptions}/>
//   }
// });
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

export default Statestik;