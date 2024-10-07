import { jwtDecode } from "jwt-decode";

export default {
  parse(token) {
    return jwtDecode(token);
  },
};
