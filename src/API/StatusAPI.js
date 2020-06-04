import axios from "axios";

export default axios.create({
  baseURL: "http://www.breakermex.com/StatusAPI/data",
});
