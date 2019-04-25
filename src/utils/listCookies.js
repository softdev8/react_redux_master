export default  () => {
  const theCookies = document.cookie.split(';');
  const res = {};
  for (let i = 0; i < theCookies.length; i++) {
    res[i] = theCookies[i];
  }
  return res;
};