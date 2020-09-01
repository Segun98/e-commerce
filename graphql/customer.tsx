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
