from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.db import transaction, models
from django.db.models import Q, F
from decimal import Decimal
import json
import os
from django.conf import settings
from datetime import date, datetime
from .models import CustomUser, Annonce, Images, Message, DemandeVisite

def serialize_annonce(annonce, request=None):
    images = []
    for img in annonce.images.all():
        url = img.image.url if img.image else ""
        if request and url:
            url = request.build_absolute_uri(url)
        images.append({
            'id': img.id,
            'image_url': url,
            'est_disponible': img.est_disponible
        })
    
    photo_principale = images[0]['image_url'] if len(images) > 0 else ""

    return {
        'id': annonce.id,
        'titre': f"{annonce.get_standing_display()} — {annonce.quartier}",
        'type_annonce': annonce.type_annonce,
        'standing': annonce.standing,
        'get_standing_display': annonce.get_standing_display(),
        'prix': float(annonce.prix),
        'description': annonce.description,
        'quartier': annonce.quartier,
        'coordonnes_google_maps': annonce.coordonnes_google_maps,
        'numero_telephone': str(annonce.numero_telephone),
        'date_creation': annonce.date_creation.isoformat(),
        'est_publiee': annonce.est_publiee,
        'est_disponible': annonce.est_disponible,
        'nbr_vues': annonce.nbr_vues,
        'nbr_clics': annonce.nbr_clics,
        'photo_principale': photo_principale,
        'images': images,
        'utilisateurs': {
            'id': annonce.utilisateurs.id,
            'email': annonce.utilisateurs.email,
            'nom': annonce.utilisateurs.nom,
            'prenom': annonce.utilisateurs.prenom,
        }
    }

# ================= AUTHENTICATION ENDPOINTS =================

@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'error': 'Email et mot de passe requis'}, status=400)
            
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                'id': user.id,
                'email': user.email,
                'nom': user.nom,
                'prenom': user.prenom,
                'type_utilisateur': getattr(user, 'type_utilisateur', 'locataire'),
                'is_admin': user.is_admin
            })
        else:
            return JsonResponse({'error': 'Identifiants invalides'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        nom = data.get('nom')
        prenom = data.get('prenom')
        date_naiss_str = data.get('date_de_naissance') # YYYY-MM-DD
        type_utilisateur = data.get('type_utilisateur', 'locataire')
        
        if not all([email, password, nom, prenom, date_naiss_str]):
            return JsonResponse({'error': 'Champs obligatoires manquants'}, status=400)
            
        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Un utilisateur avec cet email existe déjà'}, status=400)
            
        date_naiss = datetime.strptime(date_naiss_str, "%Y-%m-%d").date()
        user = CustomUser.objects.create_user(
            email=email,
            nom=nom,
            prenom=prenom,
            date_de_naissance=date_naiss,
            password=password,
            type_utilisateur=type_utilisateur
        )
        login(request, user)
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'nom': user.nom,
            'prenom': user.prenom,
            'type_utilisateur': user.type_utilisateur,
            'is_admin': user.is_admin
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_logout(request):
    logout(request)
    return JsonResponse({'status': 'Déconnecté avec succès'})

def api_me(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})
    return JsonResponse({
        'authenticated': True,
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'nom': request.user.nom,
            'prenom': request.user.prenom,
            'type_utilisateur': getattr(request.user, 'type_utilisateur', 'locataire'),
            'is_admin': request.user.is_admin
        }
    })

# ================= ANNONCES ENDPOINTS =================

def api_annonces_list(request):
    annonces = Annonce.objects.filter(est_publiee=True).select_related('utilisateurs').prefetch_related('images')
    
    # Filtres
    prix_max = request.GET.get('prix')
    quartier = request.GET.get('quartier')
    standing = request.GET.get('standing')
    type_annonce = request.GET.get('type_annonce')
    
    if prix_max:
        try:
            annonces = annonces.filter(prix__lte=Decimal(prix_max))
        except (ValueError, InvalidOperation):
            pass
    if quartier:
        annonces = annonces.filter(quartier__icontains=quartier)
    if standing:
        annonces = annonces.filter(standing=standing)
    if type_annonce:
        annonces = annonces.filter(type_annonce=type_annonce)
        
    data = [serialize_annonce(a, request) for a in annonces]
    return JsonResponse(data, safe=False)

def api_annonce_detail(request, pk):
    annonce = get_object_or_404(Annonce.objects.select_related('utilisateurs').prefetch_related('images'), pk=pk)
    return JsonResponse(serialize_annonce(annonce, request))

@csrf_exempt
def api_create_annonce(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    
    try:
        type_annonce = request.POST.get('type_annonce')
        standing = request.POST.get('standing')
        prix = request.POST.get('prix')
        description = request.POST.get('description', '')
        quartier = request.POST.get('quartier')
        numero_telephone = request.POST.get('numero_telephone')
        est_publiee_str = request.POST.get('est_publiee', 'false')
        est_publiee = est_publiee_str.lower() in ['true', '1']

        if not all([type_annonce, standing, prix, quartier, numero_telephone]):
            return JsonResponse({'error': 'Champs obligatoires manquants'}, status=400)

        with transaction.atomic():
            annonce = Annonce.objects.create(
                type_annonce=type_annonce,
                standing=standing,
                prix=Decimal(prix),
                description=description,
                quartier=quartier,
                numero_telephone=numero_telephone,
                utilisateurs=request.user,
                est_publiee=est_publiee
            )

            # Traitement des images
            files = request.FILES.getlist('images')
            for f in files:
                Images.objects.create(annonce=annonce, image=f)

        return JsonResponse(serialize_annonce(annonce, request), status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_update_annonce(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
    annonce = get_object_or_404(Annonce, pk=pk)
    if annonce.utilisateurs != request.user and not request.user.is_admin:
        return JsonResponse({'error': 'Accès interdit'}, status=403)
        
    if request.method not in ['POST', 'PUT']:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
        
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            annonce.type_annonce = data.get('type_annonce', annonce.type_annonce)
            annonce.standing = data.get('standing', annonce.standing)
            if 'prix' in data:
                annonce.prix = Decimal(data['prix'])
            annonce.description = data.get('description', annonce.description)
            annonce.quartier = data.get('quartier', annonce.quartier)
            annonce.numero_telephone = data.get('numero_telephone', annonce.numero_telephone)
            if 'est_publiee' in data:
                annonce.est_publiee = data['est_publiee']
            if 'est_disponible' in data:
                annonce.est_disponible = data['est_disponible']
            annonce.save()
        else:
            annonce.type_annonce = request.POST.get('type_annonce', annonce.type_annonce)
            annonce.standing = request.POST.get('standing', annonce.standing)
            prix = request.POST.get('prix')
            if prix:
                annonce.prix = Decimal(prix)
            annonce.description = request.POST.get('description', annonce.description)
            annonce.quartier = request.POST.get('quartier', annonce.quartier)
            annonce.numero_telephone = request.POST.get('numero_telephone', annonce.numero_telephone)
            
            est_publiee = request.POST.get('est_publiee')
            if est_publiee is not None:
                annonce.est_publiee = est_publiee.lower() in ['true', '1']
                
            est_disponible = request.POST.get('est_disponible')
            if est_disponible is not None:
                annonce.est_disponible = est_disponible.lower() in ['true', '1']
            
            annonce.save()
            
            # Nouvelles images
            files = request.FILES.getlist('images')
            for f in files:
                Images.objects.create(annonce=annonce, image=f)
                
        return JsonResponse(serialize_annonce(annonce, request))
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_delete_annonce(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
    annonce = get_object_or_404(Annonce, pk=pk)
    if annonce.utilisateurs != request.user and not request.user.is_admin:
        return JsonResponse({'error': 'Accès interdit'}, status=403)
        
    annonce.delete()
    return JsonResponse({'status': 'Annonce supprimée'})

@csrf_exempt
def api_toggle_dispo(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
    annonce = get_object_or_404(Annonce, pk=pk)
    if annonce.utilisateurs != request.user and not request.user.is_admin:
        return JsonResponse({'error': 'Accès interdit'}, status=403)
        
    annonce.est_disponible = not annonce.est_disponible
    annonce.save()
    return JsonResponse({'est_disponible': annonce.est_disponible})

@csrf_exempt
def api_incrementer_compteur(request, pk):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    compteur_type = request.POST.get('compteur_type')
    annonce = get_object_or_404(Annonce, pk=pk)
    
    if compteur_type == 'clics':
        annonce.nbr_clics = F('nbr_clics') + 1
        annonce.save(update_fields=['nbr_clics'])
        return JsonResponse({'status': 'success', 'nbr_clics': annonce.nbr_clics})
    elif compteur_type == 'vues':
        annonce.nbr_vues = F('nbr_vues') + 1
        annonce.save(update_fields=['nbr_vues'])
        return JsonResponse({'status': 'success', 'nbr_vues': annonce.nbr_vues})
    else:
        return JsonResponse({'error': 'Type de compteur invalide'}, status=400)

# ================= MESSAGING ENDPOINTS =================

@csrf_exempt
def api_messages(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
        
    if request.method == 'GET':
        messages = Message.objects.filter(Q(sender=request.user) | Q(receiver=request.user)).order_by('date_envoi')
        chats = {}
        for msg in messages:
            partner = msg.receiver if msg.sender == request.user else msg.sender
            chats[partner.id] = {
                'partner': {
                    'id': partner.id,
                    'email': partner.email,
                    'nom': partner.nom,
                    'prenom': partner.prenom,
                },
                'last_message': {
                    'content': msg.content,
                    'date_envoi': msg.date_envoi.isoformat(),
                    'sender_id': msg.sender.id,
                    'receiver_id': msg.receiver.id,
                    'est_lu': msg.est_lu,
                }
            }
        return JsonResponse({'conversations': list(chats.values())})
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            receiver_id = data.get('receiver_id')
            content = data.get('content')
            
            if not receiver_id or not content:
                return JsonResponse({'error': 'Destinataire et contenu requis'}, status=400)
                
            receiver = get_object_or_404(CustomUser, id=receiver_id)
            msg = Message.objects.create(
                sender=request.user,
                receiver=receiver,
                content=content
            )
            return JsonResponse({
                'id': msg.id,
                'sender_id': msg.sender.id,
                'receiver_id': msg.receiver.id,
                'content': msg.content,
                'date_envoi': msg.date_envoi.isoformat(),
                'est_lu': msg.est_lu
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

def api_message_history(request, partner_id):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
        
    partner = get_object_or_404(CustomUser, id=partner_id)
    Message.objects.filter(sender=partner, receiver=request.user, est_lu=False).update(est_lu=True)
    
    messages = Message.objects.filter(
        (Q(sender=request.user) & Q(receiver=partner)) |
        (Q(sender=partner) & Q(receiver=request.user))
    ).order_by('date_envoi')
    
    serialized_messages = [{
        'id': msg.id,
        'sender_id': msg.sender.id,
        'receiver_id': msg.receiver.id,
        'content': msg.content,
        'date_envoi': msg.date_envoi.isoformat(),
        'est_lu': msg.est_lu
    } for msg in messages]
    
    return JsonResponse({
        'partner': {
            'id': partner.id,
            'email': partner.email,
            'nom': partner.nom,
            'prenom': partner.prenom,
        },
        'messages': serialized_messages
    })

# ================= DASHBOARD & BOOKINGS =================

@csrf_exempt
def api_dashboard(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
        
    if request.method == 'GET':
        my_annonces = Annonce.objects.filter(utilisateurs=request.user).prefetch_related('images')
        total_annonces = my_annonces.count()
        
        # Visites planifiées
        visites_planifiees = DemandeVisite.objects.filter(
            Q(annonce__utilisateurs=request.user) | Q(locataire=request.user),
            statut='acceptee'
        ).count()
        
        # Taux d'occupation : logements non disponibles (loués) par rapport au total
        occupied = my_annonces.filter(est_disponible=False).count()
        taux_occupation = int((occupied / total_annonces) * 100) if total_annonces > 0 else 100
        
        # Demandes de visite reçues par le propriétaire
        demandes = DemandeVisite.objects.filter(annonce__utilisateurs=request.user).select_related('locataire', 'annonce')
        serialized_demandes = [{
            'id': d.id,
            'annonce': d.annonce.id,
            'annonce_titre': f"{d.annonce.get_standing_display()} — {d.annonce.quartier}",
            'annonce_quartier': d.annonce.quartier,
            'locataire_nom': f"{d.locataire.prenom} {d.locataire.nom}",
            'date_visite': d.date_visite.isoformat(),
            'statut': d.statut
        } for d in demandes]
        
        # Demandes de visite envoyées par le locataire
        mes_demandes = DemandeVisite.objects.filter(locataire=request.user).select_related('annonce')
        mes_demandes_serialized = [{
            'id': d.id,
            'annonce': d.annonce.id,
            'annonce_titre': f"{d.annonce.get_standing_display()} — {d.annonce.quartier}",
            'date_visite': d.date_visite.isoformat(),
            'statut': d.statut
        } for d in mes_demandes]
        
        return JsonResponse({
            'stats': {
                'total_annonces': total_annonces,
                'visites_planifiees': visites_planifiees,
                'taux_occupation': taux_occupation
            },
            'my_annonces': [serialize_annonce(a, request) for a in my_annonces],
            'demandes_visite': serialized_demandes,
            'mes_demandes': mes_demandes_serialized
        })

@csrf_exempt
def api_demande_visite(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            annonce_id = data.get('annonce_id')
            date_visite_str = data.get('date_visite') # YYYY-MM-DD HH:MM
            
            if not annonce_id or not date_visite_str:
                return JsonResponse({'error': 'Annonce et date requises'}, status=400)
                
            annonce = get_object_or_404(Annonce, id=annonce_id)
            date_visite = datetime.strptime(date_visite_str, "%Y-%m-%d %H:%M")
            
            demande = DemandeVisite.objects.create(
                annonce=annonce,
                locataire=request.user,
                date_visite=date_visite
            )
            
            return JsonResponse({
                'id': demande.id,
                'annonce_id': demande.annonce.id,
                'locataire_id': demande.locataire.id,
                'date_visite': demande.date_visite.isoformat(),
                'statut': demande.statut
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_demande_visite_repondre(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Non autorisé'}, status=401)
        
    demande = get_object_or_404(DemandeVisite, pk=pk)
    if demande.annonce.utilisateurs != request.user:
        return JsonResponse({'error': 'Accès interdit'}, status=403)
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            statut = data.get('statut')
            if statut not in ['acceptee', 'refusee']:
                return JsonResponse({'error': 'Statut invalide'}, status=400)
                
            demande.statut = statut
            demande.save()
            return JsonResponse({'id': demande.id, 'statut': demande.statut})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

# ================= ADMIN ENDPOINTS =================

def api_admin_users(request):
    if not request.user.is_authenticated or not request.user.is_admin:
        return JsonResponse({'error': 'Accès interdit'}, status=403)
    utilisateurs = CustomUser.objects.all().order_by('nom', 'prenom')
    data = [{
        'id': u.id,
        'email': u.email,
        'nom': u.nom,
        'prenom': u.prenom,
        'date_de_naissance': u.date_de_naissance.isoformat() if u.date_de_naissance else None,
        'is_admin': u.is_admin,
    } for u in utilisateurs]
    return JsonResponse(data, safe=False)

def api_admin_user_detail(request, pk):
    if not request.user.is_authenticated or not request.user.is_admin:
        return JsonResponse({'error': 'Accès interdit'}, status=403)
    user = get_object_or_404(CustomUser, pk=pk)
    annonces = Annonce.objects.filter(utilisateurs=user).prefetch_related('images')
    
    return JsonResponse({
        'user': {
            'id': user.id,
            'email': user.email,
            'nom': user.nom,
            'prenom': user.prenom,
            'date_de_naissance': user.date_de_naissance.isoformat() if user.date_de_naissance else None,
            'is_admin': user.is_admin,
        },
        'annonces': [serialize_annonce(a, request) for a in annonces]
    })

# ================= SINGLE PAGE APPLICATION (SPA) FALLBACK =================

def index_view(request):
    frontend_index = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')
    if os.path.exists(frontend_index):
        with open(frontend_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    else:
        return HttpResponse("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>LMP - Chargement...</title>
                <style>
                    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #faf8f6; color: #1a2530; }
                    .card { text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08); }
                    h1 { color: #d66853; margin-bottom: 10px; }
                    code { display: block; background: #eee; padding: 10px; border-radius: 4px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>LMP - En cours de développement</h1>
                    <p>Le serveur API Django est prêt. Veuillez démarrer le serveur de développement React (Vite) :</p>
                    <code>cd frontend && npm run dev</code>
                    <p>Puis ouvrez <a href="http://127.0.0.1:5173" style="color: #d66853; font-weight: bold; text-decoration: none;">http://127.0.0.1:5173</a>.</p>
                </div>
            </body>
            </html>
        """)
