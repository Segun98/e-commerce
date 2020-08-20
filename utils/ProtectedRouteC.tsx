import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export function ProtectRouteC(Component) {
  return function () {
    const router = useRouter();
    useEffect(() => {
      if (Cookies.get("role") !== "customer") router.push("/customer/login");
    }, []);

    return <Component {...arguments} />;
  };
}
