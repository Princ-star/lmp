from django import forms
from .models import CustomUser , Annonce , Images
from django.contrib.auth.forms import AuthenticationForm

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['nom', 'prenom', 'date_de_naissance', 'email', 'password']

    def clean_email(self):
        email = self.cleaned_data['email']
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Cet email est déjà utilisé.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        nom = cleaned_data.get("nom")
        prenom = cleaned_data.get("prenom")
        date_de_naissance = cleaned_data.get("date_de_naissance")

        if CustomUser.objects.filter(nom=nom, prenom=prenom, date_de_naissance=date_de_naissance).exists():
            raise forms.ValidationError("Un utilisateur avec ces informations existe déjà.")
        
        return cleaned_data


class LoginForm(AuthenticationForm):
    username = forms.EmailField(label="Email")
    password = forms.CharField(widget=forms.PasswordInput, label="Mot de passe")


# formulaire pour qu'en fonction du type d'annonce choisie, les options de standings s'affichent
class AnnonceForm(forms.ModelForm): 
    class Meta:
        model = Annonce
        fields = ['type_annonce', 'standing', 'prix', 'description', 'quartier', 'coordonnes_google_maps', 'numero_telephone']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        type_annonce = self.data.get('type_annonce') or getattr(self.instance, 'type_annonce', None)
        if type_annonce in [Annonce.TypeAnnonce.LOCATION, 'location', 'Mise en location']:
            self.fields['standing'].choices = Annonce.StandingLocation.choices
        elif type_annonce in [Annonce.TypeAnnonce.VENTE, 'vente', 'Mise en vente']:
            self.fields['standing'].choices = Annonce.StandingVente.choices
        else:
            self.fields['standing'].choices = Annonce.stand_choice


class ImageAnnonceForm(forms.ModelForm):
    class Meta:
        model = Images
        fields = ['image']

    