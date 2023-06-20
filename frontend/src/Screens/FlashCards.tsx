import React, { useState, useEffect } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { School } from "@material-ui/icons";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles((theme) => ({
  list: {
    maxWidth: 500,
    margin: "0 auto",
  },
  listItem: {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: theme.shadows[4],
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
};

type Params = {
  id: string;
  title: string;
};

export default function FlashcardList() {
  const classes = useStyles();
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const { id, title } = useParams<Params>();

  const getFlashcards = () => {
    // fetch flashcards from API
    fetch("http://127.0.0.1:8000/api/sets/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcards(data));
  };

  useEffect(() => {
    getFlashcards();
  }, []);

  const removeFlashcard = (flashcardID: number) => {
    try {
      fetch(`http://127.0.0.1:8000/api/sets/flashcard/${id}/${flashcardID}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Deleted flashcard");
          } else {
            throw Error("Something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    getFlashcards();
  };

  return (
    <div className="flashcards-holder">
      <Typography variant="h4" gutterBottom align="center">
        Flashcards
      </Typography>
      {flashcards.length === 0 ? (
        <div>No flashcards in this set</div>
      ) : (
        <List className={classes.list}>
          {flashcards.map((flashcard) => (
            <div>
              <a>
                <ListItem
                  key={flashcard.id}
                  button
                  component={Link}
                  to={`/flashcards/${flashcard.id}`}
                  className={classes.listItem}
                >
                  <ListItemIcon className={classes.flashcardIcon}>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary={flashcard.title} />
                </ListItem>
              </a>
              <div>
                <button
                  className="delete-flashcard-btn"
                  type="submit"
                  onClick={() => removeFlashcard(flashcard.id)}
                >
                  Delete Flashcard
                </button>
              </div>
            </div>
          ))}
        </List>
      )}
    </div>
  );
}
