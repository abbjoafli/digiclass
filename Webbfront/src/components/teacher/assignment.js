import React, { } from 'react';


class Assignment extends React.Component {


  constructor(props) {
    super(props);
    // this.handleChangeComp = this.handleChangeComp.bind(this);
    this.state = {
      name: this.props.name,
      PostOrPatch: 'POST',

      headlines: [],
      texts: [],
      amount: 0,
      uppgifter: "Uppgifter"
    }
  }

  handleChangeComp = (number, headline, text) => {

    number -= 1;

    var temp = this.state.texts;
    temp[number] = text;

    var temp2 = this.state.headlines;
    temp2[number] = headline;
    this.setState({

      texts: temp,
      headlines: temp2,
      uppgifter: "Spara"
    });


  }

  componentDidMount() {
    fetch("http://localhost:3000/uppgifter/" + this.state.name)
      .then(res => res.json())
      .then(
        (result) => {
          if ("Assignment fetched" === result.message) {



            let ntexts = []; let nheads = [];
            for (let index = 0; index < result.parts.length; index++) {
              nheads.push(result.parts[index].Headline); ntexts.push(result.parts[index].Text);
            }
            this.setState({
              texts: ntexts,
              headlines: nheads,
              amount: result.parts.length,
              PostOrPatch: "PATCH"
            });
          }
        },
        (error) => {
          console.log(error);
        })
  }

  handleChange(input, value) {
    if (value !== "") { // fundera på denna 
      //lägg in uppgfit till spara .

      let ntexts = []; let nheads = [];
      for (let index = 0; index < value; index++) {
        if (this.state.texts[index] !== null || this.state.texts[index] !== "") {
          nheads.push(this.state.headlines[(index)]); ntexts.push(this.state.texts[(index)]);
        }
        else {
          ntexts.push(""); nheads.push("");
        }
      }
      this.setState({
        amount: value,
        texts: ntexts,
        headlines: nheads
      });
    }
    else {
      this.setState({
        amount: value
      });
    }

  }

  async Skicka() {


    var PostOrPatch = this.state.PostOrPatch;

    let response = await fetch("http://localhost:3000/uppgifter/", {
      method: PostOrPatch,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        headlines: this.state.headlines,
        texts: this.state.texts,
      })

    });

    if (!response.ok) {
      return
    }

    let output = await response.json()

    this.setState({ PostOrPatch: "PATCH" })
    console.log(output);


  }




  CreateParts() {

    var rows = [], i = 0, len = this.state.amount;
    while (++i <= len) rows.push(i);
    return (
      <div id="insidebox">
        {
          rows.map((i) => {
            return <Del number={i} key={i} text={this.state.texts[i - 1]} headline={this.state.headlines[i - 1]} handleChangeComp={this.handleChangeComp}   ></Del>;
          })}
      </div>
    );

  }

  render() {
    return (
      <div id="box" >
        <h3 id={this.state.uppgifter} onClick={() => this.Skicka()}  > {this.state.uppgifter}</h3>
        <div >
          <input id="first_name" type="text" className="amount" value={this.state.amount} onChange={(e) => this.handleChange("amount", e.target.value)} />
          <label htmlFor="first_name">Antal delar</label>
        </div>

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
      class: ["", ""]
    }
  }


  componentDidMount() {
    var temp = this.state.class;
    if (this.state.headline !== undefined)
      temp[0] = "active";
    if (this.state.text !== undefined)
      temp[1] = "active";

    this.setState({
      class: temp
    });

  }

  handleChange2(input, value) {
    if (input === "text") {
      this.setState({
        text: value
      });
    }
    else if (input === "headline") {
      this.setState({
        headline: value
      });
    }

    this.props.handleChangeComp(this.state.number, this.state.headline, this.state.text);
  }




  render() {
    return (
      <div className="stepOne">
        <h5>Del {this.state.number}</h5>
        <div className="input-field col s6">
          <input id="first_name" type="text" className="validate" value={this.state.headline} onChange={(e) => this.handleChange2("headline", e.target.value)} />
          <label className={this.state.class[0]} htmlFor="first_name">Rubrik</label>
        </div>
        <div className="input-field col s6">
          <input id="first_name" type="text" className="validate" value={this.state.text} onChange={(e) => this.handleChange2("text", e.target.value)} />
          <label className={this.state.class[1]} htmlFor="first_name">Text</label>
        </div>
      </div>
    );
  }// render  onChange={(e) =>this.handleChangeComp("headline",e.target.value)} this.props.onChangeValue(this.state.number, this.state.headline, this.props.text)
} // end of component onChange={(e) =>this.handleChangeComp("text",e.target.value)}

export default Assignment;