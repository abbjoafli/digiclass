import React, { } from 'react';


class Assignment extends React.Component {


  constructor(props) {
    super(props);
    // this.handleChangeComp = this.handleChangeComp.bind(this);
    this.state = {
      name: this.props.name,
      yourname: this.props.yourname,
      headlines: [],
      texts: [],
      amount: 0,
      activeIndex: this.props.steg,
    }
  }

  handleClick = (index) => this.Skicka(index)

  async Skicka(index) {
    var formersteg = this.state.activeIndex;
    let response = await fetch("http://localhost:3000/uppgifter/" + this.state.name, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        steg: index,
        formersteg: formersteg,
        yourname: this.state.yourname
      })
    });

    if (!response.ok) {
      return
    }
    this.setState({ activeIndex: index });
    let output = await response.json()
    console.log(output);
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
    let response = await fetch("http://localhost:3000/uppgifter/" + this.state.name);
    if (!response.ok) {
      return
    }
    let responses = await response.json();
    var heads = [];
    var texts = [];
    var arr = responses.parts;

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      heads.push(element.Headline);
      texts.push(element.Text);
    }


    this.setState({ headlines: heads, texts: texts, amount: responses.parts.length });


  }


  CreateParts() {

    var rows = [], i = 0, len = this.state.amount;
    while (++i <= len) rows.push(i);

    return (
      <div id="insidebox">
        {
          rows.map((i) => {
            return <Del
              index={i} key={i}
              isActive={this.state.activeIndex === i}
              onClick={this.handleClick}
              number={i} text={this.state.texts[i - 1]} headline={this.state.headlines[i - 1]}   ></Del>;
          })}
      </div>
    );

  }

  render() {
    return (
      <div id="box" >

        <h3>Antal delar {this.state.amount} </h3>

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
      headline: this.props.headline,
      text: this.props.text,
    }
  }
  handleClick = () => this.props.onClick(this.props.index)



  render() {
    return (
      <div className="stepOne" id={
        this.props.isActive ? 'choosen' : 'notchoosen'
      }
        onClick={this.handleClick}
      >
        <h4>Del {this.state.number} {this.state.headline} </h4>
        <h5>{this.state.text} </h5>

      </div>
    );
  }
}

export default Assignment;