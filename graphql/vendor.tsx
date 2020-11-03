import { gql } from "graphql-request";

export const ADD_PRODUCT = gql`
  mutation addProduct(
    $name: String!
    $name_slug: String!
    $description: String!
    $price: Int!
    $category: String!
    $party_category: String
    $images: [String]
    $available_qty: Int!
  ) {
    addProduct(
      name: $name
      name_slug: $name_slug
      description: $description
      price: $price
      category: $category
      party_category: $party_category
      images: $images
      available_qty: $available_qty
    ) {
      message
    }
  }
`;

export const STORE = gql`
  query user($business_name_slug: String!) {
    user(business_name_slug: $business_name_slug) {
      id
      phone
      pending
      online
      business_name
      business_image
      business_bio
      jwt_user_id
      usersProducts {
        id
        name
        name_slug
        price
        images
        creator_id
      }
    }
  }
`;

export const featuredProducts = gql`
  query featuredProducts($limit: Int) {
    featuredProducts(limit: $limit) {
      id
      name
      name_slug
      price
      images
    }
  }
`;

export const PRODUCT = gql`
  query product($name_slug: String!) {
    product(name_slug: $name_slug) {
      id
      name
      name_slug
      description
      price
      category
      party_category
      images
      in_stock
      available_qty
      creator_id
      related {
        id
        name
        name_slug
        price
        images
      }
      creator {
        business_name_slug
        online
      }
    }
  }
`;

export const editProductPage = gql`
  query editProductPage($id: ID!) {
    editProductPage(id: $id) {
      id
      name
      name_slug
      description
      price
      category
      party_category
      images
      in_stock
      available_qty
      creator_id
    }
  }
`;

export const updateProduct = gql`
  mutation updateProduct(
    $id: ID!
    $name: String!
    $description: String
    $price: Int!
    $category: String
    $party_category: String
    $images: [String]
    $available_qty: Int
    $in_stock: String
    $creator_id: String!
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      category: $category
      party_category: $party_category
      images: $images
      available_qty: $available_qty
      in_stock: $in_stock
      creator_id: $creator_id
    ) {
      message
    }
  }
`;

export const getVendorOrders = gql`
  query getVendorOrders($limit: Int) {
    getVendorOrders(limit: $limit) {
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

export const updateProfile = gql`
  mutation updateProfile(
    $first_name: String
    $last_name: String
    $business_name: String
    $phone: String
    $business_address: String
    $business_image: String
    $business_bio: String
    $online: String
  ) {
    updateProfile(
      first_name: $first_name
      last_name: $last_name
      business_name: $business_name
      phone: $phone
      business_address: $business_address
      business_image: $business_image
      business_bio: $business_bio
      online: $online
    ) {
      message
    }
  }
`;
