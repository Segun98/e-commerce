import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export function ProtectRouteV(Component) {
  return function () {
    const router = useRouter();
    useEffect(() => {
      if (Cookies.get("role") !== "vendor") router.push("/vendor/login");
    }, []);

    return <Component {...arguments} />;
  };
}
