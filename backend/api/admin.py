from django.contrib import admin
from .models import Flashcard, Set_flashcards, Account
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
 
# create a class for the admin-model integration
class FlashcardAdmin(admin.ModelAdmin):
 
    # add the fields of the model here
    list_display = ("author", "title","one_side", "second_side", "set_flashcards")
 
admin.site.register(Flashcard,FlashcardAdmin)

class Set_flashcardsAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "user")
 
admin.site.register(Set_flashcards,Set_flashcardsAdmin)

class AccountInline(admin.StackedInline):
    model = Account
    can_delete = False
    verbose_name_plural = 'account'


class UserAdmin(BaseUserAdmin):
    inlines = (AccountInline,)

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            super().delete_model(request, obj)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)