from os import getenv
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = getenv('VITE_SUPABASE_URL')
supabase_key = getenv('VITE_SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    raise ValueError("Missing required Supabase environment variables")

supabase: Client = create_client(supabase_url, supabase_key)