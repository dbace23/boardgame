from typing import List, Dict, Any, Optional
from ..connection import supabase

class BaseRepository:
    def __init__(self, table_name: str):
        self.table_name = table_name

    def find_all(self) -> List[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").execute()
        return response.data

    def find_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        response = supabase.table(self.table_name).select("*").eq("id", id).single().execute()
        return response.data

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        response = supabase.table(self.table_name).insert(data).execute()
        return response.data[0]

    def update(self, id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        response = supabase.table(self.table_name).update(data).eq("id", id).execute()
        return response.data[0]

    def delete(self, id: str) -> bool:
        response = supabase.table(self.table_name).delete().eq("id", id).execute()
        return len(response.data) > 0