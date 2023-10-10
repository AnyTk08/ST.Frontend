import React, { useLayoutEffect } from "react";
import BlockUI from "components/BlockUI/BlockUI";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./themes";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import route from "router";
import { Provider } from "react-redux";
import storeRedux from "store";
import { useTranslation } from "react-i18next";
import Template from "components/DialogAlert/TemplateDialog";

import "./App.css";

const store = storeRedux();

const App: React.FC = () => {
  let { lang } = useParams();
  const { i18n } = useTranslation();
  i18n.changeLanguage(lang);

  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Template />
        <Routes>
          {route.map((o) => {
            return (
              <Route
                path={o.path}
                key={o.path}
                element={
                  o.layout ? (
                    <o.layout>
                      <o.component />
                    </o.layout>
                  ) : (
                    <o.component />
                  )
                }
              />
            );
          })}
        </Routes>
        <BlockUI />
      </ThemeProvider>
      {/* <Antifogery></Antifogery> */}
    </Provider>
  );
};

export default App;
