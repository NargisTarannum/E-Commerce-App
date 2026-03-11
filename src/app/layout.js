"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
