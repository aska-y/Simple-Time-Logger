from django.contrib import admin
from .models import Project, TimeRecord

# 管理画面にネストされたフィールドをインライン表示
class TimeRecordInline(admin.TabularInline):
    model = TimeRecord
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    inlines = [TimeRecordInline]
