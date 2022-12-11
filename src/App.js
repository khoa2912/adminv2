// project import
import Routes from "routes";
import ThemeCustomization from "themes";
import ScrollTop from "components/ScrollTop";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { getUser, isUserLoggedIn } from "actions/auth";
import { getInitialData } from "actions/initialData";
import { getProducts } from "actions/product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import warningAudio from "./assets/iphone_sound.mp3";
import io from "socket.io-client";
const socket = io.connect("https://apishoplaptop.onrender.com");
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = (props) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const token = window.localStorage.getItem("token");
  const warningAudioRef = useRef(null);
  notification.config({
    placement: "topRight",
    top: 80,
    duration: 3,
    rtl: false,
  });
  useEffect(() => {
    if (!token) {
      if (window.location.pathname !== "/login") {
        navigate("/login");
        notification["error"]({
          message: "Đăng nhập",
          description: "Vui lòng đăng nhập để sử dụng hệ thống.",
        });
      }
    }
  }, []);
  useEffect(() => {
    let timeout;
    socket.on("notificationAddOrder", (data) => {
      warningAudioRef.current.play();
      toast.success(data.data);
      timeout = setTimeout(() => {
        warningAudioRef.current.pause();
      }, 6000);
    });

    return () => {
      clearTimeout(timeout);
      //   socket.on("disconnect", () => {
      //     console.log(socket.id);
      //     // undefined
      //   });
    };
  }, [socket]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUser(token, props.history));
    }
    dispatch(getProducts());
  }, [dispatch, auth.token]);
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
    if (auth.authenticate) {
      dispatch(getInitialData());
    }
  }, [auth.authenticate]);
  return (
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
        <ToastContainer />
        <audio ref={warningAudioRef} loop>
          <source src={warningAudio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
