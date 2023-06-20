import React, { useState, useEffect } from "react";
import { LANGUAGES } from "../Constants";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { School } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  list: {
    width: "55%",
    margin: "0 auto",
  },
  listItem: {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    backgroundColor: "white",
    width: "100%",
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: theme.shadows[4],
      backgroundColor: "#dcdcdc",
    },
  },
  listItemSelected: {
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  flashcardIcon: {
    color: theme.palette.primary.main,
  },
}));

type FlashCard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
  Set_flashcards: number | null;
  Set_flashcards_title: string;
  language: string;
};

const flashcardsPerPage = 5;

export default function FlashcardsList(Props: {
  toggle: (arg0: number) => void;
  selectedFlashcardId: number[];
  setID?: string | undefined;
  searching?: string;
  language?: string;
  currentPage: any;
  setCurrentPage: any;
}) {
  const classes = useStyles();
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let url: string;
    // fetch flashcards from API
    if (Props.setID) {
      url = "http://127.0.0.1:8000/api/flashcards/user/" + Props.setID;
    } else {
      url = "http://127.0.0.1:8000/api/flashcards/user";
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const searchTerm = Props.searching ?? ""; // Default to empty string if Props.searching is undefined
        if (searchTerm) {
          const filteredFlashcards = data.filter((flashcard: FlashCard) =>
            flashcard.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFlashcards(filteredFlashcards);
        } else {
          setFlashcards(data);
        }
      });
  }, [Props]);

  const handleFlashcardClick = (id: number) => {
    Props.toggle(id);
  };

  // Sort flashcards based on language
  let sortedFlashcards = flashcards;
  if (Props.language && Props.language !== "") {
    const languageFlashcards = flashcards.filter(
      (flashcard) => flashcard.language === Props.language
    );
    const otherFlashcards = flashcards.filter(
      (flashcard) => flashcard.language !== Props.language
    );
    sortedFlashcards = [...languageFlashcards, ...otherFlashcards];
  }

  // Get current flashcards
  const indexOfLastFlashcard = Props.currentPage * flashcardsPerPage;
  const indexOfFirstFlashcard = indexOfLastFlashcard - flashcardsPerPage;
  const currentFlashcards = sortedFlashcards.slice(
    indexOfFirstFlashcard,
    indexOfLastFlashcard
  );
  // Change page
  const paginate = (pageNumber: number) => Props.setCurrentPage(pageNumber);

  return (
    <>
      <Typography variant="h4" gutterBottom align="center">
        Flashcards
      </Typography>
      <div className="create-set-list">
        <List className={classes.list}>
          {currentFlashcards.map((flashcard) => (
            <ListItem
              key={flashcard.id}
              button
              className={`${classes.listItem} ${
                Props.selectedFlashcardId.includes(flashcard.id)
                  ? classes.listItemSelected
                  : ""
              }`}
              onClick={() => handleFlashcardClick(flashcard.id)}
            >
              <ListItemIcon className={classes.flashcardIcon}>
                {/*<School />sdsdsd*/}
                {LANGUAGES.map(([code, name, flag]) =>
                  code === flashcard.language ? <>{flag}</> : ""
                )}
              </ListItemIcon>
              <ListItemText
                primary={flashcard.title}
                secondary={
                  flashcard.Set_flashcards !== null
                    ? flashcard.Set_flashcards_title
                    : ""
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
      <div className="pagination">
        {Array.from(
          {
            length: Math.ceil(flashcards.length / flashcardsPerPage),
          },
          (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => paginate(i + 1)}
              className={`pagination-button ${
                Props.currentPage === i + 1 ? "active" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </>
  );
}
