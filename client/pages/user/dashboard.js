import { useContext } from "react";
import { UserContext } from "../../context/index";
import UserRoute from "../../components/routes/UserRoute";

function Dashboard() {
  const { state, setState } = useContext(UserContext);

  return (
    <UserRoute>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center py-5">dashboard page</h1>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}

export default Dashboard;
