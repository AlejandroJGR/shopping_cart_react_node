import UsersList from "./list/UsersList";
import { PrimaryButton } from "./CommonStyled";
import { useNavigate } from "react-router-dom";



const Users = () => {
  const navigate = useNavigate();
  return ( <>
    <UsersList/>
    <PrimaryButton
          onClick={() => navigate("/admin/products/create-user")}
        >
          Create
        </PrimaryButton>
  </> );
}
 
export default Users;