import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./style.css";
import "./responsive.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "react-edit-text/dist/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material";
import { ToastContainer } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FirebaseDataContextProvider } from "./context/FirebaseDataContext";
import { NFTStorageContextProvider } from "./context/NFTStorageContext";
import { Web3ContextProvider } from "./context/Web3Context";
import { BadgeContextProvider } from "./context/BadgeContext";
import { TemplateContextProvider } from "./context/CreateTemplateContext";

import { PrivyProvider } from "@privy-io/react-auth";

let darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff64a2",
    },
    action: {
      focus: "#ff64a2",
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h2",
          h2: "h2",
          h3: "h2",
          h4: "h2",
          h5: "h2",
          h6: "h2",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
        },
      },
    },
  },
});

darkTheme = responsiveFontSizes(darkTheme);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <PrivyProvider
        appId={process.env.REACT_APP_PRIVY_APP_ID}
        config={{
          loginMethods: ["email", "wallet", "google", "twitter"],
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
            logo: "/images/logo.png",
            showWalletLoginFirst: true,
          },
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
        }}
      >
        <ToastContainer />
        <FirebaseDataContextProvider>
          <TemplateContextProvider>
            <Web3ContextProvider>
              <BadgeContextProvider>
                <NFTStorageContextProvider>
                  <App />
                </NFTStorageContextProvider>
              </BadgeContextProvider>
            </Web3ContextProvider>
          </TemplateContextProvider>
        </FirebaseDataContextProvider>
      </PrivyProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
