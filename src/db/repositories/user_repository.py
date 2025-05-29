from typing import Dict, Any, Optional
from .base_repository import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("users")

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").eq("email", email).single().execute()
        return response.data

    def find_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").eq("phone_number", phone).single().execute()
        return response.data