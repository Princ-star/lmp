from django.shortcuts import render
from django.shortcuts import render, redirect , get_object_or_404
from django.contrib.auth import authenticate, login, logout
from .forms import RegisterForm, LoginForm , AnnonceForm , ImageAnnonceForm
from .models import CustomUser , Annonce , Images
from django.contrib.auth.decorators import login_required
from django.forms import modelformset_factory
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from django.shortcuts import redirect
from django.db import transaction
from decimal import Decimal, InvalidOperation
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import F

@require_POST
def incrementer_compteur(request, annonce_id) :
    compteur_type = request.POST.get('compteur_type') # incrementation
    annonce = get_object_or_404(Annonce, pk=annonce_id)

    if compteur_type == 'clics' :
        annonce.nbr_clics = F('nbr_clics') + 1
        annonce.save(update_fields=['nbr_clics'])
        return JsonResponse({'status' : 'success', 'message': 'Clic incrémenté.'})

    elif compteur_type == 'vues' :
        annonce.nbr_vues = F('nbr_vues') + 1
        annonce.save(update_fields=['nbr_vues'])
        return JsonResponse({'status': 'success', 'message': 'Vue incrémentée.'})

    else : 
        return JsonResponse({'status': 'error', 'message': 'Type de compteur invalide.'}, status=400)







def accueil(request):
    return render(request, 'annonces/first_page.html')

@login_required
def profil(request):
    user = request.user
    return render(request, 'annonces/profil.html', {'user': user})


def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["password"])
            user.save()
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'annonces/register.html', {'form': form})

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('site')
    else:
        form = LoginForm()
    return render(request, 'annonces/login.html', {'form': form})



def logout_view(request):
    logout(request)
    return redirect('login')

# logique pour gérer la création d'annonce 
@login_required
def annonce_view(request):
    ImageFormSet = modelformset_factory(Images, form=ImageAnnonceForm, extra=4, max_num=10)

    if request.method == "POST":
        form = AnnonceForm(request.POST)
        formset = ImageFormSet(request.POST, request.FILES, queryset=Images.objects.none())

        if not form.is_valid() or not formset.is_valid():
            print("=== FORM ERRORS ===", form.errors)
            print("=== FORMSET NON-FIELD ERRORS ===", formset.non_form_errors())
            print("=== FORMSET FIELD ERRORS ===", formset.errors)

        if form.is_valid() and formset.is_valid(): 
            with transaction.atomic():
                annonce = form.save(commit=False)
                annonce.utilisateurs = request.user 
                annonce.save()

                for image_form in formset.cleaned_data:
                    if image_form:
                        image = image_form['image']
                        Images.objects.create(annonce=annonce, image=image)

                return redirect('publier', annonce_id=annonce.id)

    else:
        form = AnnonceForm()
        formset = ImageFormSet(queryset=Images.objects.none())
        return render(request, 'annonces/annonce.html', {'form': form, 'formset': formset})        

    form = AnnonceForm()
    formset = ImageFormSet(queryset=Images.objects.none())
    return render(request, 'annonces/annonce.html', {
        'form': form,
        'formset': formset
    }) 


@login_required
def publier(request, annonce_id): 
    annonce = get_object_or_404(Annonce, id=annonce_id)
    return render(request, 'annonces/publier.html', {'annonce': annonce})

@login_required
def publier_confirme(request, annonce_id):
    annonce = get_object_or_404(Annonce, id=annonce_id, utilisateurs=request.user)
    annonce.est_publiee = True  
    annonce.save()
    return redirect('site') 


def site(request): 
    annonces = Annonce.objects.filter(est_publiee=True, est_disponible=True).select_related('utilisateurs').prefetch_related('images')
    paginator = Paginator(annonces, 12)
    page = request.GET.get('page')
    annonces = paginator.get_page(page)
    return render(request, 'annonces/site.html', {'annonces': annonces}) 


standinges = [
    ('villa'),
    ('maison'),
    ('parcelle'),
]


def vente(request): 
    annonces = Annonce.objects.filter(type_annonce="vente", est_publiee=True, est_disponible=True).select_related('utilisateurs').prefetch_related('images')
    prix = request.GET.get('prix')
    quartier = request.GET.get('quartier')
    standing = request.GET.get('standing')

    if prix:
        annonces = annonces.filter(prix__lte=prix)
    if quartier:
        annonces = annonces.filter(quartier__icontains=quartier)
    if standing:
        annonces = annonces.filter(standing=standing)

    return render(request, 'annonces/vente.html', {
        'annonces': annonces,
        'filtre_prix': prix,
        'filtre_quartier': quartier,
        'filtre_standing': standing,
        'standinges': standinges,
    })


standings = [
    ('Entrée couchée'),
    ('1 chambre un salon'),
    ('1 chambre un salon couloir douche'),
    ('2 chambres salon'),
    ('3 chambres salon'),
    ('Villa meublé'),
    ('Villa non meublé'),
    ('Appartement meublé'),
    ('Appartement non meublé'),
    ('Quest house'),
    ('Parcelle'),
]


def location(request): 
    annonces = Annonce.objects.filter(type_annonce="location", est_publiee=True)
    prix = request.GET.get('prix')
    quartier = request.GET.get('quartier')
    standing = request.GET.get('standing')

    if prix:
        annonces = annonces.filter(prix__lte=prix)
    if quartier:
        annonces = annonces.filter(quartier__icontains=quartier)
    if standing:
        annonces = annonces.filter(standing=standing)

    return render(request, 'annonces/location.html', {
        'annonces': annonces,
        'filtre_prix': prix,
        'filtre_quartier': quartier,
        'filtre_standing': standing,
        'standings': standings
    })

@login_required
def publications(request):
    annonces = Annonce.objects.filter(utilisateurs=request.user)
    return render(request, 'annonces/publications.html', {'annonces': annonces})


@login_required
def supprimer_annonce(request, id):
    annonce = get_object_or_404(Annonce, id=id, utilisateurs=request.user)
    annonce.delete()
    return redirect('publications')


@login_required
def modifier_annonce(request, id):
    annonce = get_object_or_404(Annonce, id=id, utilisateurs=request.user)

    if request.method == 'POST':
        form = AnnonceForm(request.POST, request.FILES, instance=annonce)
        if form.is_valid():
            form.save()
            return redirect('publier', annonce_id=annonce.id) 
    else:
        form = AnnonceForm(instance=annonce)

    return render(request, 'annonces/modifier_annonce.html', {'form': form, 'annonce': annonce})


@login_required
@require_POST
def basculer_disponibilite(request, annonce_id):
    annonce = get_object_or_404(Annonce, id=annonce_id)
    if annonce.utilisateurs != request.user:
        return HttpResponseForbidden("Vous n'êtes pas autorisé(e) à modifier cette annonce.")

    annonce.est_disponible = not annonce.est_disponible
    annonce.save()

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'est_disponible': annonce.est_disponible})

    messages.success(request, "Disponibilité mise à jour.")
    return redirect('publications')


@login_required
def admin_users_list(request):
    if not request.user.is_admin:
        raise PermissionDenied("Accès non autorisé à l'administration.")

    nombre_total_utilisateurs = CustomUser.objects.count()
    utilisateurs = CustomUser.objects.all().order_by('nom', 'prenom')

    context = {
        'nombre_total_utilisateurs': nombre_total_utilisateurs,
        'utilisateurs': utilisateurs,
    }
    return render(request, 'annonces/admin/users_list.html', context)


@login_required
def admin_user_detail(request, pk):
    if not request.user.is_admin:
        raise PermissionDenied("Accès non autorisé à l'administration.")

    utilisateur = get_object_or_404(CustomUser, pk=pk)
    annonces = utilisateur.annonces.all().order_by('-date_creation')

    context = {
        'utilisateur': utilisateur,
        'annonces': annonces,
    }
    return render(request, 'annonces/admin/user_detail.html', context)