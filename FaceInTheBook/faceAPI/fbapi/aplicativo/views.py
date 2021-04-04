from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser
from aplicativo.models import Usuario
from aplicativo.serializer import UsuarioSerializer

# Create your views here.


def pegarTemas(request):
    print("ASIDJO")
    if request.method == 'GET':
        lista = [
                    {
                        "nome": {
                            "pt": "Cor de fundo principal",
                            "en": "Main background color"
                        },
                        "codigo": "--bc",
                        "valor": "#282828"
                    },
                    {
                        "nome": {
                            "pt": "Cor de sobreposição",
                            "en": "Hover color"
                        },
                        "codigo": "--hov",
                        "valor": "#494949"
                    },
                    {
                        "nome": {
                            "pt": "Cor de fundo secundária",
                            "en": "Secondary background color"
                        },
                        "codigo": "--bc-s",
                        "valor": "#121212"
                    },
                    {
                        "nome": {
                            "pt": "Cor de fundo terciária",
                            "en": "Third background color"
                        },
                        "codigo": "--bc-t",
                        "valor": "#232323"
                    },
                    {
                        "nome": {
                            "pt": "Cor do texto",
                            "en": "Text color"
                        },
                        "codigo": "--cor",
                        "valor": "#ffffff"
                    },
                    {
                        "nome": {
                            "pt": "Cor de destaque",
                            "en": "Highlight color"
                        },
                        "codigo": "--feat",
                        "valor": "#1e90ff"
                    },
                    {
                        "nome": {
                            "pt": "Cor da borda",
                            "en": "Border color"
                        },
                        "codigo": "--br",
                        "valor": "#ffffff"
                    },
                    {
                        "nome": {
                            "pt": "Cor de descrição",
                            "en": "Description color"
                        },
                        "codigo": "--desc",
                        "valor": "#c4c4c4"
                    },
                    {
                        "nome": {
                            "pt": "Cor de seleção",
                            "en": "Select color"
                        },
                        "codigo": "--sel",
                        "valor": "#00cf00"
                    },
                    {
                        "nome": {
                            "pt": "Cor de texto ilegível",
                            "en": "Unreadable text color"
                        },
                        "codigo": "--inblack",
                        "valor": "#000000"
                    },
                    {
                        "nome": {
                            "pt": "Cor primária",
                            "en": "Primary color"
                        },
                        "codigo": "--prim",
                        "valor": "#0000ff"
                    },
                    {
                        "nome": {
                            "pt": "Cor secundária",
                            "en": "Secondary color"
                        },
                        "codigo": "--sec",
                        "valor": "#00ffff"
                    },
                    {
                        "nome": {
                            "pt": "Cor terciária",
                            "en": "Tertiary color"
                        },
                        "codigo": "--thir",
                        "valor": "#ffff00"
                    },
                    {
                        "nome": {
                            "pt": "Cor quaternária",
                            "en": "Quaternary color"
                        },
                        "codigo": "--qua",
                        "valor": "#a200ff"
                    },
                    {
                        "nome": {
                            "pt": "Cor de aviso",
                            "en": "Warning color"
                        },
                        "codigo": "--warn",
                        "valor": "#ff0000"
                    }
                ]
        return JsonResponse({"res": lista})
