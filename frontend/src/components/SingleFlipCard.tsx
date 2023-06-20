import React, { useEffect, useState } from "react";
import "../App.css";

type Props = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
};

export default function SingleFlipCard(props: Props) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  useEffect(() => {
    setIsFlipped(false);
  }, [props]);

  // console.log(props);
  return (
    <div className="flipcard-holder">
      {/* <h1>{props.title}</h1> */}
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""}`}
        onClick={handleClick}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <h2>{props.one_side}</h2>
            <p>Click to flip</p>
          </div>
          <div className="flip-card-back">
            <h2>{props.second_side}</h2>
            <p>Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
}
