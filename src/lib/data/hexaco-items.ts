import type { QuizItem } from "../types";

export const hexacoItems: QuizItem[] = [
  // ─── H: Honesty-Humility (IDs 1-10) ─────────────────────────────────

  // Sincerity
  { id: 1,  text: 'I would be tempted to buy stolen property if I were sure I would not get caught.', domain: 'H', subscale: 'sincerity', reverse: true },
  { id: 2,  text: "I wouldn't pretend to like someone just to get that person to do favors for me.", domain: 'H', subscale: 'sincerity', reverse: false },
  { id: 3,  text: 'If I want something from a person I dislike, I will act very nicely toward that person in order to get it.', domain: 'H', subscale: 'sincerity', reverse: true },

  // Fairness
  { id: 4,  text: 'I would never accept a bribe, even if it were very large.', domain: 'H', subscale: 'fairness', reverse: false },
  { id: 5,  text: "I'd be tempted to use counterfeit money, if I were sure I could get away with it.", domain: 'H', subscale: 'fairness', reverse: true },
  { id: 6,  text: 'I think I am entitled to more respect than the average person is.', domain: 'H', subscale: 'fairness', reverse: true },

  // Greed-Avoidance
  { id: 7,  text: 'I would like to live in a very expensive, luxurious home.', domain: 'H', subscale: 'greed-avoidance', reverse: true },
  { id: 8,  text: 'I think that I am worth more than other people think I am.', domain: 'H', subscale: 'greed-avoidance', reverse: true },

  // Modesty
  { id: 9,  text: 'I am an ordinary person who is no better than others.', domain: 'H', subscale: 'modesty', reverse: false },
  { id: 10, text: 'I would not want people to treat me as though I were superior to them.', domain: 'H', subscale: 'modesty', reverse: false },

  // ─── E: Emotionality (IDs 11-20) ─────────────────────────────────────

  // Fearfulness
  { id: 11, text: 'When it comes to physical danger, I am very fearful.', domain: 'E', subscale: 'fearfulness', reverse: false },
  { id: 12, text: 'I feel comfortable in situations that involve physical risks.', domain: 'E', subscale: 'fearfulness', reverse: true },
  { id: 13, text: 'I would feel afraid if I had to travel in bad weather conditions.', domain: 'E', subscale: 'fearfulness', reverse: false },

  // Anxiety
  { id: 14, text: 'I worry a lot about things that might seem unimportant to others.', domain: 'E', subscale: 'anxiety', reverse: false },
  { id: 15, text: 'I rarely, if ever, feel tense or jumpy.', domain: 'E', subscale: 'anxiety', reverse: true },

  // Dependence
  { id: 16, text: 'I need the support of other people in order to cope with life\'s difficulties.', domain: 'E', subscale: 'dependence', reverse: false },
  { id: 17, text: 'I can handle difficulties on my own, without any help from others.', domain: 'E', subscale: 'dependence', reverse: true },

  // Sentimentality
  { id: 18, text: "I sometimes feel moved to tears when I see other people's misfortunes.", domain: 'E', subscale: 'sentimentality', reverse: false },
  { id: 19, text: 'I feel strong emotions when someone close to me is going through a hard time.', domain: 'E', subscale: 'sentimentality', reverse: false },
  { id: 20, text: "I don't feel very emotional even in situations where most people would be moved.", domain: 'E', subscale: 'sentimentality', reverse: true },

  // ─── X: Extraversion (IDs 21-30) ─────────────────────────────────────

  // Social Self-Esteem
  { id: 21, text: 'I feel confident that people would enjoy spending time with me.', domain: 'X', subscale: 'social-self-esteem', reverse: false },
  { id: 22, text: "On most days, I feel cheerful and optimistic.", domain: 'X', subscale: 'social-self-esteem', reverse: false },
  { id: 23, text: 'I sometimes think that I am a worthless person.', domain: 'X', subscale: 'social-self-esteem', reverse: true },

  // Social Boldness
  { id: 24, text: 'I feel nervous when I have to speak in front of a group of people.', domain: 'X', subscale: 'social-boldness', reverse: true },
  { id: 25, text: 'When I am in a group of people, I am often the one who speaks on behalf of the group.', domain: 'X', subscale: 'social-boldness', reverse: false },
  { id: 26, text: 'I would enjoy giving a speech in front of a large audience.', domain: 'X', subscale: 'social-boldness', reverse: false },

  // Sociability
  { id: 27, text: 'I prefer jobs that involve active social interaction to those that involve working alone.', domain: 'X', subscale: 'sociability', reverse: false },
  { id: 28, text: "In social situations, I'm usually the quiet one.", domain: 'X', subscale: 'sociability', reverse: true },

  // Liveliness
  { id: 29, text: 'My friends would describe me as a lively, energetic person.', domain: 'X', subscale: 'liveliness', reverse: false },
  { id: 30, text: 'I rarely get enthusiastic about anything.', domain: 'X', subscale: 'liveliness', reverse: true },

  // ─── A: Agreeableness (IDs 31-40) ────────────────────────────────────

  // Forgiveness
  { id: 31, text: 'I find it difficult to forgive people who have been unkind to me.', domain: 'A', subscale: 'forgiveness', reverse: true },
  { id: 32, text: 'My attitude toward people who have treated me badly is "forgive and forget."', domain: 'A', subscale: 'forgiveness', reverse: false },

  // Gentleness
  { id: 33, text: "I'm usually quite critical of people's faults.", domain: 'A', subscale: 'gentleness', reverse: true },
  { id: 34, text: 'I tend to be lenient in judging other people.', domain: 'A', subscale: 'gentleness', reverse: false },
  { id: 35, text: 'When people tell me about their problems, I find it easy to adopt their point of view.', domain: 'A', subscale: 'gentleness', reverse: false },

  // Flexibility
  { id: 36, text: 'I find it difficult to compromise with people when I really think I am right.', domain: 'A', subscale: 'flexibility', reverse: true },
  { id: 37, text: 'I can compromise and meet people halfway when there is a disagreement.', domain: 'A', subscale: 'flexibility', reverse: false },
  { id: 38, text: "I tend to be stubborn when I believe I'm right, even if others disagree.", domain: 'A', subscale: 'flexibility', reverse: true },

  // Patience
  { id: 39, text: 'I lose my temper pretty easily.', domain: 'A', subscale: 'patience', reverse: true },
  { id: 40, text: 'I remain calm in situations that would frustrate most people.', domain: 'A', subscale: 'patience', reverse: false },

  // ─── C: Conscientiousness (IDs 41-50) ────────────────────────────────

  // Organization
  { id: 41, text: 'I plan ahead and organize things, to avoid scrambling at the last minute.', domain: 'C', subscale: 'organization', reverse: false },
  { id: 42, text: 'I often make a mess of the things I am responsible for.', domain: 'C', subscale: 'organization', reverse: true },

  // Diligence
  { id: 43, text: 'I work hard even when no one is watching or checking up on me.', domain: 'C', subscale: 'diligence', reverse: false },
  { id: 44, text: 'I put a lot of effort into my work.', domain: 'C', subscale: 'diligence', reverse: false },

  // Perfectionism
  { id: 45, text: 'I make sure that everything is in order before I start a task.', domain: 'C', subscale: 'perfectionism', reverse: false },
  { id: 46, text: 'I tend to do things in a fairly routine way.', domain: 'C', subscale: 'perfectionism', reverse: true },
  { id: 47, text: 'I need everything to be just right before I can continue with a task.', domain: 'C', subscale: 'perfectionism', reverse: false },

  // Prudence
  { id: 48, text: 'I often do things on impulse, without thinking them through first.', domain: 'C', subscale: 'prudence', reverse: true },
  { id: 49, text: 'I think carefully before making decisions.', domain: 'C', subscale: 'prudence', reverse: false },
  { id: 50, text: 'I tend to jump into things without thinking about what could go wrong.', domain: 'C', subscale: 'prudence', reverse: true },

  // ─── O: Openness to Experience (IDs 51-60) ───────────────────────────

  // Aesthetic Appreciation
  { id: 51, text: 'I enjoy looking at art, even though some people might think it is boring.', domain: 'O', subscale: 'aesthetic-appreciation', reverse: false },
  { id: 52, text: 'I find beauty in things that other people might not notice.', domain: 'O', subscale: 'aesthetic-appreciation', reverse: false },

  // Inquisitiveness
  { id: 53, text: 'I enjoy reading books about science and history.', domain: 'O', subscale: 'inquisitiveness', reverse: false },
  { id: 54, text: 'I seek out information about many different topics.', domain: 'O', subscale: 'inquisitiveness', reverse: false },

  // Creativity
  { id: 55, text: 'I have a lot of imagination.', domain: 'O', subscale: 'creativity', reverse: false },
  { id: 56, text: 'I find it easy to come up with new and original ideas.', domain: 'O', subscale: 'creativity', reverse: false },
  { id: 57, text: 'I rarely daydream or let my mind wander to unusual ideas.', domain: 'O', subscale: 'creativity', reverse: true },

  // Unconventionality
  { id: 58, text: 'I find it boring to always do things in the same way.', domain: 'O', subscale: 'unconventionality', reverse: false },
  { id: 59, text: 'I prefer the conventional and traditional over the unusual and experimental.', domain: 'O', subscale: 'unconventionality', reverse: true },
  { id: 60, text: 'I am interested in learning about the history and customs of other cultures.', domain: 'O', subscale: 'unconventionality', reverse: false },
];

export const hexacoItemMap: Record<number, QuizItem> = Object.fromEntries(
  hexacoItems.map((i) => [i.id, i])
);
