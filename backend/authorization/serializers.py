from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    
    known_technologies_list = serializers.SerializerMethodField()
    learning_technologies_list = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'full_name', 'experience_level', 'years_of_experience',
            'known_technologies', 'learning_technologies',
            'known_technologies_list', 'learning_technologies_list'
        ]
    
    def get_known_technologies_list(self, obj):
        if obj.known_technologies:
            return [tech.strip() for tech in obj.known_technologies.split(',') if tech.strip()]
        return []
    
    def get_learning_technologies_list(self, obj):
        if obj.learning_technologies:
            return [tech.strip() for tech in obj.learning_technologies.split(',') if tech.strip()]
        return []
    
    def validate_known_technologies(self, value):
        if value:
            techs = [t.strip() for t in value.split(',') if t.strip()]
            if len(techs) > 20:
                raise serializers.ValidationError("Maximum 20 technologies allowed")
        return value
    
    def validate_learning_technologies(self, value):
        if value:
            techs = [t.strip() for t in value.split(',') if t.strip()]
            if len(techs) > 20:
                raise serializers.ValidationError("Maximum 20 technologies allowed")
        return value


class UserSerializer(serializers.ModelSerializer):
    
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'is_verified', 'is_active', 
                  'created_at', 'profile']
        read_only_fields = ['id', 'created_at', 'is_verified', 'is_active']


class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )
    
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    experience_level = serializers.ChoiceField(
        choices=UserProfile.ExperienceLevel.choices,
        required=False,
        default=UserProfile.ExperienceLevel.BEGINNER
    )
    years_of_experience = serializers.IntegerField(default=0, required=False, min_value=0)
    
    known_technologies = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    learning_technologies = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password2',
            'full_name', 'experience_level', 'years_of_experience',
            'known_technologies', 'learning_technologies'
        ]
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs

    def create(self, validated_data):
        profile_data = {
            'full_name': validated_data.pop('full_name', ''),
            'experience_level': validated_data.pop('experience_level', 
                                                   UserProfile.ExperienceLevel.BEGINNER),
            'years_of_experience': validated_data.pop('years_of_experience', 0),
        }
        
        known_tech_list = validated_data.pop('known_technologies', [])
        learning_tech_list = validated_data.pop('learning_technologies', [])
        
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        profile = UserProfile.objects.create(user=user, **profile_data)
        
        profile.known_technologies = ', '.join(known_tech_list)
        profile.learning_technologies = ', '.join(learning_tech_list)
        profile.save()
        
        return user


class LoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({
                "new_password": "New password fields didn't match."
            })
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class TokenResponseSerializer(serializers.Serializer):
    
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()