from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.utils.security import get_password_hash

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email.lower()).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).offset(skip).limit(limit).all()

    def create(self, user_in: UserCreate, role: UserRole = UserRole.USER) -> User:
        db_user = User(
            email=user_in.email.lower(),
            full_name=user_in.full_name,
            phone_number=user_in.phone_number,
            hashed_password=get_password_hash(user_in.password),
            role=role,
            is_active=True,
            cyber_safety_score=85.0
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user_id: int, user_in: UserUpdate) -> Optional[User]:
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None
        
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_password(self, user_id: int, new_password: str) -> bool:
        db_user = self.get_by_id(user_id)
        if not db_user:
            return False
        
        db_user.hashed_password = get_password_hash(new_password)
        self.db.commit()
        return True

    def update_last_login(self, user_id: int):
        db_user = self.get_by_id(user_id)
        if db_user:
            db_user.last_login = datetime.utcnow()
            self.db.commit()
