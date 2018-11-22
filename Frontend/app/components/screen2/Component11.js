import React from 'react';
import { 
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from 'react-native';


export default class Component11 extends React.Component {

	constructor(props) {

        super(props);

        this.state = {
			Meddelande: "",
			classname: this.props.navigation.state.params.classname,
            name: this.props.navigation.state.params.name,
            fetch: "http://iot.abbindustrigymnasium.se:3000/elev/"+this.props.navigation.state.params.classname+"&"+ this.props.navigation.state.params.name,
           
        }

    }

	

	
	UpdateDataToServer = (status) =>{ //Liknande insert men patch istället för Port
	 
	
		var adress=this.state.fetch;
	   console.log(adress);
	   fetch(adress, {
		 method: 'PATCH',	
		   headers: {
		   'Accept': 'application/json',
		   'Content-Type': 'application/json',
		   },
		 body: JSON.stringify({
		 Status: status,
		 Meddelande: this.state.Meddelande,	 
		 })
		
	   }).then((response) => response.json())
		   .then((responseJson) => {
		
	   // Showing response message coming from server after inserting records.
  
	   console.log(responseJson);
		// alert( "Update was successfull, "+status); //Skriver ut att uppdateringen lyckats samt itemet som uppdaterats, vi använder namn denna gång för responseJSon säger ingenting om vad som uppdaterats
		
		   }).catch((error) => {console.log(error);
		   console.error(error);
		   });
		
		  
		  
		 }
  

    render() {

        if (!this.props.visible) {
            return false;
        }
        

        return (

            <View 
                style={styles.component}
            >

                <View style={styles.layouts}>

                	<View style={styles.layout1}>

                		<View style={styles.itemcontainer1}>

   <View style={styles.text}>
										<TextInput 
										  onChangeText={(value) => this.setState({Meddelande: value})} 
											style={styles.item1TextInput}
											value= {this.state.Meddelande}
											placeholder='Meddelande till läraren'
											underlineColorAndroid={'transparent'}
											placeholderTextColor={'#292929'}
										/>
									</View>
                			<View style={styles.itemcontainer1Inner}>



									<TouchableOpacity   onPress={() => this.UpdateDataToServer("red")}  
										style={styles.item3}
									>
										
										<Text style={styles.item1TouchableOpacity}>
											Inte alls
										</Text>
									
									</TouchableOpacity>
									<TouchableOpacity  onPress={() => this.UpdateDataToServer("yellow")} 
										style={styles.item2}
									>
										
										<Text style={styles.item1TouchableOpacity}>
											Sådär
										</Text>
									
									</TouchableOpacity>

                                <TouchableOpacity    onPress={() => this.UpdateDataToServer("green")} 
										style={styles.item1}
									>
										
										<Text style={styles.item1TouchableOpacity}   >
											Bra
										</Text>
									
									</TouchableOpacity>
                			</View>

                		</View>

                	</View>
                	
                </View>

            </View>
            
        );

    }

}

const styles = StyleSheet.create({
    
	component: {
	    width: '100%',
	    flexDirection: 'row',
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	},
	
	layouts: {
	    flexDirection: 'row',
	    flexWrap: 'wrap',
	},
	
	layout1: {
	    width: '100%',
	    height: 240,
	},
	
	itemcontainer1: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer1Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
		justifyContent: 'center',
		flexDirection:"row",
	},
	item1: {
	    backgroundColor: '#1EC94C',
	    borderWidth: 0,
	    borderColor: '#eee',
	    borderStyle: 'solid',
	    borderRadius: 4,
	    width: '33%',
	    height: '100%',
		justifyContent: 'center',
	    alignItems: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
		item2: {
	    backgroundColor: '#DDE329',
	    borderWidth: 0,
	    borderColor: '#eee',
	    borderStyle: 'solid',
	    borderRadius: 4,
	    width: '33%',
	    height: '100%',
		justifyContent: 'center',
	    alignItems: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
	item3: {
	    backgroundColor: '#CF4517',
	    borderWidth: 0,
	    borderColor: '#eee',
	    borderStyle: 'solid',
	    borderRadius: 4,
	    width: '33%',
	    height: '100%',
		justifyContent: 'center',
	    alignItems: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
	
	item1TouchableOpacity: {
	    borderColor: 'black',
	    borderStyle: 'solid',
	    borderRadius: 14,
	    color: '#fff',
	    fontSize: 24,
	    textAlign: 'center',
	    width: '100%',
	},
	text: {
	    width: '100%',
	    height: '100%',
	    justifyContent: 'center',
	    padding: 10,
	    overflow: 'hidden',
	},
	
	item1TextInput: {
	    color: '#181818',
	    fontSize: 20,
	    textAlign: 'left',
	    width: '100%',
	},
});