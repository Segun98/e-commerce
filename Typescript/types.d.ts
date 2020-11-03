export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<Maybe<UsersRes>>>;
  user?: Maybe<UsersRes>;
  getStores?: Maybe<Array<Maybe<UsersRes>>>;
  getUser?: Maybe<UsersRes>;
  customerProfile?: Maybe<UsersRes>;
  editUserPage?: Maybe<UsersRes>;
  products?: Maybe<Array<Maybe<ProductsRes>>>;
  featuredProducts?: Maybe<Array<Maybe<ProductsRes>>>;
  product?: Maybe<ProductsRes>;
  search?: Maybe<Array<Maybe<ProductsRes>>>;
  byCategory?: Maybe<Array<Maybe<ProductsRes>>>;
  partyCategory?: Maybe<Array<Maybe<ProductsRes>>>;
  editProductPage?: Maybe<ProductsRes>;
  getCartItems?: Maybe<Array<Maybe<Cart>>>;
  getCart?: Maybe<Cart>;
  getCustomerOrders?: Maybe<Array<Maybe<Orders>>>;
  getVendorOrders?: Maybe<Array<Maybe<Orders>>>;
  getAllOrders?: Maybe<Array<Maybe<Orders>>>;
};


export type QueryUserArgs = {
  business_name_slug: Scalars['String'];
};


export type QueryGetStoresArgs = {
  query?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryEditUserPageArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFeaturedProductsArgs = {
  limit?: Maybe<Scalars['Int']>;
};


export type QueryProductArgs = {
  name_slug: Scalars['String'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryByCategoryArgs = {
  category: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryPartyCategoryArgs = {
  party_category?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryEditProductPageArgs = {
  id: Scalars['ID'];
};


export type QueryGetCartArgs = {
  id: Scalars['ID'];
};


export type QueryGetVendorOrdersArgs = {
  limit?: Maybe<Scalars['Int']>;
};

export type UsersRes = {
  __typename?: 'usersRes';
  id?: Maybe<Scalars['ID']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  pending?: Maybe<Scalars['String']>;
  online?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  business_name?: Maybe<Scalars['String']>;
  business_name_slug?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['String']>;
  jwt_user_id?: Maybe<Scalars['String']>;
  usersProducts?: Maybe<Array<Maybe<ProductsRes>>>;
};

export type ProductsRes = {
  __typename?: 'productsRes';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  name_slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  category?: Maybe<Scalars['String']>;
  party_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  in_stock?: Maybe<Scalars['String']>;
  creator_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  available_qty?: Maybe<Scalars['Int']>;
  featured?: Maybe<Scalars['String']>;
  creator?: Maybe<UsersRes>;
  related?: Maybe<Array<Maybe<ProductsRes>>>;
};

export type Cart = {
  __typename?: 'cart';
  id?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  product_id?: Maybe<Scalars['ID']>;
  prod_creator_id?: Maybe<Scalars['ID']>;
  customer_id?: Maybe<Scalars['ID']>;
  created_at?: Maybe<Scalars['String']>;
  cartCreator?: Maybe<UsersRes>;
  product?: Maybe<ProductsRes>;
  productCreator?: Maybe<UsersRes>;
};

export type Orders = {
  __typename?: 'orders';
  id?: Maybe<Scalars['ID']>;
  order_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  delivery_fee?: Maybe<Scalars['Int']>;
  subtotal?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  accepted?: Maybe<Scalars['String']>;
  completed?: Maybe<Scalars['String']>;
  canceled?: Maybe<Scalars['String']>;
  request?: Maybe<Scalars['String']>;
  customer_email?: Maybe<Scalars['String']>;
  vendor_email?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  vendor_phone?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['ID']>;
  customer_id?: Maybe<Scalars['ID']>;
  prod_creator_id?: Maybe<Scalars['ID']>;
  created_at?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  setUserStatus?: Maybe<CustomRes>;
  signUp?: Maybe<CustomRes>;
  logIn?: Maybe<LoginRes>;
  updateProfile?: Maybe<CustomRes>;
  addProduct?: Maybe<CustomRes>;
  updateProduct?: Maybe<CustomRes>;
  deleteProduct?: Maybe<CustomRes>;
  addToCart?: Maybe<CustomRes>;
  deleteFromCart?: Maybe<CustomRes>;
  updateCart?: Maybe<CustomRes>;
  createOrder?: Maybe<CustomRes>;
  cancelOrder?: Maybe<CustomRes>;
  acceptOrder?: Maybe<CustomRes>;
  completeOrder?: Maybe<CustomRes>;
  cancelOrderAdmin?: Maybe<CustomRes>;
};


export type MutationSetUserStatusArgs = {
  pending: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationSignUpArgs = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  confirm_password: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  role: Scalars['String'];
  pending: Scalars['String'];
  business_name?: Maybe<Scalars['String']>;
  business_name_slug?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
};


export type MutationLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  business_name?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  online?: Maybe<Scalars['String']>;
};


export type MutationAddProductArgs = {
  name: Scalars['String'];
  name_slug: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  category?: Maybe<Scalars['String']>;
  party_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  available_qty: Scalars['Int'];
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  category?: Maybe<Scalars['String']>;
  party_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  available_qty?: Maybe<Scalars['Int']>;
  in_stock?: Maybe<Scalars['String']>;
  creator_id: Scalars['String'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
  creator_id: Scalars['String'];
};


export type MutationAddToCartArgs = {
  product_id: Scalars['ID'];
  prod_creator_id: Scalars['ID'];
  quantity?: Maybe<Scalars['Int']>;
};


export type MutationDeleteFromCartArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationUpdateCartArgs = {
  id?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
};


export type MutationCreateOrderArgs = {
  name: Scalars['String'];
  price: Scalars['Int'];
  quantity: Scalars['Int'];
  delivery_fee?: Maybe<Scalars['Int']>;
  subtotal: Scalars['Int'];
  request?: Maybe<Scalars['String']>;
  customer_email?: Maybe<Scalars['String']>;
  vendor_email?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  vendor_phone?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['ID']>;
  prod_creator_id?: Maybe<Scalars['ID']>;
};


export type MutationCancelOrderArgs = {
  id: Scalars['ID'];
};


export type MutationAcceptOrderArgs = {
  id: Scalars['ID'];
};


export type MutationCompleteOrderArgs = {
  id: Scalars['ID'];
};


export type MutationCancelOrderAdminArgs = {
  id: Scalars['ID'];
};

export type CustomRes = {
  __typename?: 'customRes';
  message?: Maybe<Scalars['String']>;
};

export type LoginRes = {
  __typename?: 'loginRes';
  refreshtoken?: Maybe<Scalars['String']>;
  accesstoken?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type Users = {
  __typename?: 'users';
  id?: Maybe<Scalars['ID']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  confirm_password?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  pending?: Maybe<Scalars['String']>;
  online?: Maybe<Scalars['String']>;
  business_name?: Maybe<Scalars['String']>;
  business_name_slug?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['String']>;
};

export type Products = {
  __typename?: 'products';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  name_slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  category?: Maybe<Scalars['String']>;
  party_category?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  in_stock?: Maybe<Scalars['String']>;
  creator_id?: Maybe<Scalars['String']>;
  available_qty?: Maybe<Scalars['Int']>;
  featured?: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

