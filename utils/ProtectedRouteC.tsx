import React from "react";
import Cookies from "js-cookie";

export function ProtectRouteC(WrappedComponent: any) {
  return class extends React.Component {
    componentDidMount(): void {
      if (typeof window === "object") {
        if (Cookies.get("role") !== "customer")
          window.location.href = "/customer/login";
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// export function ProtectRouteC(WrappedComponent: any) {
//   return function () {
//     if (Cookies && Cookies.get("role") !== "vendor") {
//       if (typeof window === "object") {
//         window.location.href = "/customer/login";
//       }
//     }

//     return <WrappedComponent {...arguments} />;
//   };
// }
