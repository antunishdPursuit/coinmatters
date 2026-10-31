import { createContext, useContext, useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import axios from "axios";
import App from "../Routes";
const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL;

export const AuthWrapper = () => {
  const [ loggedIn, setLoggedIn] = useState(false)
  // false until the first login check answers, so pages for logged-in users
  // wait instead of sending a logged-in visitor away on a reload
  const [ authChecked, setAuthChecked] = useState(false)
  const [ user, setUser ] = useState({})
  const [ userList, setUserList] = useState({})
  const location = useLocation();

  const instance = axios.create({
    withCredentials: true,
  })

  // Logging in the user. The promise rejects with a message for the form.
  const logInUser = (existingUser) => {
    return instance
      .post(`${API}/login`, existingUser)
      .then((res) => {
        setUser(res.data.user)
        setLoggedIn(true)
      })
      .catch((error) => {
        throw new Error(error.response?.status === 401
          ? "That email and password don't match an account."
          : error.response?.data?.error || "We couldn't log you in. Please try again.");
      });
  };

    //Makes it so that every time the route changes, the function is triggered
  // Disable exhaustive-deps linting for the following lines
    useEffect(() => {
    // an answer that arrives after the next page's check has started is ignored,
    // so it can't undo a log in that happened in between
    let stale = false
    axios
      .get(`${import.meta.env.VITE_API_URL}/check-login`, { withCredentials: true })
      .then((response) => {
        // If the server responds with a success status, the cookie exists
        // The check answers with the logged-in user, which may have changed in
        // another tab; their lists are fetched again only when it does
        if (!stale) {
          const checkedUser = response.data.user
          setLoggedIn(true)
          setUser((current) => current?.user_id === checkedUser.user_id ? current : checkedUser)
        }
      })
      .catch(() => {
        // If the server responds with an error status, the cookie does not exist,
        // or the session ran out
        if (!stale) {
          setLoggedIn(false)
          setUser({})
          setUserList({})
        }
      })
      .finally(() => {
        if (!stale) {
          setAuthChecked(true)
        }
      });
    return () => { stale = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Disable exhaustive-deps linting for the following lines
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user?.user_id) {
      getUserList(user.user_id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // get user list
  const getUserList = (userId) => {
    return instance
      .get(`${API}/lists/user/${userId}`)
      .then((res) => {
        setUserList(res.data)
      })
      .catch((error) => {
          console.error("catch", error);
      });
  }

  // after the server has cleared the cookie
  const logout = () => {
    setLoggedIn(false)
    setUser({})
    setUserList({})
  }

  return (
    <AuthContext.Provider value={{user, logInUser, logout, getUserList, loggedIn, authChecked, userList}}>
        <App></App>
    </AuthContext.Provider>
  )
}