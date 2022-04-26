export default function authHeader() {
    const auth = JSON.parse(localStorage.getItem('auth'));
  
    if (auth && auth.accessToken) {
      return {headers: { 'Authorization': 'Bearer ' + auth.accessToken }};
    //   return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  }
  