"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import (StatsView, MyFlashcardsSetView,SetRandomView, SetDetailsView,ProfileStatsView,SetFlashcardView, MyFlashcardSetsView, MyFlashcardsView, AllFlashcardsView, AllFlashcardSetsView, ChangePasswordView, FlashcardView, SetView, RegisterView )
app_name = "api" 

urlpatterns = [
    path('flashcards', AllFlashcardsView.as_view(), name='flashcard-list'),
    path('sets', AllFlashcardSetsView.as_view(), name='set-list'),
    path('sets/user', MyFlashcardSetsView.as_view(), name='set-list-user'),
    path('flashcards/user', MyFlashcardsView.as_view(), name='flashcard-list-user'),
    path('flashcards/user/<int:set_id>', MyFlashcardsSetView.as_view(), name='flashcard-list-user'),
    path('profileStats', ProfileStatsView.as_view(), name='profile-stats'),
    path('change-password', ChangePasswordView.as_view(), name='change-password'),
    path('my-flashcards', MyFlashcardsView.as_view(), name='my-flashcards'),
    path('flashcard/<int:pk>', FlashcardView.as_view(), name='flashcard-detail'),
    path('flashcard', FlashcardView.as_view(), name='flashcard'),
    path('sets/<int:pk>', SetView.as_view(), name='sets'),
    path('set/<int:pk>', SetView.as_view(), name='set'),
    path('set/random/<int:pk>', SetRandomView.as_view(), name='set-random'),
    path('set/all_data/<int:pk>', SetDetailsView.as_view(), name='set-all-data'),
    path('sets/flashcard/<int:setID>/<int:flashcardID>', SetFlashcardView.as_view(), name='set-flashcard'),
    path('set', SetView.as_view(), name='set-detail'),
    path('register', RegisterView.as_view(), name='register'),
    path('stats', StatsView.as_view(), name='stats'),
]
