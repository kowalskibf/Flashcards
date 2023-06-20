# import view sets from the REST framework
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FlashcardSerializer, FlashcardSetSerializer, FlashcardSetWithIDsSerializer, AccountSerializer
from rest_framework import status
from django.db.models import F, Value, Case, When
from django.db import models
# import the Flashcard model from the models file
from .models import Flashcard, Set_flashcards, Account
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

# change password
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated 
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


import json

class MyFlashcardSetsView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        sets = Set_flashcards.objects.filter(user=request.user)
        serializer = FlashcardSetSerializer(sets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FlashcardSetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyFlashcardsView(APIView):
    # permission_classes = [AllowAny]
    # authentication_classes=[TokenAuthentication]
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        flashcards = Flashcard.objects.filter(author=request.user)
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FlashcardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyFlashcardsSetView(APIView):
    # permission_classes = [AllowAny]
    # authentication_classes=[TokenAuthentication]
    def get(self, request, set_id):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            set = Set_flashcards.objects.get(pk=set_id)
        except Set_flashcards.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        flashcards = Flashcard.objects.filter(author=request.user).annotate(
            set_flashcard_order=Case(
                When(set_flashcards=set, then=Value(0)),
                default=Value(1),
                output_field=models.IntegerField(),
            )
        ).order_by('set_flashcard_order')

        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)


class AllFlashcardsView(APIView):
    # permission_classes = [AllowAny]
    # authentication_classes=[SessionAuthentication]

    def get(self, request):
        flashcards = Flashcard.objects.all()
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)


class AllFlashcardSetsView(APIView):
    def get(self, request):
        sets = Set_flashcards.objects.all()
        serializer = FlashcardSetSerializer(sets, many=True)
        return Response(serializer.data)
        
class ProfileStatsView(APIView):
    authentication_classes=[TokenAuthentication]
    def get(self, request):
        try:
            user = request.user
            users_sets = Set_flashcards.objects.filter(user=user).count()
            users_flashcards = Flashcard.objects.filter(author=user).count()
            data = {"sets" : users_sets, "flashcards" : users_flashcards}
            return Response(data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class FlashcardView(APIView):
    authentication_classes=[TokenAuthentication]
    
    def get(self, request, pk):
        try:
            flashcard = Flashcard.objects.get(pk=pk)
        except Flashcard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = FlashcardSerializer(flashcard)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            user = request.user
            body = json.loads(request.body)
            account = Account.objects.get(user=user)
            same_languages = Flashcard.objects.filter(language=body["language"], author=user).count()
            if body["language"] == "":
                Flashcard(author=user, title=body["title"], one_side=body["one_side"], second_side=body["second_side"]).save()
            else:
                Flashcard(author=user, title=body["title"], one_side=body["one_side"], second_side=body["second_side"], language=body["language"]).save()
            account.created_flashcards += 1
            
            if not same_languages and not body["language"] == "":
                account.total_languages += 1
            account.save()
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, pk):
        try:
            user = request.user
            body = json.loads(request.body)
            flashcard = Flashcard.objects.get(author=user, id=body["id"])
            old_lang_count = Flashcard.objects.filter(language=flashcard.language, author=user).count()
            new_lang_count = Flashcard.objects.filter(language=body["language"], author=user).count()
            account = Account.objects.get(user=user)
            if old_lang_count == 1 and not flashcard.language == "":
                account.total_languages -= 1
            if(new_lang_count == 0 and not body["language"] == ""):
                account.total_languages += 1
            account.save()
            flashcard.title = body["title"]
            flashcard.one_side = body["one_side"]
            flashcard.second_side = body["second_side"]
            flashcard.language = body["language"]
            flashcard.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            user = request.user
            flashcard = Flashcard.objects.get(id=pk, author=user)
            same_languages = Flashcard.objects.filter(language=flashcard.language, author=user).count()
            flashcard.delete()
            account = Account.objects.get(user=user)
            account.created_flashcards -= 1
            if same_languages == 1 and not flashcard.language == "":
                account.total_languages -= 1
            account.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class SetDetailsView(APIView):
    authentication_classes=[TokenAuthentication]

    def get(self, request, pk):
        try:
            set_flashcards = Set_flashcards.objects.get(pk=pk)
        except Set_flashcards.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = FlashcardSetWithIDsSerializer(set_flashcards)
        return Response(serializer.data)
     
class SetView(APIView):
    authentication_classes=[TokenAuthentication]

    def get(self, request, pk):
        try:
            set_flashcards = Set_flashcards.objects.get(pk=pk)
        except Set_flashcards.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        flashcards = Flashcard.objects.filter(set_flashcards=Set_flashcards)
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            user = request.user
            body = json.loads(request.body)
            if body["language"] != "":
                new_set = Set_flashcards(user=user, title=body["title"], description=body["description"], language=body["language"])
            else:
                new_set = Set_flashcards(user=user, title=body["title"], description=body["description"])
            new_set.save() 
            account = Account.objects.get(user=user)
            account.created_sets += 1
            account.save()
            for flashcard_id in body["flashcards"]:
                try:
                    flashcard = Flashcard.objects.get(id=flashcard_id)
                except Flashcard.DoesNotExist:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                flashcard.set_flashcards = new_set
                flashcard.save()
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, pk):
        try:
            user = request.user
            body = json.loads(request.body)
            try:
                set_flashcards = Set_flashcards.objects.get(user=user, id=body["id"])
            except Exception as e:
                print(e)
            set_flashcards.title = body["title"]
            set_flashcards.description = body["description"]
            set_flashcards.language = body["language"]
            set_flashcards.save()
            flashcards = Flashcard.objects.filter(set_flashcards=set_flashcards)
            for flashcard in flashcards:
                try:
                    flashcard.set_flashcards = None
                    flashcard.save()
                except Exception as e:
                    print(e)
            for flashcard_id in body["flashcards"]:
                try:
                    flashcard = Flashcard.objects.get(id=flashcard_id)
                except Flashcard.DoesNotExist:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                flashcard.set_flashcards = set_flashcards
                flashcard.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

    def delete(self, request, pk):
        try:
            user = request.user
            Set_flashcards.objects.filter(id=pk, user=user).delete()
            account = Account.objects.get(user=user)
            account.created_sets -= 1
            account.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    
class SetRandomView(APIView):
    authentication_classes=[TokenAuthentication]

    def get(self, request, pk):
        try:
            set_flashcards = Set_flashcards.objects.get(pk=pk)
        except set_flashcards.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        flashcards = Flashcard.objects.filter(set_flashcards=set_flashcards).order_by('?')
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)
    
class SetFlashcardView(APIView):
    authentication_classes=[TokenAuthentication]

    def delete(self, request, setID, flashcardID):
        try:
            set = Set_flashcards.objects.get(pk=setID)
        except Set_flashcards.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            flashcard = Flashcard.objects.get(set_flashcards=set, id=flashcardID)
            flashcard.set_flashcards = None
            flashcard.save()
        except Flashcard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_200_OK)
    
class RegisterView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    authentication_classes=[SessionAuthentication]

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        try:
            if(User.objects.filter(username=body["username"]).count() > 0):
                return Response(status=status.HTTP_409_CONFLICT)
            try:
                validate_email(body["email"])
            except ValidationError as e:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            newUser = User(username=body["username"], email=body["email"])
            newUser.set_password(body["password"])
            newUser.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class StatsView(APIView):
    authentication_classes=[TokenAuthentication]

    def get(self, request):
        try:
            user = request.user
            account = Account.objects.get(user=user)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
    def put(self, request):
        try:
            user = request.user
            account = Account.objects.get(user=user)
            account.finished_tests += 1
            try:
                body = json.loads(request.body)
                if body["score"] >= 0.8:
                    account.passed_tests += 1
            except:
                pass
            account.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

