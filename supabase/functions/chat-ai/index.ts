
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, header, sessionId, userId } = await req.json();

    console.log('Received request:', { message, sessionId, userId });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Load the Gemini API key securely from secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Server configuration error: GEMINI_API_KEY is not set.');
    }

    let currentSessionId = sessionId;

    if (sessionId === "new" || !sessionId) {
      const { data: newSession, error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: message.length > 30 ? `${message.substring(0, 30)}...` : message,
        })
        .select()
        .single();
        
      if (sessionError) {
        console.error('Session creation error:', sessionError);
        throw sessionError;
      }
      currentSessionId = newSession.id;
    }

    // Save user message
    const { error: messageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        content: message,
        role: "user",
      });
      
    if (messageError) {
      console.error('Message save error:', messageError);
      throw messageError;
    }

    const systemPrompt = `You are a compassionate AI mental health companion providing personalized support.

${header || 'You are speaking with a user seeking mental health support.'}

IMPORTANT MOOD DETECTION INSTRUCTION:
You MUST include a mood indicator in your response using this exact format: <<<<MOOD>>>>
Where MOOD can be: happy, sad, angry, or neutral
Place this indicator at the very END of your response.

Examples:
- If the user seems happy: "That's wonderful to hear! <<<<happy>>>>"
- If the user seems sad: "I understand this is difficult. <<<<sad>>>>"
- If the user seems angry: "I can hear your frustration. <<<<angry>>>>"
- If the mood is unclear: "Thank you for sharing. <<<<neutral>>>>"

INSTRUCTIONS:
- Be empathetic, understanding, and supportive
- Provide evidence-based coping strategies when appropriate
- Ask thoughtful follow-up questions to understand their emotional state
- If the user expresses severe distress or suicidal thoughts, encourage immediate professional help
- Validate their feelings and experiences
- Keep responses conversational and warm
- Remember you provide emotional support, not professional therapy
- ALWAYS end with the mood indicator <<<<MOOD>>>>

User message: ${message}`;

    console.log('Calling Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.9,
          topK: 40,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm experiencing some difficulties, but I'm still here to listen and support you. <<<<neutral>>>>";

    // Extract mood from AI response
    const moodMatch = aiResponse.match(/<<<<(happy|sad|angry|neutral)>>>>/i);
    let detectedMood = 'neutral';
    
    if (moodMatch) {
      detectedMood = moodMatch[1].toLowerCase();
      // Remove the mood indicator from the response before sending to user
      aiResponse = aiResponse.replace(/<<<<(happy|sad|angry|neutral)>>>>/i, '').trim();
      console.log('Detected mood:', detectedMood);
    }

    // Update user mood in database
    try {
      const { error: moodError } = await supabaseClient
        .from('user_settings')
        .update({ mood: detectedMood })
        .eq('user_id', userId);
        
      if (moodError) {
        console.error('Mood update error:', moodError);
      } else {
        console.log('User mood updated to:', detectedMood);
      }
    } catch (error) {
      console.error('Error updating mood:', error);
    }

    // Save AI response
    const { error: aiMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        content: aiResponse,
        role: "assistant",
      });
      
    if (aiMessageError) {
      console.error('AI message save error:', aiMessageError);
    }

    // Update session timestamp
    await supabaseClient
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', currentSessionId);

    return new Response(JSON.stringify({ 
      response: aiResponse, 
      sessionId: currentSessionId,
      detectedMood: detectedMood
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in chat-ai function:', error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm experiencing some technical difficulties, but I want you to know that I'm here for you. Please try sending your message again, and if the problem continues, remember that your feelings are valid and there are always people who care about your wellbeing.",
      detectedMood: 'neutral'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
