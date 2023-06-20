from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator

LANGUAGES = [
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('de', 'German'),
        ('zh', 'Chinese'),
        ('hi', 'Hindi'),
        ('ar', 'Arabic'),
        ('pt', 'Portuguese'),
        ('ru', 'Russian'),
        ('ja', 'Japanese'),
        ('ko', 'Korean'),
        ('it', 'Italian'),
        ('tr', 'Turkish'),
        ('nl', 'Dutch'),
        ('sv', 'Swedish'),
        ('pl', 'Polish'),
        ('fa', 'Persian'),
        ('fi', 'Finnish'),
        ('cs', 'Czech'),
        ('id', 'Indonesian'),
        ('he', 'Hebrew'),
    ]


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_flashcards = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    created_sets = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    finished_tests = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    passed_tests = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    total_languages = models.IntegerField(validators=[MinValueValidator(0)], default=0)


    def __str__(self):
        return self.user.username



@receiver(post_save, sender=User, dispatch_uid="create_account")
def create_account(sender, instance, **kwargs):
    #  Creates Account if new user
    if not Account.objects.filter(user=instance):
        account = Account(user=instance)
        account.save()


# Create your models here.
class Set_flashcards(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='set_flashcards')
    language = models.CharField(max_length=2, choices=LANGUAGES, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Sets flashcards"

class Flashcard(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author")
    title=models.CharField(max_length=150)
    one_side=models.CharField(max_length=500)
    second_side=models.CharField(max_length=500)
    set_flashcards = models.ForeignKey(Set_flashcards, on_delete=models.SET_NULL, related_name='Flashcards', null=True, blank=True)
    language = models.CharField(max_length=2, choices=LANGUAGES, blank=True)

    def __str__(self):
        return self.title
    

    class Meta:
        verbose_name_plural = "Flashcards"
