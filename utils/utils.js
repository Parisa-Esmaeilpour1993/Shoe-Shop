//Function to get token from local storage
export function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

//Function to set token in local storage
export function setTokenToLocalstorage(token) {
  localStorage.setItem("token", token);
  localStorage.setItem("loginTime", Date.now());
}
