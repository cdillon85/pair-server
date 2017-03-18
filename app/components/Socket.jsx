import React from 'react';
import {connect} from 'react-redux';
// import brace from 'brace';
import AceEditor from 'react-ace';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// console.log('Brace: ', brace);
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

import io from 'socket.io-client';

const socket = io('http://pair-server.herokuapp.com');
// const socket = io('http://localhost:1337');

const mapStateToProps = (state) => {
	return {
		openFiles: state.openFiles
	};
};

const mapDispatchToProps = (dispatch) => {
	return {

		}
	};


class TextEditorContainer extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			code: '',
			room: 1,
		}
		socket.on('receive code', (payload) => this.updateCodeInState(payload));
		this.codeIsHappening = this.codeIsHappening.bind(this)

	}

componentDidMount() {
      socket.emit('room', {message: 'joining room' + this.state.room});
    }


  componentWillUnmount() {
    socket.emit('leave room', {message: 'leaving text-editor'})
  }


codeIsHappening(newCode) {
    this.updateCodeForCurrentUser(newCode)
    socket.emit('coding event', {code: newCode, room: this.state.room})
  }

 updateCodeForCurrentUser(newCode) {
    this.setState({
      code: newCode
    })
  }

  updateCodeInState(payload) {
    this.setState({
      code: payload.code,
    });
  }


	render (){
			return (
				<div className="text-editor-container">
				  <AceEditor
				    mode="javascript"
				    theme="monokai"
				    onChange={this.codeIsHappening}
				    name="text-editor"
				    value={this.state.code}
				    width="100%"
				    editorProps={{$blockScrolling: true}}
					setOptions={{
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true,
						tabSize: 2,
						fontSize: 16,
						showGutter: true,
						showPrintMargin: false,
						maxLines: Infinity
					}}
				  />
				</div>
				);
	}
}

export default connect(mapStateToProps, null)(TextEditorContainer);
