import { gql } from "graphql-request";

export const getCartItems = gql`
  query getCartItems {
    getCartItems {
      id
      quantity
      product {
        id
        name
        price
        images
        in_stock
        available_qty
      }
    }
  }
`;

export const getCart = gql`
  query getCart($id: ID!) {
    getCart(id: $id) {
      id
      quantity
      product_id
      prod_creator_id
      customer_id
      cartCreator {
        first_name
        last_name
        email
        customer_address
        phone
        online
      }
      product {
        id
        name
        name_slug
        description
        price
        images
        in_stock
        creator_id
        available_qty
        creator {
          email
          phone
          id
          business_address
          first_name
          business_name
          online
        }
      }
    }
  }
`;

export const getOrder = gql`
  query getOrder($id: ID!) {
    getOrder(id: $id) {
      id
      order_id
      name
      price
      quantity
      delivery_fee
      subtotal
      paid
      description
      accepted
      completed
      canceled
      request
      customer_email
      vendor_email
      customer_phone
      vendor_phone
      customer_address
      business_address
      product_id
      customer_id
      prod_creator_id
      created_at
      delivery_date
    }
  }
`;

export const addToCart = gql`
  mutation addToCart($product_id: ID!, $prod_creator_id: ID!, $quantity: Int) {
    addToCart(
      product_id: $product_id
      prod_creator_id: $prod_creator_id
      quantity: $quantity
    ) {
      message
    }
  }
`;

export const updateCart = gql`
  mutation updateCart($id: ID, $quantity: Int) {
    updateCart(id: $id, quantity: $quantity) {
      message
    }
  }
`;

export const deleteFromCart = gql`
  mutation deleteFromCart($id: ID) {
    deleteFromCart(id: $id) {
      message
    }
  }
`;

export const createOrder = gql`
  mutation createOrder(
    $name: String!
    $price: Int!
    $quantity: Int!
    $delivery_fee: Int
    $subtotal: Int!
    $request: String
    $customer_email: String
    $vendor_email: String
    $customer_phone: String
    $vendor_phone: String
    $customer_address: String
    $business_address: String
    $product_id: ID
    $prod_creator_id: ID
  ) {
    createOrder(
      name: $name
      price: $price
      quantity: $quantity
      delivery_fee: $delivery_fee
      subtotal: $subtotal
      request: $request
      customer_email: $customer_email
      vendor_email: $vendor_email
      customer_phone: $customer_phone
      vendor_phone: $vendor_phone
      customer_address: $customer_address
      business_address: $business_address
      product_id: $product_id
      prod_creator_id: $prod_creator_id
    ) {
      id
    }
  }
`;

export const updateProfile = gql`
  mutation updateProfile(
    $first_name: String
    $last_name: String
    $phone: String
    $customer_address: String
  ) {
    updateProfile(
      first_name: $first_name
      last_name: $last_name
      phone: $phone
      customer_address: $customer_address
    ) {
      message
    }
  }
`;

export const SEARCH = gql`
  query search($query: String!, $limit: Int, $offset: Int) {
    search(query: $query, limit: $limit, offset: $offset) {
      id
      name
      name_slug
      price
      images
    }
  }
`;

export const getCustomerOrders = gql`
  query getCustomerOrders {
    getCustomerOrders {
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
      delivery_date
    }
  }
`;
