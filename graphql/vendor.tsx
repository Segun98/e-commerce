export const ADD_PRODUCT = `
mutation addProduct(
  $name: String!, $name_slug: String!, $description: String!, $price: Int!, $category: String!,$party_category:String, $image: String!, $available_qty: Int!
) {
    addProduct(
    name: $name, name_slug:$name_slug, description:$description, price:$price, category:$category,party_category:$party_category, image: $image, available_qty:$available_qty
  ) {
    message
  }
}
`;

export const STORE = `
query user($business_name_slug: String!){
  user(business_name_slug:$business_name_slug){
    id
    phone
    pending
    business_name
    business_address
    business_image
    business_bio
    jwt_user_id
    usersProducts{
      id,
      name,
      name_slug,
      price,
      image,
      creator_id
    }
    
  }
}
`;

export const PRODUCTS = `
query products($limit:Int){
  products(limit:$limit){
    id,
    name,
    name_slug,
    price,
    image,
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
    related{
      id,
      name,
      name_slug,
      price,
      image,
    }
    creator{
      business_name_slug
    }
  }
}
`;

export const editProductPage = `
query editProductPage($id:ID!){
  editProductPage(id:$id){
    id,
    name,
    name_slug,
    description,
    price,
    category,
    party_category,
    image,
    in_stock,
    available_qty,
    creator_id
  }
}
`;

export const updateProduct = `
mutation updateProduct(
    $id:ID!
    $name: String!,
    $description: String,
    $price:Int!,
    $category: String,
    $party_category:String,
    $image: String,
    $available_qty:Int,
    $in_stock: String,
    $creator_id: String!){
      updateProduct(
        id:$id,
        name:$name,
        description:$description,
        price:$price,
        category:$category,
        party_category:$party_category,
        image:$image,
        available_qty:$available_qty,
        in_stock:$in_stock,
        creator_id:$creator_id
      ){
        message
      }
    }

`;

export const getVendorOrders = `
query getVendorOrders($limit:Int){
  getVendorOrders(limit:$limit){
    id
    order_id
    name
    price
    quantity
    subtotal
    request
    accepted
    completed
    canceled
    customer_email
    created_at
  }
}
`;
