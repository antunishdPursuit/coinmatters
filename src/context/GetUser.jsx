import { createContext, useContext, useState, useEffect, useRef } from "react"
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
  // the lists remember whose they are, so another account's never show, even for a moment
  const [ savedLists, setSavedLists] = useState({ userId: undefined, data: {}, error: false })
  // each lists request takes a number; only the latest one may change the lists,
  // and only while its user is still the one logged in
  const listRequest = useRef(0)
  const activeUserId = useRef(undefined)
  const location = useLocation();

  const instance = axios.create({
    withCredentials: true,
  })

  // Logging in the user. The promise rejects with a message for the form.
  const logInUser = (existingUser) => {
    return instance
      .post(`${API}/login`, existingUser)
      .then((res) => {
        activeUserId.current = res.data.user.user_id
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
          activeUserId.current = checkedUser.user_id
          setLoggedIn(true)
          setUser((current) => current?.user_id === checkedUser.user_id ? current : checkedUser)
        }
      })
      .catch(() => {
        // If the server responds with an error status, the cookie does not exist,
        // or the session ran out
        if (!stale) {
          setLoggedIn(false)
          clearUser()
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
    // a different account drops any lists answer still on its way for the last one
    listRequest.current += 1
    if (user?.user_id) {
      getUserList(user.user_id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // get user list
  const getUserList = (userId) => {
    // a save or delete that finishes after logging out has no lists to refresh
    if (userId !== activeUserId.current) {
      return Promise.resolve()
    }
    const request = ++listRequest.current
    const current = () => request === listRequest.current && userId === activeUserId.current
    return instance
      .get(`${API}/lists/user/${userId}`)
      .then((res) => {
        if (current()) {
          setSavedLists({ userId, data: res.data, error: false })
        }
      })
      .catch(() => {
        if (current()) {
          setSavedLists((saved) => saved.userId === userId ? { ...saved, error: true } : { userId, data: {}, error: true })
        }
      });
  }

  // forgets the user, and any lists answer still on its way
  const clearUser = () => {
    listRequest.current += 1
    activeUserId.current = undefined
    setUser({})
    setSavedLists({ userId: undefined, data: {}, error: false })
  }

  const ownLists = user?.user_id !== undefined && savedLists.userId === user.user_id
  const userList = ownLists ? savedLists.data : {}
  const listsError = ownLists && savedLists.error

  // after the server has cleared the cookie
  const logout = () => {
    setLoggedIn(false)
    clearUser()
  }

  return (
    <AuthContext.Provider value={{user, logInUser, logout, getUserList, loggedIn, authChecked, userList, listsError}}>
        <App></App>
    </AuthContext.Provider>
  )
}