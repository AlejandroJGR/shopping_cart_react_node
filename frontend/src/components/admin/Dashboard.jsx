import styled from "styled-components";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUsers, FaStore, FaClipboard, FaTachometerAlt } from "react-icons/fa";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAdmin) return <p className="access-denied">Access Denied.</p>;

  return (
    <StyledDashboard>
      <SideNav>
        <h3>Quick Links</h3>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-Active" : "link-Inactive"
          }
          to="/admin/summary"
        >
          <FaTachometerAlt className="margin-right" />
          Summary
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-Active" : "link-Inactive"
          }
          to="/admin/products"
        >
          <FaStore className="margin-right" />
          Products
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-Active" : "link-Inactive"
          }
          to="/admin/orders"
        >
          <FaClipboard className="margin-right" />
          Orders
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-Active" : "link-Inactive"
          }
          to="/admin/users"
        >
          <FaUsers className="margin-right" />
          Users
        </NavLink>
      </SideNav>
      <Content>
        <Outlet />
      </Content>
    </StyledDashboard>
  );
};

export default Dashboard;

const StyledDashboard = styled.div`
  display: flex;
  height: 100vh;
`;
const SideNav = styled.div`
  border-right: 1px solid grey;
  height: calc(100vh - 70px);
  position: fixed;
  overflow-y: auto;
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    padding: 0;
    font-size: 17px;
  }
  a {
    text-decoration: none;
    margin: 0 0 1rem 1rem;
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: 700;
    
    svg{
      font-size: 18px;
    }
  }
`;

const Content = styled.div`
  margin-left: 200px;
  padding: 2rem 3rem;
  width: 100%;
`;
