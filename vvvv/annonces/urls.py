from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # Auth
    path('api/auth/login/', views.api_login, name='api_login'),
    path('api/auth/register/', views.api_register, name='api_register'),
    path('api/auth/logout/', views.api_logout, name='api_logout'),
    path('api/auth/me/', views.api_me, name='api_me'),

    # Annonces
    path('api/annonces/', views.api_annonces_list, name='api_annonces_list'),
    path('api/annonces/creer/', views.api_create_annonce, name='api_create_annonce'),
    path('api/annonces/<int:pk>/', views.api_annonce_detail, name='api_annonce_detail'),
    path('api/annonces/<int:pk>/modifier/', views.api_update_annonce, name='api_update_annonce'),
    path('api/annonces/<int:pk>/supprimer/', views.api_delete_annonce, name='api_delete_annonce'),
    path('api/annonces/<int:pk>/toggle-dispo/', views.api_toggle_dispo, name='api_toggle_dispo'),
    path('api/annonces/<int:pk>/incrementer/', views.api_incrementer_compteur, name='api_incrementer_compteur'),

    # Messages
    path('api/messages/', views.api_messages, name='api_messages'),
    path('api/messages/history/<int:partner_id>/', views.api_message_history, name='api_message_history'),

    # Visites & Dashboard
    path('api/dashboard/', views.api_dashboard, name='api_dashboard'),
    path('api/visites/', views.api_demande_visite, name='api_demande_visite'),
    path('api/visites/<int:pk>/repondre/', views.api_demande_visite_repondre, name='api_demande_visite_repondre'),

    # Admin endpoints
    path('api/admin/utilisateurs/', views.api_admin_users, name='api_admin_users'),
    path('api/admin/utilisateurs/<int:pk>/', views.api_admin_user_detail, name='api_admin_user_detail'),

    # SPA index fallback (matches everything else, excluding media, static, and admin)
    re_path(r'^(?!media/|static/|admin/).*$', views.index_view, name='index_fallback'),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
