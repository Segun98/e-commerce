export const ADD_PRODUCT = `
mutation addProduct(
  $name: String!, $name_slug: String!, $description: String!, $price: Int!, $category: String!, $image: String!, $available_qty: Int!
) {
    addProduct(
    name: $name, name_slug:$name_slug, description:$description, price:$price, category:$category, image: $image, available_qty:$available_qty
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
      available_qty
    }
    
  }
}
`;

export const PRODUCTS = `
query products{
  products{
    id,
    name,
    name_slug,
    description,
    price,
    category,
    image,
    in_stock,
    available_qty,
    creator_id
  }
}
`;

export const PRODUCT = `
query product($name_slug:String!){
  product(name_slug:$name_slug){
    id,
    name,
    name_slug,
    description,
    price,
    category,
    image,
    in_stock,
    available_qty,
    creator_id
  }
}
`;
