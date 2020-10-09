import React from "react";

export const PurchaseSteps = () => {
  // styles can be found in "_home.scss"
  return (
    <div>
      <section className="steps">
        <h1>Purchase Process</h1>

        <div className="steps-wrap">
          <div className="steps-item">
            <img src="/add.svg" alt="add to cart icon" />
            <p>Add Your Desired Products To Cart In One Click. </p>
          </div>
          <div className="steps-item">
            <img src="/paypal.svg" alt="paypal logo" />
            <p>Proceed To Paying Seamlessly To Place Order. </p>
          </div>
          <div className="steps-item">
            <img src="/track.png" alt="track order" />
            <p>
              Track Your Order and Expect To Recieve Your Product(s) within 2-4
              days From Order Date.{" "}
            </p>
          </div>
          <div className="steps-item">
            <img src="/phone.svg" alt="customer care call" />
            <p>
              Our Customer Care Agents Are Available 24/7 For Further
              Information.{" "}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
