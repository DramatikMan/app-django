import { FC } from "react";
import * as ReactDOM from "react-dom";


const App: FC = (): JSX.Element => {
  return (
    <span>
      Hello from React.
    </span>
  );
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
);