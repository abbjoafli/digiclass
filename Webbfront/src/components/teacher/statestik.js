import React, { } from 'react';


class Statestik extends React.Component {


    constructor(props) {
        super(props);
        this.changeSelectPerson = this.changeSelectPerson.bind(this);
        this.state = {
            name: this.props.name,
            fromBackend: "",
            SelectPerson:"",
            color:[],
            amount:0,
            chartData: [       ],
            chartOptions: {}
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
            this.intervalID =   setInterval(async () => {
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
var ChartValues=[];var color=[];
var yellow=0;var green=0;var red=0;
 AllValues.forEach(element => {
     if (element.Name===Name) {
         //Red
         red++;
         var lab=element.Status;
         var color = "#F7464A";
         var highlight="#FF5A5E";
         if (lab==="green") {
             green++;
            color= "#00cc00";
            highlight= " #ccffcc";
         }
         else if (lab==="yellow") {
             yellow++;
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
 color[0]=red;
 color[1]=yellow;
 color[2]=green;
 var amount=green+red+yellow;

this.setState({SelectPerson: Name,
    color: color,
    amount: amount,
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
            <div id="">
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
//Highligta den som är vald! Lägg till tiden på varje del i pajen!, Lägg till start stop tid för att kunna ta bort resultat.
//Ha ett annat diagram för steg eller över tiden.  
<div  >

                         <button className="btn waves-effect waves-light green lighten-2"  type="submit"  onClick={this.props.action}>
            Stäng Statistik
            </button>
                {this.CreateStudentsbuttons()
                }
                <h2>{this.state.SelectPerson}</h2>
                <h3>Antal skiften: {this.state.amount}</h3>
                <div className="col s4">
                <span>Röda: {this.state.color[0]}</span>
                <span> Gula: {this.state.color[1]}</span>
                <span> Gröna: {this.state.color[2]}</span>
                </div>
                
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

export default Statestik;