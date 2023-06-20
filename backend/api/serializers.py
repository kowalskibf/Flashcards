# import serializers from the REST framework
from rest_framework import serializers

from .models import Flashcard, Set_flashcards, Account
from django.contrib.auth.models import User

# create a serializer class
class FlashcardSerializer(serializers.ModelSerializer):
	set_flashcards_title = serializers.SerializerMethodField()
	set_flashcards_language = serializers.SerializerMethodField()
    
	def get_set_flashcards_title(self, obj):
		if obj.set_flashcards == None:
			return
		return obj.set_flashcards.title

	def get_set_flashcards_language(self, obj):
		if obj.set_flashcards == None:
			return
		return obj.set_flashcards.language

	# create a meta class
	class Meta:
		model = Flashcard
		fields = ('id', 'title','one_side','second_side', 'set_flashcards','set_flashcards_title','set_flashcards_language', 'author', "language")


class FlashcardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set_flashcards
        fields = ('id', 'title', 'user', 'description', 'language')

class FlashcardSetWithIDsSerializer(serializers.ModelSerializer):
    flashcards = serializers.SerializerMethodField()
    
    def get_flashcards(self, obj): 
        flashcards = Flashcard.objects.filter(set_flashcards = obj.id)
        flashcard_ids = [flashcard.id for flashcard in flashcards]
        return flashcard_ids

    class Meta:
        model = Set_flashcards
        fields = ('id', 'title', 'user', 'description', 'flashcards', 'language')

class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'