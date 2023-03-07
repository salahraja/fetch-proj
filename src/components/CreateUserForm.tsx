"use client";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";

type Occupation = string;
interface State {
  name: string;
  abbreviation: string;
}
interface FormData {
  "full-name": string;
  email: string;
  password: string;
  occupation: Occupation;
  state: string;
}
interface User {
  name: string;
  email: string;
  password: string;
  occupation: Occupation;
  state: string;
}
interface APIGetResponse {
  occupations: Occupation[];
  states: State[];
}

// interface APIPostResponse

export default function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    "full-name": "",
    email: "",
    password: "",
    occupation: "",
    state: "",
  });
  const [apiData, setAPIData] = useState<APIGetResponse>({
    occupations: [],
    states: [],
  });
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://frontend-take-home.fetchrewards.com/form")
      .then((response) => response.json())
      .then((data: APIGetResponse) => {
        setAPIData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = data.get("fullName");
    const email = data.get("email");
    const password = data.get("password");
    const occupation = data.get("occupation");
    const state = data.get("state");
    const body = { fullName, email, password, occupation, state };

    fetch("https://frontend-take-home.fetchrewards.com/form", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .catch((error) => {
        setError(error.message);
      });
  }

  console.log(apiData);
  return (
    <form onSubmit={handleSubmit}>
      <div className="form">
        <label htmlFor="fullName">Full Name</label>
        <input type="text" name="fullName" id="fullName" />
      </div>

      <div className="form">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div className="form">
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <div className="form">
        <label htmlFor="occupation">Occupation</label>
        <select name="occupation" id="occupation">
          {apiData.occupations.map((occupation, index) => (
            <option key={index}>{occupation}</option>
          ))}
        </select>
      </div>
      <div className="form">
        <label htmlFor="state">State</label>
        <select name="state" id="state">
          {apiData.states.map((state, index) => (
            <option value={state.abbreviation} key={index}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
