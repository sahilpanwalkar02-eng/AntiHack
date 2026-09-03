# Models package - import all models so SQLAlchemy registers them with Base
from app.models.user import User, UserRole
from app.models.threat_scan import ThreatScan, ChannelType, ThreatLevel
from app.models.url_scan import URLScan, URLSafetyStatus
from app.models.file_scan import UploadedFileScan
from app.models.complaint import Complaint, ComplaintUpdate, ComplaintStatus
from app.models.chat_history import ChatHistory
from app.models.article import Article, Notification
