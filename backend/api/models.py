from django.db import models

class Course(models.Model):
    # techName = models.CharField(max_length=50)
    pass


class Lesson(models.Model):
    # title = models.CharField(max_length=100)  
    pass

class Question(models.Model):
    # title = models.CharField(max_length=100)  
    # svg_icon = models.TextField()  
    # order = models.PositiveIntegerField(default=0)  
    # is_active = models.BooleanField(default=True) 
    pass

class UserProgress(models.Model):
    user_id = models.IntegerField()  
    course = models.ForeignKey(Course, on_delete=models.CASCADE)  
    progress = models.PositiveIntegerField(default=0)
