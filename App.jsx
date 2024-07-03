

 import { useEffect,useState } from 'react';
import './App.css'
import Board from './Components/Board'
import Editable from './Components/Board/Editable/Editable'

function App() {
  const initialBoards = [
    {
      id: 1,
      title: 'To Do',
      cards: [
        {
          id: 1,
          title: 'Sample Card 1',
          labels: [],
          date: '',
          tasks: [],
        },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      cards: [
        {
          id: 2,
          title: 'Sample Card 2',
          labels: [],
          date: '',
          tasks: [],
        },
      ],
    },
    {
      id: 3,
      title: 'Finished',
      cards: [
        {
          id: 3,
          title: 'Sample Card 3',
          labels: [],
          date: '',
          tasks: [],
        },
      ],
    },
  ];

  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem('trello-boards')) || initialBoards
  );

  const [targetCard, setTargetCard] = useState({
    bid: '',
    cid: '',
  });

  const addBoardHandler = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const addCardHandler = (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: '',
      tasks: [],
    });
    setBoards(tempBoards);
  };

  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    setTargetCard({
      bid: '',
      cid: '',
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem('prac-kanban', JSON.stringify(boards));
  }, [boards]);

  return (
    <div className="app">
      <div className="app_nav">
        <h1><center> TO DO</center> </h1>
      </div>
      <hr/>
       
      <div className="navbar">
      <h2>Dashboard</h2>
        <h3>sign up</h3>
        <h3>login</h3>
        <h3>about us</h3>
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
            />
          ))}
          <Editable
            displayClass="app_boards_add-board"
            editClass="app_boards_add-board_edit"
            placeholder="Enter Board Name"
            text="Add Board"
            buttonText="Add Board"
            onSubmit={addBoardHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default App;