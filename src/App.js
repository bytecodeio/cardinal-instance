import React from "react";
import { ExtensionProvider, ExtensionContext } from "@looker/extension-sdk-react";
import { hot } from "react-hot-loader/root";

import { Main } from "./Main";
import { Main2 } from "./Main2";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { APP_ROUTE } from "./utils/constants2";
import { AdminPage } from "./components/Admin";
import { PrintPage } from "./components/PrintPage"
import { useContext } from "react";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { InitialPage } from "./InitialPage";

export const App = hot(() => {


  const isLandingPage = () => {
    const extensionContext = useContext(ExtensionContext)
    console.log("extension", extensionContext)
  }
  return (
    <ExtensionProvider>
      <Switch>
      <Route exact path='/print'>
          <PrintPage />
        </Route>
        <Route exact path='/admin'>
          <AdminPage />
        </Route>
        <Route path='/:path/'>
          <Main2 />
        </Route>
        <Route exact path="/">
          <InitialPage />
        </Route>
        {/* <Redirect push from="/" to={APP_ROUTE} /> */}
      </Switch>
    </ExtensionProvider>
  );
});
