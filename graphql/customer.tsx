import { gql } from "graphql-request";

export const getCartItemsCartPage = gql`
  query getCartItems($customer_id: ID!) {
    getCartItems(customer_id: $customer_id) {
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

export const getCartItemsCheckoutPage = gql`
  query getCartItems($customer_id: ID!) {
    getCartItems(customer_id: $customer_id) {
      id
      quantity
      product_id
      prod_creator_id
      customer_id
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
  query getOrder($order_id: ID!) {
    getOrder(order_id: $order_id) {
      order_id
      name
      price
      quantity
      subtotal
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
    }
  }
`;

export const addToCart = gql`
  mutation addToCart(
    $customer_id: ID!
    $product_id: ID!
    $prod_creator_id: ID!
    $quantity: Int
  ) {
    addToCart(
      customer_id: $customer_id
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

export const deleteAllFromCart = gql`
  mutation deleteAllFromCart($customer_id: ID!) {
    deleteAllFromCart(customer_id: $customer_id) {
      message
    }
  }
`;

export const createOrder = gql`
  mutation createOrder(
    $order_id: ID!
    $name: String!
    $price: Int!
    $quantity: Int!
    $subtotal: Int!
    $request: String
    $customer_email: String
    $vendor_email: String
    $customer_phone: String
    $vendor_phone: String
    $customer_address: String
    $business_address: String
    $product_id: ID!
    $prod_creator_id: ID!
  ) {
    createOrder(
      order_id: $order_id
      name: $name
      price: $price
      quantity: $quantity
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
      message
    }
  }
`;

export const updateOrder = gql`
  mutation updateOrder(
    $order_id: ID!
    $transaction_id: ID!
    $delivery_fee: Int
    $total_price: Int!
  ) {
    updateOrder(
      order_id: $order_id
      transaction_id: $transaction_id
      delivery_fee: $delivery_fee
      total_price: $total_price
    ) {
      message
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
  query search($query: String!, $limit: Int, $offset: Int, $sort: String) {
    search(query: $query, limit: $limit, offset: $offset, sort: $sort) {
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
      order_id
      name
      price
      quantity
      subtotal
      request
      created_at
      orderStatus {
        order_id
        delivery_fee
        total_price
        delivery_date
        delivered
        in_transit
        canceled
      }
    }
  }
`;
