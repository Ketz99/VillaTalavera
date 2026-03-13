import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Configuración de CORS para que tu GitHub Pages pueda llamar a esta función
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Manejar la solicitud CORS de pre-vuelo (Opciones)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Recibir los datos desde tu carrito.js
    const { orderId, amount, currency } = await req.json()
    
    // 3. Obtener la Llave Secreta desde las variables de entorno seguras de Supabase
    const secretKey = Deno.env.get('BOLD_SECRET_KEY')

    if (!secretKey) {
      throw new Error("Falta configurar BOLD_SECRET_KEY en el servidor")
    }

    // 4. Fórmula de Bold: order_id + amount + currency + secret_key
    const rawString = `${orderId}${amount}${currency}${secretKey}`

    // 5. Encriptar en SHA-256 (Web Crypto API)
    const msgBuffer = new TextEncoder().encode(rawString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // 6. Devolver el hash seguro a tu Frontend
    return new Response(
      JSON.stringify({ hash: hashHex }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})