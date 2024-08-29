import { Route, Routes } from "react-router-dom";
import Main from "../pages/main";
import Stroke from "../pages/stroke";
import NotFound from "../pages/error";

export const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="stroke" element={<Stroke />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
};
