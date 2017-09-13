import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { PublishableListView } from "./publishable-list-view";

const iframePhone = require("iframe-phone");
const uuid = require("uuid");

import {
  Context,
  SharingRelay,
  SharableApp,
  Text,
  PublishResponse } from "cc-sharing";

export interface PhoneTestProps {}
export interface PhoneTestState {
  url: string;
  connected: boolean;
  lastMessageType: string;
  snapshots: PublishResponse[];
}

export class PhoneTestView extends React.Component<PhoneTestProps, PhoneTestState> {
  public state:PhoneTestState;
  sharing: SharingRelay;

  constructor(props:PhoneTestProps){
    super(props);
    this.state = {
      url: "client.html",
      connected: false,
      lastMessageType: "(none)",
      snapshots: []
    };
  }

  componentDidMount() {
    this.setupSharing();
  }

  componentWillUpdate(prevProps:PhoneTestProps,prevState:PhoneTestState) {
    const lastUrl = prevState.url;
    const thisUrl = this.state.url;
    if(lastUrl !== thisUrl) {
      if(this.sharing) {
        this.sharing.disconnect();
      }
    }
  }
  componentDidUpdate(prevProps:PhoneTestProps,prevState:PhoneTestState) {
    const lastUrl = prevState.url;
    const thisUrl = this.state.url;
    if(lastUrl !== thisUrl) {
      this.setupSharing();
    }
    if(!this.sharing) {
      this.setupSharing();
    }
  }

  setupSharing() {
    if(this.sharing) {
      this.sharing.disconnect();
    }
    const context:Context = {
      protocolVersion: "1.0.0",
      user: {displayName: "noah", id:"1"},
      id: uuid.v1(),
      group: {displayName: "noahs group", id:"1"},
      offering: {displayName: "offering_id", id: "1"},
      clazz:  {displayName: "clazz_id", id: "1"},
      localId: "x",
      requestTime: new Date().toISOString()
    };

    const receivePub = (snapshot:PublishResponse) => {
      console.log(snapshot);
      const snapshots = this.state.snapshots;
      snapshots.push(snapshot);
      this.setState(
        {
          snapshots: snapshots,
          lastMessageType: "pub"
        }
      );
    };

    if(this.sharing) {
      this.sharing.disconnect();
    }
    this.sharing = new SharingRelay({
      // context:context,
      app: {
        application: {
          launchUrl: `${window.location}`,
          name: "Demo Parent"},
          getDataFunc: (context) => new Promise(
            (resolve, reject) => resolve([{dataUrl:"(nothing)", name:"nada", type:Text}])
          )
        }
    });
    this.sharing.addPublicationListener({newPublication: receivePub});
    this.sharing.initializeAsTop(context);
  }

  connectionComplete() {
    this.setState({connected: true});
  }

  render() {
    const url = this.state.url;
    const connectionStatus = this.state.connected ? "Connected" : "Disconnected";
    const lastMessage = this.state.lastMessageType;
    const snapshots = this.state.snapshots;
    const clickHandler = () => this.sharing.handlePublishMessage();
    return(
      <MuiThemeProvider>
        <div className="container">
          <div className="controls">
            <div>
              <RaisedButton onClick={clickHandler}> Publish </RaisedButton>
            </div>
            <div>
              <TextField
                hintText="http://localhost:8081/index.html"
                floatingLabelText="iFrame Url"
                value={url}
                onChange={ (target,newvalue) => this.setState({url:newvalue})}
                />
            </div>
          </div>
          <iframe ref='iframe' src={url}/>
          <PublishableListView snapshots={snapshots} />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<PhoneTestView/>, document.getElementById("App"));
