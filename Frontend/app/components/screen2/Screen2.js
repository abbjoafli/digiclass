import React from 'react';
import { 
    StyleSheet,
    View,Text,
} from 'react-native';

import Component7 from './Component7';
import Component11 from './Component11';

export default class Screen2 extends React.Component {

    constructor(props) {
        //console.log(props);
        super(props);

        this.state = {
            classname: this.props.navigation.state.params.classname,
            name: this.props.navigation.state.params.name,
            Medfrom: this.props.navigation.state.params.Medfrom,
            fetch: "http://192.168.0.103:3000/skapa/",
            Component7Visible: true,
            Component8Visible: true,
            Component11Visible: true,
        }
        console.log(this.state.name);
    //    ConnecttoClassroom();
    }
 
  componentDidMount(){
    const { Name }  = this.state.name;
        //   console.log(this.props.navigation.state.params.name);
         //   console.log(this.state.fetch+this.props.navigation.state.params.classname);
          if (this.props.navigation.state.params.Reggad== false ) {
             

    fetch(this.state.fetch+this.props.navigation.state.params.classname, {  //Skickar värdena till databasen 
    method: 'POST',	 //Post betyder skicka
      headers: { // skickazm8r med vilkoren 
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ //Skapar kroppen som skickas med och lägger in namn och pris
        name: this.state.name 
      })
     
    }).then((response) => response.json())  //gör om den till json
          .then((responseJson) => {
     
  // Showing response message coming from server after inserting records.
  console.log(responseJson); //Ser hela meddelandet från server
       // alert(responseJson.message); //Skriver vilken produkt som blivit tillagd
     
          }).catch((error) => { //Fångar fel
            console.error(error);
          });
        }
  }
    



    toggleComponent(component = false) {

        if (!component) {
            return false;
        }

        let prop = component + 'Visible';
        let val  = this.state[prop];
        if (typeof val === 'undefined') {
            return false;
        }

        this.setState({
            [prop]: val === true ? false : true
        })

        return true;

    }

    hideComponent(component = false) {

        if (!component) {
            return false;
        }

        let prop = component + 'Visible';

        this.setState({
            [prop]: false
        })

        return true;

    }

    showComponent(component = false) {

        if (!component) {
            return false;
        }

        let prop = component + 'Visible';

        this.setState({
            [prop]: true
        })

        return true;

    }

    render() {
        return (

            
            <View style={styles.container}>

                <View style={styles.screencontainer}>

                    <View style={styles.screencontainerInner}>

                        <Component7 
                            navigation={this.props.navigation}
                            toggleComponent={ (component) => this.toggleComponent(component) }
                            hideComponent={ (component) => this.hideComponent(component) }
                            showComponent={ (component) => this.showComponent(component) }
                            visible={ this.state.Component7Visible }
                        />
                        <Component11 
                            navigation={this.props.navigation}
                            toggleComponent={ (component) => this.toggleComponent(component) }
                            hideComponent={ (component) => this.hideComponent(component) }
                            showComponent={ (component) => this.showComponent(component) }
                            visible={ this.state.Component11Visible }
                        />


                    </View>

                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    
	screencontainer: {
	    backgroundColor: 'rgba(255,255,255,1)',
	    flex: 1,
	},
	
	screencontainerInner: {
	    flex: 1,
	},
	
});