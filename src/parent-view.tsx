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
  sharing_group: string;
  sharing_clazz: string;
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
      sharing_group: "1",
      sharing_clazz: "1",
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
    else {
      this.resendInit();
    }
  }

  setContext() {
    this.context = {
      protocolVersion: "1.0.0",
      user: {displayName: "noah", id:"1"},
      id: uuid.v1(),
      group: {displayName: "noahs group", id: this.state.sharing_group},
      offering: {displayName: "offering_id", id: "1"},
      clazz:  {displayName: "clazz_id", id:  this.state.sharing_clazz},
      localId: "x",
      requestTime: new Date().toISOString()
    };
  }

  resendInit() {
    this.setContext();
    if(this.sharing) {
      this.sharing.resendInit(this.context);
    }
  }

  setupSharing() {
    this.setContext();
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

    this.sharing = new SharingRelay({
      // context:context,
      app: {
        application: {
          launchUrl: `${window.location}`,
          name: "Demo Parent"},
          getDataFunc: (context:Context) => new Promise(
            (resolve, reject) => resolve([{dataUrl:"(nothing)", name:"nada", type:Text}])
          )
        }
    });
    this.sharing.addPublicationListener({newPublication: receivePub});
    this.sharing.initializeAsTop(this.context);
  }

  connectionComplete() {
    this.setState({connected: true});
  }

  render() {
    const url = this.state.url;
    const sharing_group = this.state.sharing_group;
    const sharing_clazz = this.state.sharing_clazz;
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
            <div>
              <TextField
                hintText="1"
                floatingLabelText="sharing_group"
                value={sharing_group}
                onChange={ (target,newvalue) => this.setState({sharing_group:newvalue})}
                />
            </div>
            <div>
              <TextField
                hintText="1"
                floatingLabelText="sharing_clazz"
                value={sharing_clazz}
                onChange={ (target,newvalue) => this.setState({sharing_clazz:newvalue})}
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
