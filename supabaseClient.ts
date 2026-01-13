
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase Configuration Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File | string, fileName?: string) => {
    const name = fileName || `img_${Date.now()}`;
    let body: any = file;

    // If it's a base64 string from a preview
    if (typeof file === 'string' && file.startsWith('data:')) {
        const res = await fetch(file);
        body = await res.blob();
    }

    const { data, error } = await supabase.storage
        .from('institution-images')
        .upload(`${name}.jpg`, body, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('institution-images')
        .getPublicUrl(data.path);

    return publicUrl;
};
