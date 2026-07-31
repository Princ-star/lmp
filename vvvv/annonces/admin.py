from django.contrib import admin
from .models import CustomUser, Annonce, Images, ClicAnnonce

admin.site.register(CustomUser)
admin.site.register(Annonce)
admin.site.register(Images)
admin.site.register(ClicAnnonce)

