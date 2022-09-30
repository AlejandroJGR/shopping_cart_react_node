import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { setHeaders, url } from "../../../features/api";

const Chart = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  function compare(a, b) {
    if (a._id < b._id) {
      return 1;
    }
    if (a._id > b._id) {
      return -1;
    }
    return 0;
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${url}orders/week-sales`, setHeaders());
        res.data.sort(compare);
        const newData = res.data.map((item) => {
          const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
          return {
            day: DAYS[item._id - 1],
            amount: item.total / 100,
          };
        });
        setSales(newData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const data = [
    {
      // name: "Page A",
      // uv: 4000,
      // pv: 2400,
      // amt: 2400,
      day: "Monday",
      amount: 4000,
    },
    {
      // name: "Page B",
      // uv: 3000,
      // pv: 1398,
      // amt: 2210,
      day: "Tuesday",
      amount: 3000,
    },
    // {
    //   name: "Page C",
    //   uv: 2000,
    //   pv: 9800,
    //   amt: 2290,
    // },
    // {
    //   name: "Page D",
    //   uv: 2780,
    //   pv: 3908,
    //   amt: 2000,
    // },
    // {
    //   name: "Page E",
    //   uv: 1890,
    //   pv: 4800,
    //   amt: 2181,
    // },
    // {
    //   name: "Page F",
    //   uv: 2390,
    //   pv: 3800,
    //   amt: 2500,
    // },
    // {
    //   name: "Page G",
    //   uv: 3490,
    //   pv: 4300,
    //   amt: 2100,
    // },
  ];
  return (
    <>
      {loading ? (
        <Loader>loading Chart... </Loader>
      ) : (
        <StyledChart>
          <h3>Last 7 Days Earnings (US$)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              // data={sales}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {/* <XAxis dataKey="name" /> */}
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                // dataKey="pv"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </StyledChart>
      )}
    </>
  );
};

export default Chart;

const StyledChart = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 2rem;
  padding: 1rem;
  border: 2px solid rgba(48, 51, 78, 0.2);
  border-radius: 5px;
  h3 {
    margin-bottom: 1rem;
  }
`;

const Loader = styled.p`
  margin-top: 2rem;
`;
