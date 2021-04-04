from rest_framework import serializers
from aplicativo.models import Usuario

class UsuarioSerializer( serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id','nome', 'senha']