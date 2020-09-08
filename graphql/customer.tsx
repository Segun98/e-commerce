export const getCartItems = `
query getCartItems{
    getCartItems{
    id,
    quantity,
    product_id,
    prod_creator_id,
    customer_id,
    cartCreator{
        first_name
        email
        customer_address
        phone
    }
    product{
        id
        name
        name_slug
        description
        price
        image
        in_stock
        creator_id
        creator{
            email
            phone
            id
            business_address
        }
    }
    }
}
`;

export const addToCart = `
mutation addToCart(
    $product_id: ID!,
    $prod_creator_id: ID!,
){
    addToCart(
        product_id: $product_id
        prod_creator_id: $prod_creator_id
    ){
        message
    }
}
`;

export const deleteFromCart = `
mutation deleteFromCart(
        $id:ID
){
    deleteFromCart(id:$id){
        message
    }
}
`;

export const createOrder = `
mutation createOrder(
          $name: String!,
          $price: Int!,
          $quantity: Int!,
          $delivery_fee: Int,
          $subtotal: Int!,
          $description: String,
          $customer_email: String,
          $vendor_email: String,
          $customer_phone: String,
          $vendor_phone: String,
          $customer_address: String,
          $business_address: String,
          $product_id: ID,
          $prod_creator_id: ID
){
    createOrder(
          name:$name,
          price:$price,
          quantity:$quantity,
          delivery_fee:$delivery_fee,
          subtotal:$subtotal,
          description:$description,
          customer_email:$customer_email,
          vendor_email:$vendor_email,
          customer_phone:$customer_phone,
          vendor_phone:$vendor_phone,
          customer_address:$customer_address,
          business_address:$business_address,
         product_id: $product_id,
         prod_creator_id: $prod_creator_id
    ){
    message
}
}

`;
