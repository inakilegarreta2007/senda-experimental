import { supabase } from '@/supabaseClient';

async function setupAdminRole() {
    console.log('🔧 Configurando rol de administrador...');

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('❌ Error: No hay usuario autenticado', userError);
        return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error al verificar perfil:', checkError);
        return;
    }

    if (existingProfile) {
        console.log('📝 Perfil existente encontrado:', existingProfile);

        // Update role to admin
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);

        if (updateError) {
            console.error('❌ Error al actualizar rol:', updateError);
        } else {
            console.log('✅ Rol actualizado a admin correctamente!');
        }
    } else {
        console.log('📝 No existe perfil, creando uno nuevo...');

        // Create new profile with admin role
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                role: 'admin',
                email: user.email
            });

        if (insertError) {
            console.error('❌ Error al crear perfil:', insertError);
        } else {
            console.log('✅ Perfil creado con rol admin correctamente!');
        }
    }

    // Verify the change
    const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    console.log('🔍 Perfil final:', updatedProfile);
    console.log('\n✨ Proceso completado. Recarga la página para aplicar cambios.');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    (window as any).setupAdminRole = setupAdminRole;
    console.log('💡 Ejecuta setupAdminRole() en la consola para configurar tu rol de admin');
}

export { setupAdminRole };
