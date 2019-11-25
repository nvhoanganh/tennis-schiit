import React from "react";

export interface IHomeProps {
  [name: string]: any;
}

const Home: React.SFC<IHomeProps> = props => {
  console.log("matched ", props.match.params.group);
  return <h1>Welcome to App</h1>;
};

export default Home;
