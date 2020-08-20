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
