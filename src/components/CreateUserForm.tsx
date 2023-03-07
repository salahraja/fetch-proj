"use client";
import React, {useEffect, useState } from "react";
import type { FormEvent } from "react";

type Occupation = string;
interface State {
  name: string;
  abbreviation: string;
}
interface formData {
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

export default function Userform() {
  const [apiData, setAPIData] = useState<APIGetResponse>({
    occupations: [],
    states: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const occupation = data.get("occupation");
    const state = data.get("state");
    const body = { name, email, password, occupation, state };

    setError("");
    setIsSuccessful(false);

    fetch("https://frontend-take-home.fetchrewards.com/form", {
      method: "POST",
      // important, fails without content type header set to application/json
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error("Invalid submission");
        } else if (response.status !== 201) {
          throw new Error("Unknown error");
        }

        setIsSuccessful(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      <>{error && <div className="error">{error}</div>}</>
      <>{isSuccessful && <div className="success">form submitted, thank you.</div>}</>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" id="name" required />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        <div className="form-field">
          <label htmlFor="occupation">Occupation</label>
          <select name="occupation" id="occupation" required>
            {apiData.occupations.map((occupation, index) => (
              <option key={index}>{occupation}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="state">State</label>
          <select name="state" id="state" required>
            {apiData.states.map((state, index) => (
              <option value={state.abbreviation} key={index}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="pl-[55%]">
        <button type="submit">Submit</button></div>
      </form>
    </>
  );
}
