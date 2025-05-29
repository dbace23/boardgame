import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/providers/AuthProvider';
import CityCombobox from '../../components/common/CityCombobox';
import { UploadButton } from '../../utils/uploadthing';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { toast } from 'react-hot-toast';
import { XMLParser } from 'fast-xml-parser';
import AvatarCropModal from '../../components/modals/AvatarCropModal';
import { uploadFiles } from '../../utils/uploadthing';



function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bgg, setBgg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [bggCollectionLoading, setBggCollectionLoading] = useState(false);

  const parser = new XMLParser();
 

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || '');
          setCity(data.city || '');
          setGender(data.gender || '');
          setDob(data.dob || '');
          setWhatsapp(data.whatsapp || '');
          setBgg(data.bgg || '');
          setAvatarUrl(data.avatar_url || '');
        }
      });
  }, [user, navigate]);

  const formatWhatsApp = (raw: string) => {
    try {
      const parsed = parsePhoneNumber(raw, 'ID');
      return parsed.formatInternational();
    } catch {
      return raw;
    }
  };

  const isValidWhatsApp = (raw: string) => {
    try {
      return isValidPhoneNumber(raw, 'ID');
    } catch {
      return false;
    }
  };

  const fetchBGGProfile = async (username: string) => {
    if (!username || !user?.id) return;
    try {
      const res = await fetch(`https://boardgamegeek.com/xmlapi2/user?name=${username}`);
      const xml = await res.text();
      if (xml.includes('<user')) {
        toast.success('BoardGameGeek user found!');
      } else {
        toast.error('BGG username not found');
      }
    } catch {
      toast.error('Failed to sync BGG');
    }
  };
    const syncBGGCollection = async (username: string) => {
    if (!username) return;

    setBggCollectionLoading(true);
    try {
        const res = await fetch(
        `https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&played=1&wishlist=1&preowned=1&want=1&wanttoplay=1&wanttobuy=1&trade=1`
        );
        const xml = await res.text();
        const parsed = parse(xml, { ignoreAttributes: false });
        const items = parsed?.items?.item;

        if (!items) {
        toast.error('No collection found or profile is private.');
        return;
        }

        const games = Array.isArray(items) ? items : [items];
        const collection = {
        own: [],
        played: [],
        wishlist: [],
        prevowned: [],
        want: [],
        wanttoplay: [],
        wanttobuy: [],
        trade: []
        };

        for (const game of games) {
        const id = parseInt(game['@_objectid']);
        const status = game.status || {};
        if (status['@_own'] === '1') collection.own.push(id);
        if (status['@_played'] === '1') collection.played.push(id);
        if (status['@_wishlist'] === '1') collection.wishlist.push(id);
        if (status['@_prevowned'] === '1') collection.prevowned.push(id);
        if (status['@_want'] === '1') collection.want.push(id);
        if (status['@_wanttoplay'] === '1') collection.wanttoplay.push(id);
        if (status['@_wanttobuy'] === '1') collection.wanttobuy.push(id);
        if (status['@_trade'] === '1') collection.trade.push(id);
        }

        const { error } = await supabase
        .from('users')
        .update({ bgg_collection: collection })
        .eq('id', user?.id);

        if (error) {
        console.error(error);
        toast.error('Failed to save BGG collection');
        } else {
        toast.success(`${games.length} games synced from BGG!`);
        }
    } catch {
        toast.error('BGG sync failed');
    } finally {
        setBggCollectionLoading(false);
    }
    };


  const handleSubmit = async () => {
    if (!city) {
      alert('City is required');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        city,
        gender,
        dob,
        whatsapp,
        bgg,
        avatar_url: avatarUrl,
        has_onboarded: true
      })
      .eq('id', user?.id);

    setLoading(false);

    if (error) {
    alert('Failed to save');
    } else {
    if (bgg && !bggCollectionLoading) {
        await syncBGGCollection(bgg);
    }
    navigate('/profile');
    }

  };

  const handleSkip = () => {
    if (!city) {
      alert('City is required to skip');
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
        <label className="block mb-1">Avatar</label>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setSelectedFile(file);
            }}
            className="w-full border rounded p-2"
        />
        {avatarUrl && (
            <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full mt-2" />
        )}
        </div>

        <div>
          <label className="block mb-1">City</label>
          <CityCombobox value={city} onChange={setCity} />
        </div>

        <div>
          <label className="block mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">WhatsApp Number</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
            placeholder="+628123456789"
            className="w-full border rounded p-2"
          />
          {whatsapp && !isValidWhatsApp(whatsapp) && (
            <p className="text-red-500 text-sm mt-1">Invalid WhatsApp number</p>
          )}
        </div>

        <div>
        <label className="block mb-1">BoardGameGeek Username</label>
        <input
            type="text"
            value={bgg}
            onChange={(e) => setBgg(e.target.value.toLowerCase())}
            onBlur={() => fetchBGGProfile(bgg)}
            className="w-full border rounded p-2"
            placeholder="e.g. meeplemaster"
        />

        <button
            onClick={() => syncBGGCollection(bgg)}
            disabled={bggCollectionLoading || !bgg}
            className="mt-2 w-full bg-purple-600 text-white rounded py-2"
        >
            {bggCollectionLoading ? 'Syncing...' : 'Sync BGG Collection'}
        </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 mt-4"
        >
          {loading ? 'Saving...' : 'Finish Onboarding'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full border border-gray-300 text-gray-600 rounded py-2"
        >
          Skip
        </button>
        {selectedFile && (
        <AvatarCropModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onComplete={async (croppedBlob) => {
            // 1️⃣ Upload the cropped file to UploadThing
            const uploadRes = await uploadFiles("imageUploader", {
                files: [new File([croppedBlob], "avatar.jpg")],
            });

            const url = uploadRes?.[0]?.url;
            if (!url) return;

            // 2️⃣ Update local state so the preview shows immediately
            setAvatarUrl(url);
            setSelectedFile(null);

            // 3️⃣ Persist the new avatar URL to Supabase
            const { error } = await supabase
                .from("users")
                .update({ avatar_url: url })
                .eq("id", user?.id);

            if (error) {
                toast.error("Failed to save avatar");
            } else {
                toast.success("Avatar uploaded and saved!");
            }
            }}
        />
        )}


      </div>
    </div>
    
  );
}


export default OnboardingPage;