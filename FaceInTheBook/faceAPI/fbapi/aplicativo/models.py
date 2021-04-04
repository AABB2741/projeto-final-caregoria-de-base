from django.db import models

# Create your models here.
class Usuario(models.Model):
    nome = models.CharField(max_length=30)
    senha = models.CharField(max_length=15)

    def __str__(self):
        return self.nome