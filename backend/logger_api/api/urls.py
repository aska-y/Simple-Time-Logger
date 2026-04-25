from django.urls import path, include 
from rest_framework.routers import DefaultRouter # ViewSetとURLの自動マッピング
from .views import ProjectViewSet 

# ProjectViewSetに基づいて、/projects/ルートで自動的にURL生を生成
router = DefaultRouter()
router.register(r'api/projects', ProjectViewSet)

# Djangoプロジェクト全体のURLパターンを定義するリスト
urlpatterns = [
    path('', include(router.urls)),
]
