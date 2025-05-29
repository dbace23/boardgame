from typing import List, Dict, Any
from .base_repository import BaseRepository

class GameRepository(BaseRepository):
    def __init__(self):
        super().__init__("games")

    def find_by_category(self, category: str) -> List[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").contains("categories", [category]).execute()
        return response.data

    def find_trending(self, limit: int = 10) -> List[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").order("likes", desc=True).limit(limit).execute()
        return response.data

    def find_by_rating(self, min_rating: float = 4.0) -> List[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").gte("rating", min_rating).execute()
        return response.data