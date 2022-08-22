import styled from "styled-components";
import "./App.css";
import { useState, useEffect } from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
      return () => {
        clearInterval(timeId);
      };
    }
  }, [gameHasStarted, birdPosition]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      setScore((score) => score + 1);
    }
    return () => {
      clearInterval(obstacleId);
    };
  }, [birdPosition, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWithTop =
      birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottom =
      birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;
    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollidedWithBottom || hasCollidedWithTop)
    ) {
      setGameHasStarted(false);
      setScore(-1)
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  // if(window.reload){
  //   setScore(0)
  // }

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    } else if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };
  return (
    <Div onClick={handleClick}>
      <GameBox width={GAME_WIDTH} height={GAME_HEIGHT}>
        <Obstacle
          top={0}
          height={obstacleHeight}
          width={OBSTACLE_WIDTH}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          height={bottomObstacleHeight}
          width={OBSTACLE_WIDTH}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span> {score}</span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span{
    position:absolute;
    font-size:24px;
    color:white;
  }
`;

const GameBox = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  background-color: green;
`;
