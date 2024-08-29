import { Route, Routes } from "react-router-dom";
import Main from "../pages/main";
import Stroke from "../pages/stroke";

export const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="stroke" element={<Stroke />}></Route>
    </Routes>
  );
};
