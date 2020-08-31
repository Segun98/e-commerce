export const getCartItems = `
query getCartItems{
    getCartItems{
    id,
    name,
    price,
    quantity,
    delivery_fee,
    subtotal,
    description,
    product_id,
    prod_creator_id,
    customer_id,
    created_at,
    }
}
`;
