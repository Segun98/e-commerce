import Link from "next/link";
import React from "react";
import { useUser } from "../Context/UserProvider";
import { useRouter } from "next/router";

export const ShowUser = () => {
  const { User } = useUser();
  const router = useRouter();

  return (
    <div>
      {User && (
        <main>
          <div
            style={{
              display:
                router.pathname === "/customer/account" ? "none" : "block",
            }}
          >
            <Link
              href={`/store/${User.business_name_slug}`}
              as={`/store/${User.business_name_slug}`}
            >
              <a>Visit Store</a>
            </Link>
          </div>
          <div>{User && <p>Signed in as {User.first_name}</p>}</div>
        </main>
      )}
    </div>
  );
};
