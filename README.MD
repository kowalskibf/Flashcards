# Simple Django + React app to memorize foreign words.

This app was made as a project for PAP (Programowanie Aplikacyjne - Application Programming) subject during the 2023 Summer semester.

The app lets user to create flashcards, input the word, translation, language, assign them to his sets (which user can also create, edit, etc.) and study them with 3 modes:
- Study - user can go through his (if he wants - filtered by set or language) flashcards and sets and learn by looking at the words and translations
- Writing mode - user can choose a set of flashcards and learn by writing translations of the words given
- Test mode - user can choose a set to learn and then try to pass a test. In the test mode user cannot correct his answer and at the end there are his results shown.
The app also lets the user level up his achievements, such as achievement for creating flashcards, passing tests (80%+ correct answers), etc.

This app was supposed to be done in a team of 4 people. In theory, we had 4 people in our group, but in reality, 2 of them could not even do simple CSS, so did literally nothing. Everything in the project was made by me and by my friend. He initialized the whole project. The project consisted of 4 stages. The first of them was bringing up the idea. The second stage was a prototype of the application (meaning creating a functioning base for the project). The third stage was a finished application. The fourth stage was finished application with some minor upgrades).

# What I did in the second stage:
- Backend
	- Fixed GET method for getting user's sets of flashcards
	- Added POST method for creating a new flashcard
- Frontend
	- Added page where user can create a new flashcard (basic HTML + React Router)
	- Connected existing POST method for creating a new flashcard with a website mentioned above
	- Added some CSS to the login page

# What I did in the third stage:
- Backend
	- Added Changing Password functionality
	- DELETE method for flashcards
	- DELETE method for sets of flashcards
	- Tidied up the Backend code (clean get(), post(), put(), delete() syntax)
	- PUT method for flashcards (editing flashcaards)
	- PUT method for sets of flashcards (editing sets)
	- Added Registration functionality
- Frontend
	- Feedback after user's action such as creating a new flashcard (div at the top of the page informing user if action was successful or there was an error)
	- Changing Password page
	- Deleteing flashcards (button near each flashcard)
	- Deleting sets of flashcards (button near each set)
	- Added redirecting to /login if user is not logged in
	- Edit flashcard page
	- Edit set page (some things were done by someone else)
	- Writing mode
	- Test mode
	- Register page + whole design and functionality
	- LandingPage + whole design and functionality
	- Login page better design
	- Home page fully redesigned
	- Profile page + achievements, whole design and functionality
	- Automated Achievements renreding
	- Fixes of what anyone else did with design on other pages
	- Added countries' flags

# What I did in the fourth stage:
- Backend
	- Fixed changing user stats, such as flashcards created, after creating, editing or removing flashcard with language None
- Frontend
	- Full responsiveness of LandingPage, Registration page, Login page, Home page, Change password page, profile page with achievements
	- Typos fixes
	- Added achievement for scoring at least 80% on a test

# Installation guide

```
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install djoser
pip install django-rest-authtoken
```


Install NodeJS and npm
https://nodejs.org/en/

1. In folder backend type:
```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
2. In folder frontend type:

```
npm install
npm start
```
