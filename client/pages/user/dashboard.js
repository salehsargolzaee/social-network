import { useContext } from "react";
import { UserContext } from "../../context/index";
import UserRoute from "../../components/routes/UserRoute";

function Dashboard() {
  const { state, setState } = useContext(UserContext);

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5">
          <div className="col">
            <h1 className="display-1 text-center">dashboard page</h1>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}

export default Dashboard;
