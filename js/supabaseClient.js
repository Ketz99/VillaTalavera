const supabaseUrl = 'https://xqkrmcakdpgfmqwdiszs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa3JtY2FrZHBnZm1xd2Rpc3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzcwMzYsImV4cCI6MjA3MzMxMzAzNn0.M3lXDQuk_VxERH39_KKPeq_JMYUpeoa1CJal6cmfE3s';

// En lugar de declarar "const supabase", tomamos la librería del CDN 
// y sobrescribimos la variable global window.supabase con tu cliente ya conectado.
window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);