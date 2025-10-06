// Usamos la variable global "supabase" que se importará desde el CDN en los archivos HTML.
const supabaseUrl = 'https://xqkrmcakdpgfmqwdiszs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa3JtY2FrZHBnZm1xd2Rpc3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzcwMzYsImV4cCI6MjA3MzMxMzAzNn0.M3lXDQuk_VxERH39_KKPeq_JMYUpeoa1CJal6cmfE3s';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
// console.log(supabase)