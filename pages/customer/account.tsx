import Cookies from "js-cookie";
import { ProtectRouteC } from "../../utils/ProtectedRouteC";

export const Account = () => {
  let role = Cookies.get("role");

  if (role !== "customer") {
    return "loading...";
  }
  return <div>customer account</div>;
};
export default ProtectRouteC(Account);
