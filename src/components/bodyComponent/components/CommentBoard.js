import React, { Component } from 'react';
import Comments from './Comments';
import { db } from '../../../firebase/firebase';
import '../styles/styles_commentboard.css';

class CommentBoard extends Component{
  constructor(props){
    super(props);
    this.state = {
      comments: [],
      keys: [],
      accepted: [],
      editing: [],
    };
    this.create = this.create.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.eachComment = this.eachComment.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  create(text){
    var arr = this.state.comments;
    arr.push(text);
    this.setState({comments: arr});

    arr = this.state.keys;
    arr.push("empty");
    this.setState({keys: arr});
    
    arr = this.state.accepted;
    arr.push(false);
    this.setState({accepted: arr});

    arr = this.state.editing;
    arr.push(true);
    this.setState({editing: arr});
  }

  removeComment(i){
    var arr = this.state.comments;
    arr.splice(i,1);
    this.setState({comments: arr});

    arr = this.state.keys;
    arr.splice(i,1);
    this.setState({keys: arr});

    arr = this.state.accepted;
    arr.splice(i,1);
    this.setState({accepted: arr});

    arr = this.state.editing;
    arr.splice(i,1);
    this.setState({editing: arr});
  }

  updateComment(newText, i){
    var arr = this.state.comments;
    arr[i] = newText;
    this.setState({comments: arr});
  }

  eachComment(text,i){
     return(
       <Comments key={i}
                 index={i}
                 keyState={this.state.keys[i]}
                 accepted={this.state.accepted[i]}
                 editing={this.state.editing[i]}
                 updateCommentText={this.updateComment}
                 deleteFromBoard={this.removeComment}
                 dataAddress={this.props.dataAddress}>
       {text}
       </ Comments>
     );
  }

  componentWillMount(){
    this.firebaseRef = db.ref('transaction/' + this.props.dataAddress + '/Comments');
    var that = this;
    this.firebaseRef.on("value", function(snapshot){
      var comments = [];
      var keys = [];
      var accepted = [];
      var editing = [];
      snapshot.forEach(function(data){
        var eachComment = {
          msg: data.val().msg,
          key: data.val().key,
          accept: data.val().accept,
          edit: false,
        }
        
        editing.push(eachComment.edit);
        accepted.push(eachComment.accept);
        comments.push(eachComment.msg);
        keys.push(eachComment.key);
        // 'this' means something else since you are inside the snapshot now
        that.setState({comments: comments});
        that.setState({keys: keys});
        that.setState({accepted: accepted});
        that.setState({editing: editing});
      })
    })
  }

  componentWillUnmount(){
    this.firebaseRef.off('value');
  }

  render(){
    return (
      <div id="bigBoard">
        <div className="board">
          {
            this.state.comments.map(this.eachComment)
          }
        </div>
        <button onClick={this.create.bind(null, '')} className="button-create">REPLY</button>
      </div>
    );
  }
}

export default CommentBoard;
