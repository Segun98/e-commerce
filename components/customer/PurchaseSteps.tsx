import { Icon } from "@chakra-ui/core";
import React from "react";

export const PurchaseSteps = () => {
  // styles can be found in "_home.scss"
  return (
    <div>
      <section className="steps">
        <h1>Purchase Process</h1>

        <div className="steps-wrap">
          <div className="steps-item">
            <Icon name="info-outline" />
            <p>Add Your Desired Products To Cart In One Click. </p>
          </div>
          <div className="steps-item">
            <Icon color="blue" name="info" />
            <p>Proceed To Paying Seamlessly To Place Order. </p>
          </div>
          <div className="steps-item">
            <Icon color="blue" name="question" />
            <p>
              Track Your Order In Your Account Page and Expect To Recieve Your
              Product(s) within 2-4 days From Order Date.{" "}
            </p>
          </div>
          <div className="steps-item">
            <Icon color="blue" name="phone" />
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
