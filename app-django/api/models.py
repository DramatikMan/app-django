from django.db import models
from django.utils.crypto import get_random_string


class Room(models.Model):

    def unique_code():
        while True:
            code = get_random_string(length=6)
            if not Room.objects.filter(code=code).exists():
                break
        return code

    code = models.CharField(max_length=8, default=unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
        