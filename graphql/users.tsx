/* 
1. signUp 3.  5.
2. logIn   4.   6.
*/

export const SIGN_UP = `
  mutation signUp(
    $first_name: String!, $last_name: String!, $email: String!, $password: String!, $confirm_password: String!, $phone:String, $role: String!, $pending: String!, $business_name: String, $business_name_slug: String, $business_address: String, $business_image: String, $business_bio: String, $customer_address: String
  ) {
    signUp(
        first_name: $first_name, last_name:$last_name, email:$email, password:$password, confirm_password:$confirm_password, phone:$phone, role:$role, pending:$pending, business_name:$business_name, business_name_slug:$business_name_slug, business_address:$business_address, business_image:$business_image, business_bio: $business_bio, customer_address: $customer_address
    ) {
      message
    }
  }
`;

export const LOG_IN = `
  mutation logIn($email: String!, $password: String!){
      logIn(email: $email, password: $password){
          refreshtoken
          accesstoken
          role
      }
  }
`;
