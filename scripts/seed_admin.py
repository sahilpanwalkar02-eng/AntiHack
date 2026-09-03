import os
import sys

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.database.session import SessionLocal, Base, engine
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.models.user import UserRole, User

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        repo = UserRepository(db)
        
        # Seed or Update Admin User
        admin = repo.get_by_email("admin@antihack.com")
        if not admin:
            admin_in = UserCreate(
                email="admin@antihack.com",
                full_name="AntiHack Admin",
                phone_number="+1000000000",
                password="Password123!"
            )
            repo.create(admin_in, role=UserRole.ADMIN)
            print("Successfully created initial Admin user: admin@antihack.com / Password123!")
        else:
            repo.update_password(admin.id, "Password123!")
            print("Successfully refreshed password hash for Admin user: admin@antihack.com / Password123!")

        # Seed or Update Demo User
        user = repo.get_by_email("user@antihack.com")
        if not user:
            user_in = UserCreate(
                email="user@antihack.com",
                full_name="Demo Security User",
                phone_number="+1999999999",
                password="Password123!"
            )
            repo.create(user_in, role=UserRole.USER)
            print("Successfully created initial Demo user: user@antihack.com / Password123!")
        else:
            repo.update_password(user.id, "Password123!")
            print("Successfully refreshed password hash for Demo user: user@antihack.com / Password123!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
