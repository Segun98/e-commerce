import React from "react";
import Cookies from "js-cookie";

export function ProtectRouteC(WrappedComponent: any) {
  return class extends React.Component {
    componentDidMount(): void {
      if (typeof window === "object") {
        if (Cookies.get("role") !== "customer") window.location.href = "/login";
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
