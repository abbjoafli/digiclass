import React from 'react';
import { 
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from 'react-native';


export default class Component4 extends React.Component {
	constructor(props) {

        super(props);

        this.state = {
			classname: "",
			Medfrom: "",
			name: "",
			Reggad: false,
			fetch:'http://192.168.0.103:3000/'
           
        }

    }



		Sendoff = () =>{ //Skapar en metod som tar värdena name och price så använder vi dem för att skicka till databasen
			
							
			
			const { Name }  = this.state.name ;
			const { Class }  = this.state.classname ;
			
		  if(this.state.name!="" && this.state.classname!="") //Tittar så namnet inte är tomt
		  {
		   fetch(this.state.fetch+"larare/"+ this.state.classname, {  //Skickar värdena till databasen 
		   method: 'GET',	 //Post betyder skicka
			 headers: { // skickar med vilkoren 
			 'Accept': 'application/json', 
			 'Content-Type': 'application/json',
			 }
		   }).then((response) => response.json())  //gör om den till json
				 .then((responseJson) => {
			let Enter= true;
			
			this.setState({Reggad:false});
			console.log(responseJson);
			if (typeof responseJson.error !== 'undefined')
			{
					if(responseJson.error.code=="ER_NO_SUCH_TABLE")
					{
						alert("Finns inget klassrum med detta namn.");
				
					Enter=false;
					}
				}
				else
					for (let index = 0; index < responseJson.length; index++) {
				
						const element = responseJson[index];
						if( this.state.name== element.Namn)
						{
							
							this.setState({Medfrom: element.Meddelandefrom, Reggad:true});
							break;
						}
			
					}
				if (Enter== true) {
					if (this.state.Reggad ==false) {
						console.log("ändrat!!");
					}console.log(this.state.Medfrom);
					this.props.navigation.navigate('Screen2', { name: this.state.name,Reggad: this.state.Reggad,  Medfrom: this.state.Medfrom , classname: this.state.classname})
			
				}
				
					
		 // Showing response message coming from server after inserting records.
		 
				 }).catch((error) => { //Fångar fel
				   console.error(error);
				 });
				  
		   }
		   else
		   alert("Skriv in klassrummskoden och ett namn.") ;//Om det är tomt skrivs en rekomendation ut
			
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

                			<View style={styles.itemcontainer1Inner}>
						
									<View style={styles.item1}>
										<Text 
											style={styles.item1TextInput}
										>
											Ditt namn:
										</Text>
									</View>
									<View style={styles.item1}>
										<TextInput 
										onChangeText={(value) => this.setState({name: value})} 
										style={styles.item1TextInput}
											value={this.state.name}
											placeholder='Namn'
											underlineColorAndroid={'transparent'}
											placeholderTextColor={'#292929'}
										/>
									</View>
 <View style={styles.item1}>
										<Text 
											style={styles.item1TextInput}
										>
											Klass Id:
										</Text>
									</View>

									<View style={styles.item1}>	
									<TextInput 
										  onChangeText={(value) => this.setState({classname: value})} 
											style={styles.item1TextInput}
											value={this.state.classname}
											placeholder='Klass Id'
											underlineColorAndroid={'transparent'}
											placeholderTextColor={'#292929'}
										/>
									</View>
  <View style={styles.item2}>
									

								<TouchableOpacity 
										style={styles.item1}
										onPress={this.Sendoff} 
												>
										
										<Text style={styles.item1TouchableOpacity}>
											Anslut
										</Text>
									
									</TouchableOpacity>
</View>
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
		marginTop: 110.5,
	    width: '100%',
	    height: 90,
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
	},
	item1TextInput:{
		
			color: '#181818',
			fontSize: 20,
			width: '100%',
		
	},
	item2: {
	    backgroundColor: '#1194f6',
	    borderWidth: 0,
	    borderColor: '#eee',
	    borderStyle: 'solid',
	    borderRadius: 4,
	    width: '100%',
	    height: '100%',
	    justifyContent: 'center',
	    alignItems: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
	item1: {
	    width: '100%',
	    height: '100%',
	    justifyContent: 'center',
	    padding: 10,
	    overflow: 'hidden',
	},
	item1TouchableOpacity: {
	    color: '#fff',
	    fontSize: 19,
	    textAlign: 'center',
	    width: '100%',
	},
	
});