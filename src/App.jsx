
import React from "react";

const Header = () => {
  return <div>Header</div>;
};

const Part = (props) => {
  return (
    <div>
      <p>{props.name}</p>
      <p>{props.duration}</p>
    </div>
  );
};

const Content = (props) => {
  const part1 = props.parts[0];
  const part2 = props.parts[1];
  const part3 = props.parts[2];
  return (
    <>
      <Part name={part1.name} duration={part1.duration} />
      <Part name={part2.name} duration={part2.duration} />
      <Part name={part3.name} duration={part3.duration} />
    </>
  );
  

  

};

const Footer = () => {
  return <div>blablabla</div>;
};

const App = () => {
  const parts = [
    { name: "Liam", duration: "6 år" },
    { name: "Elsa", duration: "4 år" },
    { name: "Evert", duration: "3 mån" },
  ];
  return (
    <div>
      <Header />
      <Content parts={parts} />
      <Footer />
    </div>
  );
};

export default App;