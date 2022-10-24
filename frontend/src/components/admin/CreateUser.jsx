import { useState } from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import { usersCreate } from "../../features/usersSlice";
import { PrimaryButton } from "./CommonStyled";

const CreateUser = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");


  const handleSubmit = (e)=>{
    e.preventDefault();

    dispatch(usersCreate({
      name,
      email,
      password,
      rol,
    }));
  }

  return (
    <StyledCreateUser>
      <StyledForm onSubmit={handleSubmit}>
        <h3>Create a user</h3>
        <select onChange={(e) => setRol(e.target.value)} required>
          <option value="">Select user rol</option>
          <option value="Admin">Admin</option>
          <option value="customer">customer</option>
        </select>
        <input
          type="text"
          required
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton type="submit">
          Submit
        </PrimaryButton>
      </StyledForm>
    </StyledCreateUser>
  );
};

export default CreateUser;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;
  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;
    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }
  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledCreateUser = styled.div`
  display: flex;
  justify-content: space-between;
`;
