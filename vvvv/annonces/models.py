from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField
from django.core.validators import MinValueValidator
from decimal import Decimal


class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom, prenom, date_de_naissance, password=None, **extra_fields):
        if not email:
            raise ValueError("L'utilisateur doit avoir une adresse email")

        email = self.normalize_email(email)
        user = self.model(email=email, nom=nom, prenom=prenom, date_de_naissance=date_de_naissance, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom, prenom, date_de_naissance, password, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, nom, prenom, date_de_naissance, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    TYPE_CHOICES = (
        ('locataire', 'Locataire'),
        ('proprietaire', 'Propriétaire'),
    )

    nom = models.CharField(max_length=150)
    prenom = models.CharField(max_length=150)
    date_de_naissance = models.DateField()
    email = models.EmailField(unique=True)
    type_utilisateur = models.CharField(max_length=20, choices=TYPE_CHOICES, default='locataire')
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'date_de_naissance']

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin
    

    
class Annonce (models.Model) :
    class TypeAnnonce(models.TextChoices):
        VENTE = 'vente', 'Mise en vente'
        LOCATION = 'location', 'Mise en location'

    class StandingLocation(models.TextChoices):
        ENTREE_COUCHEE = 'entree_couchee', "Entrée couchée"
        CH1_SALON = '1ch_salon', "1 chambre un salon"
        CH1_SALON_DOUCHE = '1ch_salon_douche', "1 chambre un salon couloir douche"
        CH2_SALON = '2ch_salon', "2 chambres salon"
        CH3_SALON = '3ch_salon', "3 chambres salon"
        VILLA_MEUBLE = 'villa_meuble', "Villa meublé"
        VILLA_NON_MEUBLE = 'villa_non_meuble', "Villa non meublé"
        APP_MEUBLE = 'app_meuble', "Appartement meublé"
        APP_NON_MEUBLE = 'app_non_meuble', "Appartement non meublé"
        QUEST_HOUSE = 'quest_house', "Quest house"
        PARCELLE = 'parcelle_location', "Parcelle (LOCATION)"

    class StandingVente(models.TextChoices) :
        VILLA = 'villa', 'Villa'
        MAISON = 'maison', 'Maison'
        PARCELLE = 'parcelle_vente', 'Parcelle (VENTE)'


    stand_choice = list(StandingLocation.choices) + list(StandingVente.choices)
    type_annonce = models.CharField(max_length=20 , choices=TypeAnnonce.choices, db_index=True)
    max_len = max(len(val) for val, _ in stand_choice)
    standing = models.CharField(max_length=max_len, choices= stand_choice, db_index=True)
    utilisateurs = models.ForeignKey(settings.AUTH_USER_MODEL , on_delete= models.CASCADE, related_name='annonces', db_index=True)
    prix = models.DecimalField(max_digits=20 , decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))],db_index=True)
    description = models.TextField(blank=True , null= True)
    quartier = models.CharField(max_length=100,db_index=True)
    coordonnes_google_maps = models.URLField( blank=True , null= True)
    numero_telephone = PhoneNumberField(max_length=20 , region = 'BJ')
    date_creation = models.DateTimeField(auto_now_add=True, db_index=True,)
    est_publiee = models.BooleanField(default=False, db_index=True)
    est_disponible =models.BooleanField(default=True,db_index= True )
    nbr_vues = models.IntegerField(default=0, db_index=True)
    nbr_clics = models.IntegerField(default=0, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['est_publiee', 'type_annonce']),
            models.Index(fields=['quartier']),
            models.Index(fields=['prix']),
            models.Index(fields=['est_disponible'])
        ]
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.type_annonce} - {self.quartier} - {self.prix}"


class Images(models.Model):
    annonce = models.ForeignKey('Annonce', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='annonces/%Y/%m/%d/', max_length=500)
    date_ajout = models.DateTimeField(auto_now_add=True)
    est_disponible = models.BooleanField(default=True)


class ClicAnnonce(models.Model):
    annonce_id = models.IntegerField()
    date_clic = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Clic annonce {self.annonce_id}"


class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    est_lu = models.BooleanField(default=False)

    class Meta:
        ordering = ['date_envoi']

    def __str__(self):
        return f"De {self.sender} à {self.receiver} ({self.date_envoi})"


class DemandeVisite(models.Model):
    class StatutVisite(models.TextChoices):
        EN_ATTENTE = 'en_attente', 'En attente'
        ACCEPTEE = 'acceptee', 'Acceptée'
        REFUSEE = 'refusee', 'Refusée'

    annonce = models.ForeignKey(Annonce, on_delete=models.CASCADE, related_name='demandes_visite')
    locataire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='demandes_visite')
    date_visite = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=StatutVisite.choices, default=StatutVisite.EN_ATTENTE)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_creation']

    def __str__(self):
        return f"Demande par {self.locataire} pour {self.annonce} ({self.statut})"



