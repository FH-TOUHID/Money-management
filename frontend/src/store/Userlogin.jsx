import { loginUser } from "./userslice";

// Compatibility wrapper for your existing LoginPage import.
export const Userlogin = (email, password, navigate) => async (dispatch) => {
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    navigate("/");
    return { success: true };
  } catch (message) {
    return { success: false, message };
  }
};
