from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import timedelta
from django.utils import timezone

#Parent
class Project(models.Model):
    title = models.CharField( max_length=20, verbose_name='プロジェクト名' )
    comment = models.TextField(max_length=200, blank=True, null=True, verbose_name='メモ' )
    created_at = models.DateTimeField( auto_now_add=True, verbose_name='作成日時' )
    # created_at = models.DateTimeField(default=timezone.now, verbose_name='作成日時' )
    is_completed = models.BooleanField( default=False, verbose_name='完了' )
    completed_at = models.DateTimeField( null=True, blank=True, verbose_name='完了日時' )
    updated_at = models.DateTimeField (auto_now=True, verbose_name='更新日時' )
    # updated_at = models.DateTimeField (default=timezone.now, verbose_name='更新日時' )
    grand_total_time = models.DurationField( default=timedelta(seconds=0) )

    def __str__(self):
        return self.title

# Child
class TimeRecord(models.Model):
    # related_nameとserializerのfield名を合わせる
    parent = models.ForeignKey( Project, null=True, related_name='time_record', on_delete=models.CASCADE )
    date = models.DateTimeField( null=True)
    duration = models.DurationField( null=True, default=timedelta(seconds=0) )
    total_time = models.DurationField( default=timedelta(seconds=0) )

    def __str__(self):
        return str(self.date)

