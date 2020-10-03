import React, { useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { UseWalletProvider } from "use-wallet";

import MobileMenu from "./components/MobileMenu";
import TopBar from "./components/TopBar";

import ProposalsProvider from "./contexts/Proposals";
import FarmsProvider from "./contexts/Farms";
import ModalsProvider from "./contexts/Modals";
import DragonballzProvider from "./contexts/DragonballzProvider";
import TransactionProvider from "./contexts/Transactions";

import Farms from "./views/Farms";
// import Vote from './views/Vote'
import Home from "./views/Home";
import Statics from "./views/Statics";
import theme from "./theme";
import Landing from "./views/Landing";

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false);
  }, [setMobileMenu]);

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true);
  }, [setMobileMenu]);
  return (
    <Providers>
      <Router basename="/">
        <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Switch>
          <Route path="/" exact>
            <Landing />
          </Route>
          <Route path="/farms">
            <Farms />
          </Route>
          {/* <Route path="/stats">
            <Statics />
          </Route> */}
        </Switch>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider chainId={1}>
        <DragonballzProvider>
          <TransactionProvider>
            <ModalsProvider>
              <FarmsProvider>
                <ProposalsProvider>{children}</ProposalsProvider>
              </FarmsProvider>
            </ModalsProvider>
          </TransactionProvider>
        </DragonballzProvider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

export default App;
