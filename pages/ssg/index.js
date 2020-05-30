import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { incrementCounter, decrementCounter } from "../../store/counter/action";

const Users = ({ users, error }) => {
  const globalState = useSelector((state) => state.counter.counter);
  const dispatch = useDispatch();

  return (
    <section>
      <h1>GLOBAL COUNTER: {globalState}</h1>
      <button onClick={() => dispatch(incrementCounter(globalState))}>
        Increment +
      </button>
      {"  "}
      <button onClick={() => dispatch(decrementCounter(globalState))}>
        Decrement -
      </button>
      <br />
      <p>
        Try to reload this page or open a new tab or view this page another
        time.
        <br />
        You will see the same value everytime. Because the global state is
        persistent and saved in the localstorage
      </p>
      <header>
        <h1>An External API Call</h1>
        <p>
          just to show how next redux wrapper works with getStaticProps based
          Static Site Generation.
        </p>
      </header>
      {error && <div>There was an error.</div>}
      {!error && users && (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, key) => (
              <tr key={key}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

const fetchData = async () =>
  await axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((res) => ({
      error: false,
      users: res.data,
    }))
    .catch(() => ({
      error: true,
      users: null,
    }));

export const getStaticProps = async () => {
  const data = await fetchData();

  return {
    props: data,
  };
};

export default Users;
