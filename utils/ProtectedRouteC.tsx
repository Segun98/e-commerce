import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function ProtectRouteC(Component) {
  return function () {
    const [Auth, setAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!Auth) router.push("/customer/login");
    }, [Auth]);

    return <Component {...arguments} />;
  };
}
