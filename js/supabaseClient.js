const supabaseUrl = 'https://vmibgwpkzymqnlldhepx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaWJnd3BrenltcW5sbGRoZXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjk2MTcsImV4cCI6MjA5OTgwNTYxN30.pQ5n0EOwk_-QGgyulYrVb7XoE27tNVS9tzUSfVGIG-4';

// En lugar de declarar "const supabase", tomamos la librería del CDN 
// y sobrescribimos la variable global window.supabase con tu cliente ya conectado.
window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
console.log("¡Cliente conectado exitosamente al nuevo entorno de Supabase!");