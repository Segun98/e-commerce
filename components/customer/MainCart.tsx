import { Button, Icon, useToast } from "@chakra-ui/core";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { useToken } from "@/Context/TokenProvider";
import { deleteFromCart, updateCart } from "@/graphql/customer";
import { cartItems } from "@/redux/features/cart/fetchCart";
import { Cart } from "@/Typescript/types";
import { Commas, nairaSign } from "@/utils/helpers";
import { useMutation } from "@/utils/useMutation";
import { useRouter } from "next/router";
interface IProps {
  cart: Cart[];
  setLoadingCart: (boolean) => void;
}
export const MainCart: React.FC<IProps> = ({ cart, setLoadingCart }) => {
  const toast = useToast();
  const { Token } = useToken();
  const dispatch = useDispatch();
  const router = useRouter();

  //cart items subtotal
  const subTotal = cart.reduce((a, c) => a + c.product.price * c.quantity, 0);

  //update quantity of an item
  const updateCartFn = async (id, quantity) => {
    setLoadingCart(true);
    const { data, error } = await useMutation(updateCart, {
      id,
      quantity,
    });
    if (data) {
      dispatch(cartItems(Token));
      setLoadingCart(false);
      toast({
        title: "Quantity Updated",
        status: "info",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
      setLoadingCart(false);
      toast({
        title: "Updating Cart Item Quantity Failed",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  //delete from cart
  const deleteCartFn = async (id) => {
    setLoadingCart(true);
    const { data, error } = await useMutation(deleteFromCart, {
      id,
    });
    if (data.deleteFromCart) {
      dispatch(cartItems(Token));
      setLoadingCart(false);
      toast({
        title: "Item Removed From Cart",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
      setLoadingCart(false);
      toast({
        title: "Failed To Remove From Cart",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <section className="cart-section" id="cart-top">
      <div className="cart-wrap">
        <h1>In your Cart</h1>
        <div className="cart-item-title">
          <div>Product</div>
          <div></div>
          <div>Total</div>
          <div>Remove</div>
        </div>
        <hr />
        {cart &&
          cart.map((c: Cart) => (
            <div key={c.id} className="cart-item">
              <div className="cart-img">
                <img src={c.product.images[0]} alt={`${c.product.name}`} />
              </div>
              <div className="item-details">
                <p className="name">{c.product.name}</p>
                <p className="price">
                  {nairaSign} {Commas(c.product.price)}
                </p>
                <div className="qty-btn">
                  <button
                    title="decrement quantity"
                    aria-label="decrement quantity"
                    aria-roledescription="decrement quantity"
                    onClick={() => {
                      if (c.quantity === 1) {
                        return;
                      }
                      updateCartFn(c.id, c.quantity - 1);
                    }}
                  >
                    <Icon name="minus" color="black" />
                  </button>
                  <aside className="cart-item-qty">{c.quantity}</aside>
                  <button
                    title="increment quantity"
                    aria-label="increment quantity"
                    aria-roledescription="increment quantity"
                    onClick={() => {
                      if (c.quantity >= c.product.available_qty) {
                        return;
                      }
                      updateCartFn(c.id, c.quantity + 1);
                    }}
                  >
                    <Icon name="small-add" color="black" size="22px" />
                  </button>
                </div>
              </div>
              <div className="subtotal">
                {nairaSign} {Commas(c.product.price * c.quantity)}
              </div>

              <button
                title="delete cart item"
                name="delete cart item"
                aria-label="delete cart item"
                aria-roledescription="delete cart item"
                onClick={() => {
                  deleteCartFn(c.id);
                }}
              >
                <Icon name="close" size="14px" />
              </button>
            </div>
          ))}

        {/* subtotal and checkout  */}
        <div className="cart-item-title">
          <div></div>
          <div></div>
          <div>
            <span>Subtotal:</span>
            <br />
            <span style={{ color: "var(--deepblue)" }}>
              {nairaSign} {Commas(subTotal)}
            </span>
          </div>

          <Button
            className="order-btn"
            color="white"
            size="xs"
            background="var(--deepblue)"
            onClick={() => router.push(`/product/checkout`)}
          >
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
};
