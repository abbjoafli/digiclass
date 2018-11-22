import React, { } from 'react';
import { Pie, Line } from 'react-chartjs-2';

class Statestik extends React.Component {


    constructor(props) {
        super(props);
        this.changeSelectPerson = this.changeSelectPerson.bind(this);
        this.state = {
            name: this.props.name,
            fromBackend: "",
            SelectPerson: "",
            color: [],
            amount: 0,
            chartData: {
                labels: [],
                datasets: [{
                    data: []
                }]
            }
            ,
            barData: {
                labels: [],
                datasets: [
                    {

                    }
                ]
            },
            chartOptions: {}
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.intervalID);
    }
    intervalID = 0;
    async componentDidMount() {
        this.hamta()

        //Titta om det finns några nya elever eller nya statusar varje 15 sekund
        try {
            this.intervalID = setInterval(async () => {
                this.hamta();


            }, 25000);
        } catch (e) {
            console.log(e);
        }


    }

    async hamta() {
        fetch("http://localhost:3000/board/" + this.state.name)
            .then(res => res.json())
            .then((responses) => {

                console.log(responses.parts);
                this.setState({ fromBackend: responses.parts });

            },
                (error) => {
                    console.log(error);
                })
    }

    changeSelectPerson(Name) {

        var AllValues = this.state.fromBackend;
        var color = [];
        var yellow = 0; var green = 0; var red = 0;
        let count = 0;
        var RelevantValues = [];
        AllValues.forEach(element => {
            if (element.Name === Name) {
                RelevantValues.push(element);
            }
        });
        let Tottime = 0; let Seclist = [];
        RelevantValues.forEach(element => {
            let temp = this.ToSec(element.Time);
            Tottime += temp;
            Seclist.push(temp);
        });
        const colortimes = [0, 0, 0];//Red ,yellow, green
        const labels = [];
        const data = [];
        const backgroundColor = [];
        const hoverBackgroundColor = []
        let formercolor = 0;
        //FOR Bardata
        RelevantValues.forEach(element => {
            let same = false;
            var lab = element.Time;
            var color = "#F7464A";
            var highlight = "#FF5A5E";
            if (element.Status === "green") {
               // green++;
                color = "#00cc00";
                highlight = " #ccffcc";
            }
            else if (element.Status === "yellow") {
                color = "#FDB45C";
                highlight = "#FFC870";
            }
            var Newdata = {
                value: Seclist[count],
                color: color,
                highlight: highlight,
                label: lab
            }

            if (count > 0)
                if (RelevantValues[count - 1].Status === RelevantValues[count].Status) {
                    same = true;
                }

            if (same === true) {
                colortimes[formercolor] += Seclist[count];
                data[data.length - 1] += Seclist[count];
                labels[labels.length - 1] = this.AddingUpTime(labels[labels.length - 1], lab);
            }
            else {
                if (element.Status === "yellow") {
                    yellow++; formercolor = 1;
                }
                else if (element.Status === "green") { green++; formercolor = 2; }
                else { red++; formercolor = 0; }

                colortimes[formercolor] += Seclist[count];

                data.push(Newdata.value);
                backgroundColor.push(Newdata.color);
                hoverBackgroundColor.push(Newdata.highlight);
                labels.push(Newdata.label);
            }

            count++;

        });
        //For steg, linechart
        let dataline=[];
        let labelline=[];count=0;
        RelevantValues.forEach(element => {
            let same = false;
           

            if (count > 0)
                if (RelevantValues[count - 1].Step === RelevantValues[count].Step) {
                    same = true;
                }

            if (same === true) {
                dataline[dataline.length - 1] += Seclist[count];
            }
            else {
               

                colortimes[formercolor] += Seclist[count];

                dataline.push(Seclist[count]);
                labelline.push("Steg "+element.Step);
                // hoverBackgroundColor.push(Newdata.highlight);
                // labels.push(Newdata.label);
            }

            count++;

        });

        const exdata = {
            labels: labels,
            datasets: [{
                data: dataline,
                backgroundColor: backgroundColor,
                hoverBackgroundColor: hoverBackgroundColor
            }]
        };
        
        const linedata = {
            labels: labelline,
            datasets: [{
                label: 'Sek',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                data: dataline
            }]
        };

        for (let index = 0; index < colortimes.length; index++) {
            const element = colortimes[index];
            element = (element / Tottime) * 100;
            element = element.toString().split(".");
            element = element[0];
            colortimes[index] = element;
        }
        color[0] = red + " (" + colortimes[0] + "%)";
        color[1] = yellow + " (" + colortimes[1] + "%)";
        color[2] = green + " (" + colortimes[2] + "%)";
        var amount = (green + red + yellow) + " (" + this.Totime(Tottime) + ")";

   

        let barData = {
            labels: ['Steg 1', 'Steg 2', 'Steg 3'],
            datasets: [
                {
                    
                    data: [65, 59, 80]
                }
            ]
        };
        //   var  data= {
        //         labels: ["January", "February", "March", "April", "May", "June", "July"],

        //         xLabels: [0, 10, 5, 2, 20, 30, 45],
        //         yLabels: [0, 10, 5, 2, 20, 30, 45]
        //     }

        this.setState({
            SelectPerson: Name,
            color: color,
            amount: amount,
            barData: linedata,
            chartData: exdata,
            chartOptions: {
                //Boolean - Show a backdrop to the scale label
                scaleShowLabelBackdrop: true,
                legend: {
                    display: false
                },
                //String - The colour of the label backdrop
                scaleBackdropColor: "rgba(255,255,255,0.75)",

                // Boolean - Whether the scale should begin at zero
                scaleBeginAtZero: false,

                //Number - The backdrop padding above & below the label in pixels
                scaleBackdropPaddingY: 2,

                //Number - The backdrop padding to the side of the label in pixels
                scaleBackdropPaddingX: 2,

                //Boolean - Show line for each value in the scale
                scaleShowLine: true,

                //Boolean - Stroke a line around each segment in the chart
                segmentShowStroke: true,

                //String - The colour of the stroke on each segment.
                segmentStrokeColor: "#fff",

                //Number - The width of the stroke value in pixels
                segmentStrokeWidth: 2,

                //Number - Amount of animation steps
                animationSteps: 100,

                //String - Animation easing effect.
                animationEasing: "easeOutBounce",

                //Boolean - Whether to animate the rotation of the chart
                animateRotate: true,

                //Boolean - Whether to animate scaling the chart from the centre
                animateScale: false,
            }


        });

    }

    Totime(sec) {
        let SMH = 1;
        let hour = 0;
        let min = 0;
        while (sec > 60) {
            min++;
            sec -= 60;
            SMH = 2;
        }
        while (min > 60) {
            hour++;
            min -= 60;
            SMH = 3;
        }
        sec = this.AddAZero(sec);
        min = this.AddAZero(min);
        hour = this.AddAZero(hour);

        console.log(hour + ":" + min + ":" + sec);
        if (SMH == 3) {
            return hour + ":" + min + ":" + sec;
        }
        else if (SMH == 2) {
            return min + ":" + sec;
        }
        return sec + "s";
    }

    ToSec(time1) {
        let time1s = time1.split(":");
        let hour = parseInt(time1s[0]);
        let min = parseInt(time1s[1]);
        let sec = parseInt(time1s[2]);
        sec += hour / 3600;
        sec += min / 60;
        return sec;
    }

    AddAZero(input) {
        input = input.toString().split(".");
        input = input[0];
        if (input.toString().length == 1) {
            return "0" + input;
        }
        else
            return input.toString().substring(0, 2);

    }

    AddingUpTime(time1, time2) {
        let time1s = time1.split(":");
        let time2s = time2.split(":");
        let hour = parseInt(time1s[0]) + parseInt(time2s[0]);
        let min = parseInt(time1s[1]) + parseInt(time2s[1]);
        let sec = parseInt(time1s[2]) + parseInt(time2s[2]);

        if (sec > 60) {
            min++;
            sec = sec - 60;
        }
        if (min > 60) {
            hour++;
            min = min - 60;
        }
        sec = this.AddAZero(sec);
        min = this.AddAZero(min);
        hour = this.AddAZero(hour);


        return hour + ":" + min + ":" + sec;

    }

    CreateStudentsbuttons() {

        var rows = [], i = 0, len = this.state.fromBackend.length;
        var names = []
        while (++i <= len) rows.push(i);
        return (
            <div id="">
                {
                    rows.map((i) => {
                        var add = true;
                        names.forEach(element => {
                            if (this.state.fromBackend[i - 1].Name === element) {
                                add = false;

                            }
                        });
                        if (add === true) {
                            names.push(this.state.fromBackend[i - 1].Name);
                            return <button // key={this.state.names[i - 1]}
                                className="btn waves-effect waves-light pink lighten-2"
                                //isActive={ this.state.activeIndex === i }
                                onClick={() => { this.changeSelectPerson(this.state.fromBackend[i - 1].Name) }}

                            //number={i}  Removehandler={this.PersonHelped} name={this.state.names[i - 1]}  
                            >{this.state.fromBackend[i - 1].Name}</button>;

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
            <div className="row">

                <button className="btn waves-effect waves-light green lighten-2" type="submit" onClick={this.props.action}>
                    Stäng Statistik
            </button>
                {this.CreateStudentsbuttons()
                }
                <div >
                    <h2 className="col s6">{this.state.SelectPerson}</h2>
                    <h3 className="col s6">Antal skiften: {this.state.amount}</h3>
                </div>
                <div>
                    <span className="col s4">Röda: {this.state.color[0]}</span>
                    <span className="col s4"> Gula: {this.state.color[1]}</span>
                    <span className="col s4">  Gröna: {this.state.color[2]}</span>
                </div>
                <div className="col s12">
                    <div className="col s6">
                        <Pie data={this.state.chartData} options={this.state.chartOptions} />
                    </div>
                    <div className="col s6">
                        <Line data={this.state.barData} options={this.state.chartOptions} />
                    </div>
                </div>




            </div>
        );
    }
}
// var LineChart = require("react-chartjs").Line; 
// var PieChart = require("react-chartjs").Pie;
// var PieCharter = React.createClass({
//   render: function() {
//     return <PieChart data={chartData} options={chartOptions}/>
//   }
// });

export default Statestik;