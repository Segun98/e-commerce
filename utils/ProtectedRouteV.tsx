import React from "react";
import Cookies from "js-cookie";

// export function ProtectRouteV(WrappedComponent: any) {
//   return class extends React.Component {
//     componentDidMount(): void {
//       if (typeof window === "object") {
//         if (Cookies.get("role") !== "vendor")
//           window.location.href = "/vendor/login";
//       }
//     }

//     render() {
//       return <WrappedComponent {...this.props} />;
//     }
//   };
// }

export function ProtectRouteV(WrappedComponent: any) {
  return function () {
    if (Cookies && Cookies.get("role") !== "vendor") {
      if (typeof window === "object") {
        window.location.href = "/vendor/login";
      }
    }

    return <WrappedComponent {...arguments} />;
  };
}
