import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Orders } from "../../Typescript/types";

interface Iprops {
  orders: Orders[];
}
export const Chart: React.FC<Iprops> = ({ orders }) => {
  //Parse date to get month
  function getMonth(d) {
    let date = new Date(parseInt(d));
    let format = new Intl.DateTimeFormat("en-us", {
      month: "long",
    }).format(date);
    return format;
  }

  // return array of months from DB
  const months = orders.map((o) => getMonth(o.created_at));

  //create an object that maps months to frequency e.g{January: 2, February:5}
  function repeatMonths() {
    let count = 1;
    let obj = {};
    for (let i = 0; i < months.length; i++) {
      if (months[i] === months[i + 1]) {
        count++;
      } else {
        let currentMonth = months[i];
        obj[currentMonth] = count;
        count = 1;
      }
    }
    return obj;
  }

  useEffect(() => {
    repeatMonths();
  }, []);

  useEffect(() => {
    final();
  }, []);

  let labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
  ];
  //returns ["","","March", ""] to work with chart library
  function final() {
    let d = repeatMonths();
    return labels.map((l) => d[l] || "");
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: final(),
      },
    ],
  };
  return (
    <div className="chart-comp">
      <h1>Sales Metrics</h1>
      <Line data={data} />
    </div>
  );
};
