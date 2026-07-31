from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('', views.site, name='site'),
    path('accueil/', views.accueil, name='accueil'),
    path('profil/', views.profil, name='profil'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('annonce/' , views.annonce_view, name='annonce'),
    path('annonce/<int:annonce_id>/publier/', views.publier,  name='publier'),
    path('annonce/confirme/<int:annonce_id>/', views.publier_confirme, name='publier_confirme'),
    path('site/' , views.site , name='site'),
    path('vente/' , views.vente , name='vente'),
    path('location/' , views.location , name='location'),
    path('publications/', views.publications, name='publications'),
    path('supprimer-annonce/<int:id>/', views.supprimer_annonce, name='supprimer_annonce'),
    path('modifier-annonce/<int:id>/', views.modifier_annonce, name='modifier_annonce'),
    path('annonce/<int:annonce_id>/toggle-dispo/', views.basculer_disponibilite, name='toggle_disponibilite'),
    path('annonce/<int:annonce_id>/incrementer/', views.incrementer_compteur, name='incrementer_compteur'),
    path('admin/utilisateurs/', views.admin_users_list, name='admin_users_list'),
    path('admin/utilisateurs/<int:pk>/', views.admin_user_detail, name='admin_user_detail')
    # ... autres routes (modifier, supprimer) ...
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
