
import { AppRouter } from "../routes";
import "../assets/general.css";
import { Helmet } from "react-helmet";

export const App = () => {
  return (
    <>
    <Helmet>
      <link rel="icon" href="../assets/logo_servmais_app_icone.ico" type="image/x-icon" sizes="16x16" />
    </Helmet>
    <AppRouter />
    </>
  );
}
export default App;