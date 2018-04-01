import React from 'react';
import { Form , FormGroup , Label , Input ,Fade} from 'reactstrap' ;

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


 
class App extends React.Component {

     constructor(props) { 
      super(props);
    this.state ={ searchWord:'', word:'', word1:'' , word2: '',word3:'',word4:'',
            fadeIn: false ,errorShow: false
     }
      this.handleChange= this.handleChange.bind(this);
      this.handleSubmit= this.handleSubmit.bind(this);
     
    
    }
 componentWillUpdate(){
  this.updateState = (words) => {
    if(words.results[0]){
      this.setState({ 
        word: words.results,
        word1: words.results[0],
        word2: words.results[0]? words.results[0]['senses'] : '',
        word3: words.results[0]['senses'][0]['examples'] ? words.results[0]['senses'][0]['examples'][0] :'',
        word4:words.results[0]['pronunciations'] ? words.results[0]['pronunciations'][0]:'',
        fadeIn:true,
        errorShow :false
    }) 
    } else {
     this.setState( { errorShow :true,fadeIn:false}) 
    }
  }
 }

   
  
 handleChange(event)  {
    this.setState({searchWord: event.target.value});
 } 
 
 handleSubmit(event) {
   event.preventDefault();
   
   
   fetch(`http://api.pearson.com/v2/dictionaries/ldoce5/entries?headword=${this.state.searchWord}&search=${this.state.searchWord}`, {
      method: "GET",
      credentials: "same-origin",
    }).then(function(response) {
      if(response.ok){ 
    return response.json()
  }
    }, function(error) {

      console.log(error)
    }).then( 
      words => this.updateState(words)
     )
   
  console.log(this.state.word)
   
 }


  render() {
    const fadeIn = this.state.fadeIn;
    const block = { display:'block'}
    const None = {display : 'none'}
    const {word1} =this.state
    const {word2} =this.state
    const {word3} =this.state
    const {word4} =this.state
    const errorShow =this.state.errorShow
    return (
      <div  className="container-fluid">
      <div className="row justify-content-center">
      <div className="col-sm-8 col-md-8 col-lg-6">
      <h1 className="text-center mt-5" >Your own dictionary app </h1>

      <Form className="mt-4 border border-dark rounded p-4 mb-5 " onSubmit={this.handleSubmit}  >
        <FormGroup>
          <Label className="font-weight-bold" for="words">Search your word</Label>
          <Input type="text" name="words" value={this.state.value} onChange={this.handleChange}  placeholder="write here..."  />
          
        </FormGroup>
         
        <FormGroup>
        <input type="submit" className="btn btn-secondary"   value="Submit" />
        </FormGroup>
       <Fade  in={fadeIn} >
        <div style={fadeIn ? block : None} className="row"  >

        <div className="col-sm-12">
        <p> <strong>{word1.headword} </strong> <em>({word1.part_of_speech})</em>   </p>
      </div>
      <div style={word4 ? block :None} className="col-sm-12">
       <p>< strong>Pronunciations</strong> : 
       <em>{word4.ipa}</em>
       </p>
    </div>
    <div style={word4.audio ? block :None} className="col-sm-12">
       <p>< strong>Pronunciations</strong> : 
       { word4.audio ?
       <audio controls> 
       <source src={`http://api.pearson.com/${word4.audio[0]['url']}?v="${new Date().getTime()}`} type="audio/mpeg"/> 
     
       </audio> :''
      }
       </p>
    </div>
        <div style={word2 ? block :None} className="col-sm-12">
         <p>  <strong> Defination</strong> : {word2 ? word2[0]['definition'] :'' }</p>
        </div>
        <div style={word3 ? block :None} className="col-sm-12">
        <p><strong>Examples</strong> :
        {word3 ? word3['text'] :'' } </p>
       </div>
       
     </div>
     </Fade>
    <div className="row"> 
     <div style={errorShow ? block :None} className="col-sm-12 text-center">
         <h3>Please spell it correctly</h3>
         <h4>Spelling is wrong or Word not Found.</h4>
         <p> Try again !</p>
       </div>

       </div>
      </Form>
      
      
      </div>
      </div>
      </div>
    );
  }
}



export default App;
