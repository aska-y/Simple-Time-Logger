from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _ 

class CustomUserManager(BaseUserManager):
    """
    BaseUserManagerを継承してCustomUserManagerクラスを作成。
    IDにユーザー名にではなくメールアドレスを使用。
    """

    def _create_user(self, email, username, password=None, **extra_fields):
        # メールアドレスとユーザー名でユーザーを作成し、保存。
        if not email:
            raise ValueError(_("The Email field must be set."))
        email = self.normalize_email(email)  # メールアドレスを正規化
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password) #  パスワードをハッシュ化して保存
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password=None, **extra_fields):
        # 通常のユーザーを作成。
        extra_fields.setdefault("is_staff", False)  # デフォルトでスタッフ権限はFalse
        extra_fields.setdefault("is_superuser", False)  # デフォルトでスーパーユーザー権限はFalse
        return self._create_user(email, username, password, **extra_fields)

    def create_superuser(self, email, username, password, **extra_fields):
        # スーパーユーザーを作成。
        extra_fields.setdefault('is_staff', True)  # スタッフ権限はTrue
        extra_fields.setdefault('is_superuser', True) # スーパーユーザー権限はTrue
        extra_fields.setdefault('is_active', True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self._create_user(email, username, password, **extra_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    独自のユーザーモデルを定義するカスタムユーザーモデル。
    AbstractBaseUserは認証機能、PermissionsMixinは権限管理機能。
    """
    # username_validator = UnicodeUsernameValidator()  # ユーザー名のバリデーター

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("users")

    email = models.EmailField(max_length=100, unique=True, blank=False)
    username = models.CharField(max_length=20)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ('username',)

    is_staff = models.BooleanField(default=False,)
    is_active = models.BooleanField(default=True,)
    date_joined = models.DateTimeField( default=timezone.now)

    objects = CustomUserManager()

    @property
    def get_name(self):
        return f'{self.username}'

    def __str__(self) -> str:
        return self.email