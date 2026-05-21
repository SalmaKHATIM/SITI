import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, user_id, message_id } = body;

    if (!message || !user_id || !message_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simple intent detection and response generation
    const lowerMessage = message.toLowerCase();
    
    let intent = 'general_inquiry';
    let response = '';
    let entities: any = {};

    // Detect intent from keywords
    if (
      lowerMessage.includes('produit') ||
      lowerMessage.includes('thé') ||
      lowerMessage.includes('product')
    ) {
      intent = 'product_inquiry';
      response =
        'Vous demandez des informations sur les produits. Veuillez consulter la page Produits pour voir la liste complète de nos thés.';

      // Try to get product count
      const { data: products, error } = await supabase
        .from('products')
        .select('id', { count: 'exact' });

      if (!error && products) {
        response += ` Nous avons actuellement ${products.length} produits en stock.`;
      }
    } else if (
      lowerMessage.includes('lot') ||
      lowerMessage.includes('batch') ||
      lowerMessage.includes('production')
    ) {
      intent = 'batch_inquiry';
      response =
        'Vous demandez des informations sur les lots. Consultez la page Batches pour voir tous les lots en cours.';
    } else if (
      lowerMessage.includes('stock') ||
      lowerMessage.includes('inventaire') ||
      lowerMessage.includes('quantité')
    ) {
      intent = 'stock_inquiry';
      response =
        'Vous demandez des informations sur le stock. Consultez la page Stock Management pour voir les niveaux d\'inventaire actuels.';
    } else if (
      lowerMessage.includes('qualité') ||
      lowerMessage.includes('quality') ||
      lowerMessage.includes('score')
    ) {
      intent = 'quality_inquiry';
      response =
        'Vous demandez des informations sur la qualité. Consultez la page Reports pour voir les scores de qualité et les contrôles détaillés.';
    } else if (
      lowerMessage.includes('aide') ||
      lowerMessage.includes('help') ||
      lowerMessage.includes('comment') ||
      lowerMessage.includes('how')
    ) {
      intent = 'help_request';
      response =
        'Comment puis-je vous aider? Je peux répondre à des questions sur les produits, les lots, le stock et la qualité. Utilisez les pages du dashboard pour plus de détails.';
    } else {
      intent = 'general_inquiry';
      response =
        'Merci pour votre question. Je peux vous aider avec des questions sur les produits, les lots, le stock et la qualité. Veuillez être plus spécifique.';
    }

    // Store processing result
    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({
        response: response,
        intent: intent,
        entities: entities,
      })
      .eq('id', message_id);

    if (updateError) {
      console.error('[STTIS] Error updating chat message:', updateError);
    }

    return NextResponse.json({
      success: true,
      response: response,
      intent: intent,
      entities: entities,
    });
  } catch (error) {
    console.error('[STTIS] Chat processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
