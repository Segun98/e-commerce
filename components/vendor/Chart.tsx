import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Orders } from "@/Typescript/types";
import { useUser } from "@/Context/UserProvider";

interface Iprops {
  orders: Orders[];
}
export const Chart: React.FC<Iprops> = ({ orders }) => {
  const { User } = useUser();
  //year user joined , coming from database
  const [yearJoined, setYearJoined] = useState("");
  //an array showing the year the user joined till this year, printYear() function below is where the logic resides
  const [yearsArr, setYearsArr] = useState([]);
  //the selected year to dynamically update the chart
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    new Date().getFullYear()
  );

  useEffect(() => {
    setYearJoined(User?.created_at || "");
  }, [User]);

  useEffect(() => {
    printYears();
  }, [yearJoined]);

  // if user joined in 2015 and this year is 2017, this should return [2015, 2016, 2017]
  function printYears() {
    let joined = getYear(yearJoined);
    let thisYear = new Date().getFullYear();
    let years = [];

    let difference = 0;
    //means user joined this year
    if (joined === thisYear) {
      years.push(thisYear);
      return years;
    } else {
      difference = thisYear - joined;
    }

    for (let i = 0; i < difference + 1; i++) {
      years.push(joined + i);
    }
    setYearsArr(years);
  }

  // MAIN LOGIC FOR CHART LIBRARY STARTS HERE

  //helper to Parse date to get year
  function getYear(d) {
    let date = new Date(parseInt(d));
    return date.getFullYear();
  }

  //helper to Parse date to get month
  function getMonth(d) {
    let date = new Date(parseInt(d));
    let format = new Intl.DateTimeFormat("en-us", {
      month: "long",
    }).format(date);
    return format;
  }

  //array of orders for selected year, default to this year.
  const OrdersThisYear = orders.filter(
    (o) => getYear(o.orderStatus.delivery_date) === selectedYear
  );

  //array of delivered orders
  const completed = OrdersThisYear.filter(
    (o) => o.orderStatus.delivered === "true"
  );

  // return array of months from DB
  const months = completed.map((c) => getMonth(c.orderStatus.delivery_date));

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
    "November",
    "December",
  ];
  //returns ["1","","2", ""] where the numbers represent the frequency of order in a month
  function final() {
    let d = repeatMonths();
    return labels.map((l) => d[l] || "");
  }

  const data = {
    labels,
    datasets: [
      {
        label: `Sales by Month for ${selectedYear}`,
        fill: true,
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
        // data: [2, 7, 12, 5, 8, 14, 12, 1, 19, 30],
        data: final(),
      },
    ],
  };
  return (
    <div className="chart-comp">
      <h1>Sales Metrics</h1>
      {/* toggle between years  */}
      <div style={{ display: "flex" }}>
        {yearsArr.map((y, i) => (
          <div key={i}>
            <button
              aria-label="toggle chart data by year"
              onClick={() => setSelectedYear(y)}
              style={{
                padding: "0 4px",
                background: "#4BC0C0",
                margin: "0 5px",
                color: "whitesmoke",
                borderRadius: "3px",
              }}
            >
              {y}
            </button>
          </div>
        ))}
      </div>

      {/* the chart  */}
      <Line data={data} />
    </div>
  );
};
