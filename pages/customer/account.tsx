import Cookies from "js-cookie";
import { useToken } from "../../Context/TokenProvider";
import { CustomerCart } from "../../components/customer/Cart";
import { ShowUser } from "../../components/ShowUser";
import { UserProvider } from "../../Context/UserProvider";
// import { ProtectRouteC } from "../../utils/ProtectedRouteC";
import { Button } from "@chakra-ui/core";

export const Account = () => {
  const { Token } = useToken();
  let role = Cookies.get("role");

  return (
    <UserProvider>
      <main>
        {Token && <ShowUser />}
        <CustomerCart Token={Token} />
      </main>
    </UserProvider>
  );
};
export default Account;
