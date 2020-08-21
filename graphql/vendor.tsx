export const ADD_PRODUCT = `
mutation addProduct(
  $name: String!, $name_slug: String!, $description: String!, $price: Int!, $category: String!, $image: String!, $in_stock: String!
) {
    addProduct(
    name: $name, name_slug:$name_slug, description:$description, price:$price, category:$category, image: $image, in_stock:$in_stock
  ) {
    message
  }
}
`;

export const STORE = `
query user($business_name_slug: String!){
  user(business_name_slug:$business_name_slug){
    id
    email
    role
    phone
    pending
    business_name
    business_address
    business_area
    business_image
    business_bio
    jwt_user_id
    usersProducts{
      id,
      name,
      name_slug,
      description,
      price,
      category,
      image,
      in_stock,
    }
    
  }
}
`;
