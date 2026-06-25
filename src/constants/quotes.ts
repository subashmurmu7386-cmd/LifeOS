export const DAILY_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Motivation" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Persistence" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", category: "Resilience" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Motivation" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Opportunity" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
  { text: "Success is not final; failure is not fatal. It is the courage to continue that counts.", author: "Winston Churchill", category: "Courage" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Persistence" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "Life" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Action" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "Purpose" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", category: "Persistence" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", category: "Growth" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Mindset" },
  { text: "An unexamined life is not worth living.", author: "Socrates", category: "Philosophy" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", category: "Love" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt", category: "Resilience" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead", category: "Humor" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", category: "Leadership" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou", category: "Resilience" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Resilience" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "Life" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth", category: "Courage" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller", category: "Adventure" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison", category: "Persistence" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss", category: "Motivation" },
];

export function getTodayQuote(): typeof DAILY_QUOTES[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
