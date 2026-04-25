from rest_framework import serializers
from .models import Project, TimeRecord
from datetime import timedelta

# Child ネストさせるfield
class TimeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeRecord
        # fields = '__all__'
        exclude = ['parent']

#Parent
class ProjectSerializer(serializers.ModelSerializer):
    # ネストさせるserializerを親のfieldとして定義
    # このfield名とmodelのrelated_nameを合わせる
    time_record = TimeRecordSerializer(many=True, read_only=False)

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('id',)

    def create(self, validated_data):
        # 'time_record'をvalidated_dataから取り出す
        validated_data.pop('time_record',None) 
        project = Project.objects.create(**validated_data)
        return project


    def update(self, instance, validated_data):
        print("--- DEBUG: validated_data ---")
        print(validated_data)
        print("-----------------------------")

        #'time_record'をpopして別処理（初期値は空リスト）
        time_records_data = validated_data.pop('time_record',[]) 

        # 親のインスタンスを更新
        instance = super().update(instance, validated_data)
        # instance.save()

        #関連データの更新
        if time_records_data:
            for item in time_records_data:

                # total_timeにdurationを加算
                total_time = instance.grand_total_time + item['duration']
                item['total_time'] = total_time # 累計
                instance.grand_total_time = total_time #プロジェクト合計

                TimeRecord.objects.create(parent=instance, **item)

        instance.save()
        return instance
