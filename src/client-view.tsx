import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

const iframePhone = require("iframe-phone");
import { demoClientConnect } from "./demo-client-connect";
import { SharingRelay } from "cc-sharing";

export interface ClientViewProps {}
export interface ClientViewState {
  message: string;
}

export class ClientView extends React.Component<ClientViewProps, ClientViewState> {
  public state:ClientViewState;
  shareClient: SharingRelay;

  constructor(props:ClientViewProps){
    super(props);
    this.state = {
      message: "nothing"
    };
  }

  componentWillMount() {
    this.shareClient = demoClientConnect(()=> {
      return this.state.message;
    });
  }

  render() {
    return(
      <MuiThemeProvider>
        <div style={{}}>
          <div style={{}}>
            <div>
              <TextField
                hintText="message to send"
                floatingLabelText="message"
                value={this.state.message}
                onChange={ (target,newvalue) => this.setState({message:newvalue})}
                />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<ClientView/>, document.getElementById("App"));
