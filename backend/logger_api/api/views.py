from rest_framework import viewsets
from .models import Project, TimeRecord
from .serializers import ProjectSerializer,TimeRecordSerializer

# ProjectモデルのCRUD操作を処理するProjectViewSetクラスを定義
class ProjectViewSet(viewsets.ModelViewSet):
    # Projectモデルから全てのオブジェクトを取得する
    queryset = Project.objects.all().order_by('-updated_at')
    serializer_class = ProjectSerializer

