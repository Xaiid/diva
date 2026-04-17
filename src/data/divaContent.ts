/** English wording aligned with DIVA 2.0 / DSM-IV-TR criteria (from source interview structure). */

export type CriterionItem = {
  id: string;
  code: string;
  title: string;
  adultExamples: string[];
  childExamples: string[];
};

export const INATTENTION: CriterionItem[] = [
  {
    id: "a1",
    code: "A1a",
    title:
      "Often fails to give close attention to details or makes careless mistakes in schoolwork, work, or other activities.",
    adultExamples: [
      "Careless mistakes",
      "Must work more slowly to avoid mistakes",
      "Does not read instructions carefully",
      "Difficulty working with detail",
      "Spends excessive time on details",
      "Gets stuck in details",
      "Works too fast and then makes mistakes",
    ],
    childExamples: [
      "Careless mistakes in schoolwork",
      "Mistakes from not reading questions properly",
      "Unanswered questions because of reading difficulty",
      "Back of test left blank",
      "Others commented work looked careless",
      "Did not check homework answers",
      "Took too long on very detailed tasks",
    ],
  },
  {
    id: "a2",
    code: "A1b",
    title: "Often has difficulty sustaining attention in tasks or play activities.",
    adultExamples: [
      "Cannot sustain attention for long in tasks*",
      "Easily distracted by own associations and thoughts",
      "Difficulty finishing a film or reading a book*",
      "Quickly tires of things*",
      "Asks about topics already discussed",
    ],
    childExamples: [
      "Difficulty sustaining attention in schoolwork",
      "Difficulty sustaining attention in play*",
      "Easily distracted",
      "Could not concentrate well*",
      "Needed a lot of structure to avoid distraction",
      "Quickly tired of activities*",
    ],
  },
  {
    id: "a3",
    code: "A1c",
    title: "Often does not seem to listen when spoken to directly.",
    adultExamples: [
      "Absent or distracted",
      "Difficulty concentrating in a conversation",
      "After a conversation, unsure what it was about",
      "Often changes the topic of conversation",
      "Others often say you seem distracted",
    ],
    childExamples: [
      "Did not know what parents or teachers had just said",
      "Absent or distracted",
      "Only listened with eye contact or raised voice",
      "Often needed several attempts to get your attention",
      "Questions had to be repeated several times",
    ],
  },
  {
    id: "a4",
    code: "A1d",
    title:
      "Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace (not due to oppositional behaviour or failure to understand instructions).",
    adultExamples: [
      "Does several things at once without finishing",
      "Difficulty finishing something when it is no longer novel",
      "Needs a deadline to finish something",
      "Difficulty finishing administrative tasks",
      "Difficulty following instructions",
    ],
    childExamples: [
      "Difficulty following instructions",
      "Difficulty with multi-step tasks",
      "Did not finish things",
      "Homework unfinished or not handed in",
      "Needed a lot of structure to finish tasks",
    ],
  },
  {
    id: "a5",
    code: "A1e",
    title: "Often has difficulty organizing tasks and activities.",
    adultExamples: [
      "Difficulty planning daily tasks",
      "Home and/or workplace disorganized",
      "Over-plans or does not plan efficiently",
      "Often double-books appointments",
      "Often late",
      "Cannot use a planner consistently",
      "Rigid because routines are needed",
      "Poor sense of time",
      "Makes schedules but does not follow them",
      "Needs others to structure things",
    ],
    childExamples: [
      "Difficulty being ready on time",
      "Messy room or desk",
      "Difficulty playing independently",
      "Difficulty planning homework",
      "Did several things at once",
      "Often late",
      "Poor sense of time",
      "Difficulty entertaining self alone",
    ],
  },
  {
    id: "a6",
    code: "A1f",
    title:
      "Often avoids, dislikes, or is reluctant to engage in tasks requiring sustained mental effort (such as schoolwork or homework).",
    adultExamples: [
      "Tries easy or fun things first",
      "Often puts off difficult or boring tasks",
      "Delays tasks so deadlines are missed",
      "Avoids monotonous work (e.g. admin)",
      "Dislikes reading because of mental effort",
      "Avoids tasks requiring high concentration",
    ],
    childExamples: [
      "Avoided or disliked homework",
      "Read few books; reading felt effortful",
      "Avoided things requiring high concentration",
      "Disliked subjects requiring high concentration",
      "Put off difficult or boring tasks",
    ],
  },
  {
    id: "a7",
    code: "A1g",
    title:
      "Often loses things necessary for tasks or activities (e.g. toys, school assignments, pencils, books, or tools).",
    adultExamples: [
      "Loses wallet, keys, or planner",
      "Often leaves belongings behind",
      "Loses work papers",
      "Spends a lot of time looking for things",
      "Distressed if others move your things",
      "Stores things in inappropriate places",
      "Loses lists, phone numbers, or notes",
    ],
    childExamples: [
      "Lost planner, pens, sports bag, etc.",
      "Lost clothes, toys, or homework",
      "Spent a lot of time looking for things",
      "Distressed if others moved things",
      "Parents or teachers often said you lost things",
    ],
  },
  {
    id: "a8",
    code: "A1h",
    title: "Is often easily distracted by extraneous stimuli.",
    adultExamples: [
      "Difficulty screening out external stimuli",
      "Difficulty picking up the thread after distraction",
      "Noise or surroundings easily distract",
      "Follows others’ conversations",
      "Difficulty filtering or selecting information",
    ],
    childExamples: [
      "Often looked out of the window in class",
      "Easily distracted by noise or surroundings",
      "Difficulty picking up the thread after distraction",
    ],
  },
  {
    id: "a9",
    code: "A1i",
    title: "Is often forgetful in daily activities.",
    adultExamples: [
      "Forgets appointments or obligations",
      "Forgets keys, planner, etc.",
      "Others often need to remind you of commitments",
      "Often returns home for forgotten items",
      "Rigid schemes to avoid forgetting",
      "Forgets to write in or check planner",
    ],
    childExamples: [
      "Often forgot agreements or tasks",
      "Needed frequent reminders",
      "Forgot what to do mid-task",
      "Forgot to bring needed items to school",
      "Left things at school or friends’ houses",
    ],
  },
];

export const HYPERACTIVITY_IMPULSIVITY: CriterionItem[] = [
  {
    id: "h1",
    code: "H/I 1",
    title: "Often fidgets with hands or feet or squirms in seat.",
    adultExamples: [
      "Cannot sit still",
      "Moves legs",
      "Plays with pen or objects",
      "Bites nails or plays with hair",
      "Can suppress movements but feels tense",
    ],
    childExamples: [
      "Parents often told you to sit still",
      "Moved legs",
      "Played with pen or objects",
      "Bit nails or played with hair",
      "Could not sit quietly",
      "Could suppress movements but felt tense",
    ],
  },
  {
    id: "h2",
    code: "H/I 2",
    title:
      "Often leaves seat in classroom or in other situations in which remaining seated is expected.",
    adultExamples: [
      "Avoids symposia, conferences, church, etc.",
      "Prefers walking around to sitting",
      "Does not sit for long; always on the move",
      "Tense because staying seated is hard",
      "Makes excuses to move",
    ],
    childExamples: [
      "Often got up from table or in class",
      "Found it very hard to sit still in class or meals",
      "Was told to stay seated",
      "Made excuses to walk around",
    ],
  },
  {
    id: "h3",
    code: "H/I 3",
    title:
      "Often runs about or climbs excessively in situations in which it is inappropriate (in adolescents or adults, may be limited to subjective feelings of restlessness).",
    adultExamples: [
      "Feels restless or agitated inside",
      "Feels a need to be busy constantly",
      "Difficulty relaxing",
    ],
    childExamples: [
      "Always running",
      "Climbed on furniture or jumped on sofa",
      "Climbed trees",
      "Felt agitated inside",
    ],
  },
  {
    id: "h4",
    code: "H/I 4",
    title: "Often has difficulty playing or engaging in leisure activities quietly.",
    adultExamples: [
      "Talks during activities that require quiet",
      "With others, wants to dominate",
      "Noisy in many situations",
      "Cannot do activities quietly",
      "Cannot speak softly",
    ],
    childExamples: [
      "Noisy when playing or in class",
      "Could not watch TV or a film quietly",
      "Was told to be quieter and calmer",
      "Quickly agitated with others",
    ],
  },
  {
    id: "h5",
    code: "H/I 5",
    title: 'Is often "on the go" or often acts as if "driven by a motor".',
    adultExamples: [
      "Always busy doing something",
      "High energy; always doing things",
      "Does not respect own limits",
      "Difficulty letting things go; too controlling",
    ],
    childExamples: [
      "Always doing something",
      "Very active at school and home",
      "Lots of energy",
      "Would not stop pestering",
    ],
  },
  {
    id: "h6",
    code: "H/I 6",
    title: "Often talks excessively.",
    adultExamples: [
      "Talks so much people get tired",
      "Known as very talkative",
      "Difficulty stopping talking",
      "Tendency to talk too much",
      "Does not let others join the conversation",
      "Needs many words to explain something",
    ],
    childExamples: [
      "Known as very talkative",
      "Teachers and parents often asked you to be quiet",
      "School reports noted talking too much",
      "Punished for talking too much",
      "Disrupted classmates by talking too much",
      "Did not let others join the conversation",
    ],
  },
  {
    id: "h7",
    code: "H/I 7",
    title: "Often blurts out answers before questions have been completed.",
    adultExamples: [
      "Difficulty keeping mouth closed",
      "Says things without thinking",
      "Answers before people finish speaking",
      "Finishes others’ sentences",
      "Lacks tact",
    ],
    childExamples: [
      "Difficulty keeping mouth closed",
      "Always wanted to answer first in class",
      "Blurted answers first, even if wrong",
      "Interrupted others before they finished",
      "Could be hurtful",
    ],
  },
  {
    id: "h8",
    code: "H/I 8",
    title: "Often has difficulty awaiting turn.",
    adultExamples: [
      "Difficulty waiting in line; cuts in",
      "Difficulty with patience in traffic or jams",
      "Difficulty waiting turn in conversation",
      "Impatient",
      "Starts or leaves relationships/jobs out of impatience",
    ],
    childExamples: [
      "Difficulty waiting turn in play or sport",
      "Difficulty waiting turn in class",
      "Always had to be first",
      "Quickly impatient",
      "Crossed street without looking",
    ],
  },
  {
    id: "h9",
    code: "H/I 9",
    title:
      "Often interrupts or intrudes on others (e.g. butts into conversations or games). Is this inappropriate?",
    adultExamples: [
      "Easily intrudes on others",
      "Cuts people off mid-sentence",
      "Interrupts when others are busy",
      "Others say you are intrusive",
      "Difficulty respecting others’ boundaries",
      "Has an opinion on everything and says it",
    ],
    childExamples: [
      "Interrupted others’ play",
      "Interrupted others’ conversations",
      "Reacted to everything",
      "Could not wait",
    ],
  },
];

export const FOOTNOTE_INTEREST =
  "*Unless the topic is highly interesting (e.g. computer or special hobby).";
