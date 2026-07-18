/**
 * Per-animal content, keyed by Chi index (0 = Tý … 11 = Hợi).
 * Drafted from traditional Vietnamese characterizations; Justin reviews
 * and edits for voice and accuracy.
 */

export interface AnimalContent {
  /** Two-or-three-sentence portrait of the sign's character. */
  portrait: string
  strengths: string[]
  frictions: string[]
  /** One line on how this animal moves through the world. */
  essence: string
}

export const ANIMAL_CONTENT: AnimalContent[] = [
  {
    // Tý — Rat
    essence: 'Quick water finds every crack.',
    portrait:
      'People born under Tý are the ones who notice the side door while everyone else lines up at the front. Sharp, sociable, and quietly ambitious, they read a room in seconds and rarely waste a favor. They keep more in reserve than they show: money, plans, feelings, all tucked away somewhere safe.',
    strengths: ['Resourceful under pressure', 'Charming without trying', 'Sees opportunities early'],
    frictions: ['Holds cards too close, even with people who have earned trust', 'Restless when life gets too quiet'],
  },
  {
    // Sửu — Water Buffalo
    essence: 'The field gets plowed, rain or not.',
    portrait:
      'Sửu is the backbone sign. These are the people who show up early, carry the heavy end, and never announce it. Their word is a contract and their patience is long, but so is their memory: cross a Buffalo once and the ledger stays open for years.',
    strengths: ['Dependable past the point most people quit', 'Calm in a crisis', 'Builds things that last'],
    frictions: ['Stubborn long after being right stopped mattering', 'Slow to say what they need'],
  },
  {
    // Dần — Tiger
    essence: 'Leaps first, counts the cliffs later.',
    portrait:
      'Dần people carry their own weather. Bold, magnetic, allergic to being told to wait their turn, they would rather fail loudly than succeed quietly under someone else. When a Tiger believes in you, you feel ten feet tall. When they are restless, everyone within earshot knows.',
    strengths: ['Courage that steadies other people', 'Natural authority', 'Fierce loyalty to their own'],
    frictions: ['Acts before the plan is finished', 'Pride makes apologies expensive'],
  },
  {
    // Mão — Cat
    essence: 'Soft steps, sharp eyes.',
    portrait:
      'In the Vietnamese zodiac this is the Cat, and it fits: graceful, observant, and very hard to rush. Mão people keep the peace without surrendering the point, preferring a well-timed word to a raised voice. They build homes and friendships that feel like warm rooms, and they guard their inner life carefully.',
    strengths: ['Tact that defuses fights before they start', 'Excellent judge of character', 'Makes any space feel like home'],
    frictions: ['Avoids confrontation until it grows teeth', 'Retreats instead of asking for help'],
  },
  {
    // Thìn — Dragon
    essence: 'Born believing the sky is reachable.',
    portrait:
      'The only mythical animal in the cycle, and Thìn people tend to live like they know it. Big plans, big generosity, big presence. They lift whole rooms when they are lit up, and they hold themselves to standards nobody assigned them. The hardest audience a Dragon ever plays to is the one in the mirror.',
    strengths: ['Vision that pulls others along', 'Generous with credit and help', 'Thrives on ambitious stakes'],
    frictions: ['Confuses being doubted with being insulted', 'Bored by maintenance, hungry for launch'],
  },
  {
    // Tỵ — Snake
    essence: 'Still surface, deep current.',
    portrait:
      'Tỵ people think three moves ahead and tell you about move one. Elegant, intuitive, and private, they trust pattern over noise and their own counsel over the crowd. They are the friend who says little at dinner, then calls the next day with the one observation that reframes everything.',
    strengths: ['Reads what is unsaid', 'Composed when others spiral', 'Refined taste, in things and in people'],
    frictions: ['Secretive even when openness would win', 'Possessive of people they love'],
  },
  {
    // Ngọ — Horse
    essence: 'The open road is the destination.',
    portrait:
      'Ngọ runs on motion and honesty. Quick to laugh, quick to leave, they do their best thinking at full speed and their worst waiting in line. Freedom is not a preference for a Horse; it is oxygen. The trick to loving one is simple to say and hard to do: leave the gate open and they stay.',
    strengths: ['Infectious energy', 'Says the true thing plainly', 'Adapts fast when plans collapse'],
    frictions: ['Commits late, bolts early', 'Patience runs out before the finish line'],
  },
  {
    // Mùi — Goat
    essence: 'Gentle hands make beautiful things.',
    portrait:
      'Mùi people are the artists and the peacemakers, the ones who notice the light in a room and the tension in a friend. Kind by instinct rather than strategy, they give more than they track. Their softness gets mistaken for weakness by people who have never watched one quietly endure what would flatten anyone else.',
    strengths: ['Deep well of empathy', 'An eye for beauty in ordinary things', 'Endures hardship without hardening'],
    frictions: ['Worries in circles', 'Waits to be chosen instead of choosing'],
  },
  {
    // Thân — Monkey
    essence: 'Every lock has a joke that opens it.',
    portrait:
      'Thân is the cleverest sign in the cycle and knows it. Fast-talking, curious, endlessly inventive, they can improvise a solution or an excuse with equal polish. Life around a Monkey is never dull. Focus is the tax they keep forgetting to pay: brilliance in ten directions, follow-through in two.',
    strengths: ['Wit that solves real problems', 'Learns anything quickly', 'Turns disasters into stories'],
    frictions: ['Bores easily, abandons the almost-finished', 'Cleverness can shade into cutting corners'],
  },
  {
    // Dậu — Rooster
    essence: 'First voice of the morning, and sure of it.',
    portrait:
      'Dậu people see the crooked picture frame the moment they enter the room. Precise, punctual, and unafraid of an honest opinion, they hold the standard when everyone else is willing to let it slide. Underneath the polish and the pride sits real bravery: a Rooster will say the uncomfortable thing to your face, never behind your back.',
    strengths: ['Meticulous, catches what others miss', 'Honest even when it costs', 'Keeps promises to the letter'],
    frictions: ['Blunt past the point of useful', 'Perfectionism turns inward and bites'],
  },
  {
    // Tuất — Dog
    essence: 'Stands watch so others can sleep.',
    portrait:
      'Tuất is loyalty with a spine. Fair-minded, protective, and deeply uneasy around injustice, Dog people are the ones friends call at 2 a.m. because they know the phone gets answered. They love in acts more than words. The same vigilance that makes them trustworthy keeps them up at night rehearsing what could go wrong.',
    strengths: ['Loyalty that does not waver under pressure', 'Strong moral compass', 'Gives real help, not just sympathy'],
    frictions: ['Anxiety dressed up as pessimism', 'Slow to forgive betrayal, including small ones'],
  },
  {
    // Hợi — Pig
    essence: 'The table is long and everyone is invited.',
    portrait:
      'Hợi people believe in comfort, honesty, and enough food for seconds. Openhanded and slow to suspect, they build the kind of goodwill money cannot buy, and they enjoy life without apologizing for it. Their trust is a gift; the ones who exploit it tend to regret the loss more than the Pig does.',
    strengths: ['Generosity without a scoreboard', 'Honest and easy to trust', 'Finds joy in the everyday'],
    frictions: ['Trusts first, verifies never', 'Indulgence wins arguments with discipline'],
  },
]
