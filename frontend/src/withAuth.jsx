import React from "react";
import { Redirect } from "react-router-dom";

const withAuth = (Component) => {
  return class extends React.Component {
    checkToken() {
      const token = localStorage.getItem("token");
      return token && token.length > 0;
    }

    render() {
      if (!this.checkToken()) {
        return <Redirect to="/login" />;
      }
      return <Component {...this.props} />;
    }
  };
};

export default withAuth;