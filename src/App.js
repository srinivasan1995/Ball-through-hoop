import React, { Component } from 'react';
import './App.css';
const {Raphael,Paper,Set,Circle,Ellipse,Image,Rect,Text,Path,Line} = require('react-raphael');
class birdPosition {
    constructor(){
        this.x = 0;
        this.y = 0;
        console.log(this.x + " "+this.y);
    }
}

class Pipes{
    constructor(){
        this.topx = 0;
        this.topHeight = 0;
        this.bottomx = 0;
        this.bottomHeight = 0;
    }
}
class App extends Component {
    
    state = {
     pipesList : [],
     birdLocation : new birdPosition(),
     pauseDescend : false,
     startFlag : false,
    Score : 0
    }

    setInitialState = () => {
        var bird = new birdPosition();
        bird.x = this.width/2;
        bird.y = this.height /2;
        this.setState({
            pipesList : [],
        birdLocation : bird,
        pauseDescend : false,
        startFlag : false,
        Score : 0
        })
    }
    
    constructor(){
        super();
        this.height = 500;
        this.width = 300;
        this.birdNotFlyingintervalValue = setInterval(this.birdDescend,40);
        
    }

    conditionForPipeGeneration = (topHeight,bottomHeight) => {
        if(topHeight + bottomHeight  > 500){
            return false;
        }
        
        if(topHeight  < 50 || bottomHeight < 50){
            return false;
        }
//        if((topHeight + bottomHeight ) - this.width > 30){
//            return true;
//        }
            if(Math.abs(topHeight + bottomHeight -this.height) > 100  ){
                return true ;
            }else{
                return false;
            }
    }
    randomize =  () => {
        
        var topHeight , bottomHeight;
        do{
        topHeight =  Math.floor(Math.random()*this.height);
        bottomHeight = Math.floor(Math.random()*this.height);
        }while(!this.conditionForPipeGeneration(topHeight,bottomHeight));
        var tempPipes = new Pipes();
      tempPipes.topx = 480;
    tempPipes.topHeight = topHeight
    tempPipes.bottomx = 480;
    tempPipes.bottomHeight = bottomHeight
       // console.log("srini" + "topHiehgt = " + topHeight + " " + "bottom height " + bottomHeight)
        return tempPipes;
        
    }

    birdDescend = () => {
     //   console.log("bird descend starts ");
        if(!this.state.pauseDescend){
           // console.log("bird is descending  ");
        var temp = this.state.birdLocation;
        temp.y = temp.y + 10;
        this.setState({birdLocation :temp});
        }else{
          //  console.log("bird not  descending  ");
        }
        
          temp = this.state.birdLocation;
        var pipesTemp = this.state.pipesList;
        for(var i =0 ;i<this.state.pipesList.length;i++){
        var pipes = this.state.pipesList[i];
            console.log("pipes.x = " + pipes.topx + "bird location.x = "+ temp.x);
        if(temp.x ===pipes.topx || Math.abs(temp.x-pipes.topx) < 10 ){
            console.log("srini am i coming here or not which determines game out value score = " + this.state.Score);
            if(temp.y > this.state.pipesList[i].topHeight &&temp.y <(this.height-this.state.pipesList[i].bottomHeight)){
            console.log("srini you passed ");
                this.setState({Score : this.state.Score +1});
                 if(pipes.topx < 0){
                    //console.log("beofre " + pipesTemp.length);
                    pipesTemp.splice(i,1);
                  //  console.log("after " + pipesTemp.length);
                    pipesTemp.push(this.randomize());
                }
            }else{
                this.setState({state : this.setInitialState()});
            }
    
        }else{
            if(pipes.topx < 0){
               // console.log("beofre " + pipesTemp.length);
                pipesTemp.splice(i,1);
                //console.log("after " + pipesTemp.length);
                pipesTemp.push(this.randomize());
            }
        }
    }
            
            
        this.setState({pipesList :pipesTemp });
    }
    
    startBirdDescend = () => {
        clearInterval(this.birdNotGoingDownIntervalValue);
        this.setState({pauseDescend : false});
    }
    
    detectKeyPress = (e) => {
    var keyValue = e.keyCode;
        switch(keyValue){
            case 32:{
                if(!this.state.startFlag){
                    console.log("srini start flag enabled ");
                    
                    var listval = [];listval.push(this.randomize());
                    this.setState({pipesList : listval});
                    this.setState({startFlag : true});
                    
                }
                    
                var temp = this.state.birdLocation;
                temp.y = temp.y - 10;
                this.setState({birdLocation :temp});
                this.setState({pauseDescend : true});
                clearInterval(this.birdNotGoingDownIntervalValue);
                this.birdNotGoingDownIntervalValue = setInterval(this.startBirdDescend,200);

                break;
            }
            default :
                console.log("invalid keys");
        }
    
    }
    
    movingPipe = () => {
        var temp = this.state.pipesList;
        for(var i =0 ; i< temp.length;i++){
        temp[i].topx = temp[i].topx -10; 
        temp[i].bottomx = temp[i].bottomx -10;
        }
        
     this.setState({pipesList : temp});
    }
    
    componentDidMount(){
        var temp = this.state.birdLocation;
        temp.y=this.height/2;
        temp.x=this.width/2;
        this.setState({birdLocation : temp});
        document.addEventListener("keypress",this.detectKeyPress);
        setInterval(this.movingPipe,40);
       
    }
  render() {
      var temp = [];
      for(var i =0;i<this.state.pipesList.length;i++){
//          console.log("value of i = " + i);
//          console.log("srini" + this.state.pipesList[i].topheight + " " + this.state.pipesList[i].topx);
          temp.push(
            <Set>
          <Rect width={30} height = {this.state.pipesList[i].topHeight} x={this.state.pipesList[i].topx} y={0} attr={{"fill":"#0f0"}} />
        <Rect width={30} height = {this.state.pipesList[i].bottomHeight} x={this.state.pipesList[i].bottomx} y={this.height-this.state.pipesList[i].bottomHeight} attr={{"fill":"#0f0"}} />
              </Set>
          );
      }
    return (
        <div>
        <div id="flappyBirdCanvas">
        <Paper width={this.width} height={this.height}>
        <Text x={270} y={30} text={"Score : " + this.state.Score} attr={{"fill" : "#ff0"}} />
        <Circle x={this.state.birdLocation.x} y={this.state.birdLocation.y} r={10} attr={{"fill":"#000"}}/>
            {temp}
        </Paper>
        </div>
        </div>
    );
  }
}

export default App;
