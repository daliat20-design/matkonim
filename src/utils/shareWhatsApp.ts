import { Recipe } from '../types';

export function getRecipeWhatsAppMessage(recipe: Recipe): string {
  let msg = `📖 *${recipe.title}*\n`;
  if (recipe.subtitle) msg += `_${recipe.subtitle}_\n`;
  msg += `👩‍🍳 *${recipe.contributor}*\n`;
  msg += `⏱️ הכנה: ${recipe.prepTime} | בישול: ${recipe.cookTime} | ${recipe.servings}\n\n`;

  msg += `🛒 *מצרכים:*\n`;
  recipe.ingredients.forEach(ing => {
    msg += `• ${ing.amount} — ${ing.item}\n`;
  });

  msg += `\n🍳 *אופן ההכנה:*\n`;
  recipe.steps.forEach((step, idx) => {
    msg += `${idx + 1}. ${step.text}\n`;
  });

  if (recipe.secretTip) {
    msg += `\n💡 *הטיפ של סבתא:* ${recipe.secretTip}\n`;
  }

  if (recipe.grandmaVoiceNote) {
    msg += `\n📜 *ככה סבתא אסתר מעבירה מתכונים – בהצלחה!! 😂*\n"${recipe.grandmaVoiceNote}"\n`;
  }

  if (recipe.familyMemory) {
    msg += `\n❤️ *זיכרון משפחתי:* ${recipe.familyMemory}\n`;
  }

  msg += `\n📚 נשלח מתוך ספר המתכונים שלנו`;
  return msg;
}

export function shareRecipeToWhatsApp(recipe: Recipe): void {
  const text = encodeURIComponent(getRecipeWhatsAppMessage(recipe));
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}
