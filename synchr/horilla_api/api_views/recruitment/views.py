from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from recruitment.models import (
    Recruitment,
    Candidate,
    Stage,
    InterviewSchedule,
    SurveyTemplate,
    Skill,
    StageNote,
    RejectReason,
    RejectedCandidate,
    SkillZone,
    SkillZoneCandidate,
    CandidateRating,
    CandidateDocument,
    CandidateDocumentRequest,
    LinkedInAccount,
)

from ...api_serializers.recruitment.serializers import (
    RecruitmentSerializer,
    CandidateSerializer,
    StageSerializer,
    InterviewScheduleSerializer,
    SurveyTemplateSerializer,
    SkillSerializer,
    StageNoteSerializer,
    RejectReasonSerializer,
    RejectedCandidateSerializer,
    SkillZoneSerializer,
    SkillZoneCandidateSerializer,
    CandidateRatingSerializer,
    CandidateDocumentSerializer,
    CandidateDocumentRequestSerializer,
    LinkedInAccountSerializer,
)


class RecruitmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                recruitment = Recruitment.objects.get(pk=pk)
                serializer = RecruitmentSerializer(recruitment)
                return Response(serializer.data, status=200)
            except Recruitment.DoesNotExist:
                return Response(
                    {"error": "Recruitment not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        paginator = PageNumberPagination()
        recruitments = Recruitment.objects.all()
        page = paginator.paginate_queryset(recruitments, request)
        serializer = RecruitmentSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = RecruitmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            recruitment = Recruitment.objects.get(pk=pk)
            serializer = RecruitmentSerializer(recruitment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Recruitment.DoesNotExist:
            return Response(
                {"error": "Recruitment not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            recruitment = Recruitment.objects.get(pk=pk)
            recruitment.delete()
            return Response(
                {"message": "Recruitment deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except Recruitment.DoesNotExist:
            return Response(
                {"error": "Recruitment not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ProtectedError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CandidateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                candidate = Candidate.objects.get(pk=pk)
                serializer = CandidateSerializer(candidate)
                return Response(serializer.data, status=200)
            except Candidate.DoesNotExist:
                return Response(
                    {"error": "Candidate not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        paginator = PageNumberPagination()
        candidates = Candidate.objects.all()
        page = paginator.paginate_queryset(candidates, request)
        serializer = CandidateSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CandidateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
            serializer = CandidateSerializer(candidate, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Candidate.DoesNotExist:
            return Response(
                {"error": "Candidate not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
            candidate.delete()
            return Response(
                {"message": "Candidate deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except Candidate.DoesNotExist:
            return Response(
                {"error": "Candidate not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ProtectedError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                stage = Stage.objects.get(pk=pk)
                serializer = StageSerializer(stage)
                return Response(serializer.data, status=200)
            except Stage.DoesNotExist:
                return Response(
                    {"error": "Stage not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        paginator = PageNumberPagination()
        stages = Stage.objects.all()
        page = paginator.paginate_queryset(stages, request)
        serializer = StageSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = StageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            stage = Stage.objects.get(pk=pk)
            serializer = StageSerializer(stage, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Stage.DoesNotExist:
            return Response(
                {"error": "Stage not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            stage = Stage.objects.get(pk=pk)
            stage.delete()
            return Response(
                {"message": "Stage deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except Stage.DoesNotExist:
            return Response(
                {"error": "Stage not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ProtectedError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class InterviewScheduleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                interview = InterviewSchedule.objects.get(pk=pk)
                serializer = InterviewScheduleSerializer(interview)
                return Response(serializer.data, status=200)
            except InterviewSchedule.DoesNotExist:
                return Response(
                    {"error": "Interview schedule not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        paginator = PageNumberPagination()
        interviews = InterviewSchedule.objects.all()
        page = paginator.paginate_queryset(interviews, request)
        serializer = InterviewScheduleSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = InterviewScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            interview = InterviewSchedule.objects.get(pk=pk)
            serializer = InterviewScheduleSerializer(interview, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except InterviewSchedule.DoesNotExist:
            return Response(
                {"error": "Interview schedule not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            interview = InterviewSchedule.objects.get(pk=pk)
            interview.delete()
            return Response(
                {"message": "Interview schedule deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except InterviewSchedule.DoesNotExist:
            return Response(
                {"error": "Interview schedule not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class SurveyTemplateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                template = SurveyTemplate.objects.get(pk=pk)
                serializer = SurveyTemplateSerializer(template)
                return Response(serializer.data, status=200)
            except SurveyTemplate.DoesNotExist:
                return Response(
                    {"error": "Survey template not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        templates = SurveyTemplate.objects.all()
        serializer = SurveyTemplateSerializer(templates, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = SurveyTemplateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            template = SurveyTemplate.objects.get(pk=pk)
            serializer = SurveyTemplateSerializer(template, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SurveyTemplate.DoesNotExist:
            return Response(
                {"error": "Survey template not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            template = SurveyTemplate.objects.get(pk=pk)
            template.delete()
            return Response(
                {"message": "Survey template deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except SurveyTemplate.DoesNotExist:
            return Response(
                {"error": "Survey template not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class SkillAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                skill = Skill.objects.get(pk=pk)
                serializer = SkillSerializer(skill)
                return Response(serializer.data, status=200)
            except Skill.DoesNotExist:
                return Response(
                    {"error": "Skill not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            skill = Skill.objects.get(pk=pk)
            serializer = SkillSerializer(skill, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Skill.DoesNotExist:
            return Response(
                {"error": "Skill not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            skill = Skill.objects.get(pk=pk)
            skill.delete()
            return Response(
                {"message": "Skill deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except Skill.DoesNotExist:
            return Response(
                {"error": "Skill not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class RejectReasonAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                reason = RejectReason.objects.get(pk=pk)
                serializer = RejectReasonSerializer(reason)
                return Response(serializer.data, status=200)
            except RejectReason.DoesNotExist:
                return Response(
                    {"error": "Reject reason not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        reasons = RejectReason.objects.all()
        serializer = RejectReasonSerializer(reasons, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = RejectReasonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            reason = RejectReason.objects.get(pk=pk)
            serializer = RejectReasonSerializer(reason, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RejectReason.DoesNotExist:
            return Response(
                {"error": "Reject reason not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            reason = RejectReason.objects.get(pk=pk)
            reason.delete()
            return Response(
                {"message": "Reject reason deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except RejectReason.DoesNotExist:
            return Response(
                {"error": "Reject reason not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class LinkedInAccountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                account = LinkedInAccount.objects.get(pk=pk)
                serializer = LinkedInAccountSerializer(account)
                return Response(serializer.data, status=200)
            except LinkedInAccount.DoesNotExist:
                return Response(
                    {"error": "LinkedIn account not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        accounts = LinkedInAccount.objects.all()
        serializer = LinkedInAccountSerializer(accounts, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = LinkedInAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            account = LinkedInAccount.objects.get(pk=pk)
            serializer = LinkedInAccountSerializer(account, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LinkedInAccount.DoesNotExist:
            return Response(
                {"error": "LinkedIn account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def patch(self, request, pk):
        """Handle PATCH requests for partial updates like toggling is_active"""
        try:
            account = LinkedInAccount.objects.get(pk=pk)
            serializer = LinkedInAccountSerializer(account, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LinkedInAccount.DoesNotExist:
            return Response(
                {"error": "LinkedIn account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk):
        try:
            account = LinkedInAccount.objects.get(pk=pk)
            account.delete()
            return Response(
                {"message": "LinkedIn account deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except LinkedInAccount.DoesNotExist:
            return Response(
                {"error": "LinkedIn account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class RecruitmentGeneralSettingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from recruitment.models import RecruitmentGeneralSetting
        # Get or create the settings (typically one record per company)
        company_id = request.query_params.get('company_id')
        if company_id:
            setting, created = RecruitmentGeneralSetting.objects.get_or_create(
                company_id_id=company_id,
                defaults={'candidate_self_tracking': False, 'show_overall_rating': False}
            )
        else:
            setting = RecruitmentGeneralSetting.objects.first()
            if not setting:
                setting = RecruitmentGeneralSetting.objects.create(
                    candidate_self_tracking=False,
                    show_overall_rating=False
                )
        
        return Response({
            'candidate_self_tracking': setting.candidate_self_tracking,
            'show_overall_rating': setting.show_overall_rating
        }, status=200)

    def post(self, request):
        from recruitment.models import RecruitmentGeneralSetting
        company_id = request.data.get('company_id')
        
        if company_id:
            setting, created = RecruitmentGeneralSetting.objects.get_or_create(
                company_id_id=company_id
            )
        else:
            setting = RecruitmentGeneralSetting.objects.first()
            if not setting:
                setting = RecruitmentGeneralSetting.objects.create()
        
        setting.candidate_self_tracking = request.data.get('candidate_self_tracking', setting.candidate_self_tracking)
        setting.show_overall_rating = request.data.get('show_overall_rating', setting.show_overall_rating)
        setting.save()
        
        return Response({
            'candidate_self_tracking': setting.candidate_self_tracking,
            'show_overall_rating': setting.show_overall_rating,
            'message': 'Settings saved successfully'
        }, status=200)
