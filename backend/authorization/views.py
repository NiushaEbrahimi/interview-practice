from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import send_mail
from django.conf import settings
from .models import UserProfile
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    LoginSerializer, 
    TokenResponseSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    
    queryset = User.objects.all()
    permission_classes = []
    authentication_classes = []
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'user': user_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(email=email, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'error': 'User account is disabled'
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'user': user_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Invalid or expired token'
            }, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(APIView):
    
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({
                'error': 'Refresh token is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            
            # Optional: Return user info with new token
            user = User.objects.get(id=refresh['user_id'])
            user_data = UserSerializer(user).data
            
            return Response({
                'access': access,
                'user': user_data,
                'message': 'Token refreshed successfully'
            }, status=status.HTTP_200_OK)
        except TokenError:
            return Response({
                'error': 'Invalid or expired refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(generics.RetrieveUpdateAPIView):
    
    serializer_class = UserProfileSerializer
    permission_classes = []

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def retrieve(self, request, *args, **kwargs):
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data)
    
    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        
        known_tech_list = request.data.get('known_technologies', None)
        learning_tech_list = request.data.get('learning_technologies', None)
        
        if isinstance(known_tech_list, list):
            profile.known_technologies = ', '.join([str(t).strip() for t in known_tech_list if t.strip()])
        
        if isinstance(learning_tech_list, list):
            profile.learning_technologies = ', '.join([str(t).strip() for t in learning_tech_list if t.strip()])
        
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data)


class ChangePasswordView(APIView):
    
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Password changed successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        user = request.user
        email = request.data.get('email', user.email)
        
        user.is_verified = True
        user.save()
        
        return Response({
            'message': 'Email verified successfully',
            'is_verified': user.is_verified
        }, status=status.HTTP_200_OK)
    

class CheckEmailView(APIView):
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email', '').strip()
        
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=400)
        
        exists = User.objects.filter(email__iexact=email).exists()
        
        return Response({
            'email': email,
            'exists': exists,
            'available': not exists,
            'message': 'Email is available' if not exists else 'Email is already registered'
        })