const port = process.env.PORT || 5000;

export const url = `http://localhost:${port}/api/`;

export const setHeaders = ()=>{
  const headers = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return headers;
}