import { questImage } from './character/assets.js';

export const slideOrder = ['character-overview', 'starting-stats', 'quests', 'achievements'];

export const slideDefinitions = [
  { id: 'character-overview', label: 'Character', iconClass: 'fas fa-address-card' },
  { id: 'starting-stats', label: 'Tech Tree', iconClass: 'fas fa-project-diagram' },
  { id: 'quests', label: 'Quests', iconClass: 'fas fa-scroll' },
  { id: 'achievements', label: 'Achievements', iconClass: 'fas fa-trophy' }
];

export const characterAttributes = [
  {
    id: 'intelligence',
    label: 'Intelligence',
    axis: 'Systems / Learning / Technical Judgment',
    score: 93,
    vector: 'Systems Logic',
    summary: 'Systems reasoning across code, institutions, learning curves, and new categories.',
    detail: 'Intelligence is the ability to read architecture, incentives, and learning curves together, then reduce messy terrain into decisions that can ship.',
    bestUse: 'Turns technical ambiguity into product, infrastructure, and category judgment.',
    tradeoff: 'Can stay in analysis mode longer than the next useful experiment requires.',
    signalLog: [
      { stamp: 'Age 21', title: 'GitCafe', text: 'Read the early Git gap in China and turned it into developer infrastructure with a real exit path.' },
      { stamp: 'Tsinghua', title: 'Tsinghua XLP', text: 'Built course infrastructure for an extreme-learning program about mastering new knowledge in compressed cycles.' }
    ],
    proofStack: ['Systems literacy', 'Technical judgment', 'Learning methodology', 'Architecture taste'],
    proof: ['GitCafe', 'Tsinghua XLP', 'RealNPC'],
    placeholderLabel: 'Intelligence Media Placeholder'
  },
  {
    id: 'faith',
    label: 'Faith',
    axis: 'Conviction / Institution / Long-Horizon Bets',
    score: 89,
    vector: 'Mission Drive',
    summary: 'Belief carried before the market, institution, or team has full language for it.',
    detail: 'Faith is the long-horizon stat: choosing a direction early, absorbing ambiguity, and continuing while the route is still being discovered.',
    bestUse: 'Keeps frontier bets alive long enough for collaborators and context to catch up.',
    tradeoff: 'Can keep a vision equipped after the surrounding environment has changed.',
    signalLog: [
      { stamp: 'Current', title: 'NONG Studio', text: 'Opened a new AI entertainment quest before the format, market, and operating model are fully settled.' },
      { stamp: 'Institution', title: 'Shanghai BaiYuLan AI Open Lab', text: 'Co-founded a city-backed AI lab around a long-range government, academic, and industry collaboration thesis.' }
    ],
    proofStack: ['Founder conviction', 'Long-horizon bets', 'Institution building', 'Belief under ambiguity'],
    proof: ['NONG Studio', 'Shanghai BaiYuLan AI Open Lab', 'US Department of State IVLP'],
    placeholderLabel: 'Faith Media Placeholder'
  },
  {
    id: 'dexterity',
    label: 'Dexterity',
    axis: 'Reaction / Execution / Adaptive Timing',
    score: 91,
    vector: 'Responsive Control',
    summary: 'Fast reactions, clean handling, and execution under moving conditions.',
    detail: 'Dexterity measures how quickly intent becomes action: reacting under pressure, switching contexts, assembling people, and keeping control when the field moves fast.',
    bestUse: 'Turns momentum into prototypes, events, decisions, and high-pressure plays.',
    tradeoff: 'Can move faster than a team, room, or audience can fully read.',
    signalLog: [
      { stamp: 'Hong Kong', title: 'Cyberport Hackathon', text: 'Converted builder momentum into Hong Kong Cyberport\'s first hackathon.' },
      { stamp: 'Play', title: 'Hardcore Gaming', text: 'Shows up as fast FPS reactions, high-difficulty action-game mastery, and pressure control.' }
    ],
    proofStack: ['Reaction speed', 'Event execution', 'Context switching', 'Pressure control'],
    proof: ['Cyberport Hackathon', 'Hardcore Gaming', 'DouTu'],
    placeholderLabel: 'Dexterity Media Placeholder'
  },
  {
    id: 'vitality',
    label: 'Vitality',
    axis: 'Presence / Expression / Life Range',
    score: 95,
    vector: 'Sustained Output',
    summary: 'Live energy, public presence, appetite for experience, and expressive range.',
    detail: 'Vitality is the charge behind public-facing work, travel, conversation, sport, and the Enjoy Life quest: staying present enough to taste the full map, not only optimize one route.',
    bestUse: 'Brings warmth, pace, and live presence to media, stages, and high-tempo rooms.',
    tradeoff: 'Needs deliberate recovery so intensity stays useful instead of becoming noise.',
    signalLog: [
      { stamp: 'Media', title: 'CNN / Anthony Bourdain Shanghai Episode', text: 'Carried local presence and Shanghai context into an international media frame.' },
      { stamp: 'Stage', title: 'TEDx Talks', text: 'Sustained enough live energy and clarity to deliver ideas across three TEDx talks.' }
    ],
    proofStack: ['Public presence', 'Life appetite', 'Stage clarity', 'Social energy'],
    proof: ['CNN / Anthony Bourdain', 'TEDx Talks', 'Enjoy Life'],
    placeholderLabel: 'Vitality Media Placeholder'
  },
  {
    id: 'endurance',
    label: 'Endurance',
    axis: 'Discipline / Recovery / Long Practice',
    score: 88,
    vector: 'Long Game',
    summary: 'Staying with repetition, injury, slow improvement, and delayed payoff.',
    detail: 'Endurance is the discipline to keep practicing when progress is granular: fundamentals, recovery, precision, and the patience to let hard skills compound over time.',
    bestUse: 'Sustains sport, craft, and chapters that reward repeatable fundamentals.',
    tradeoff: 'Can keep carrying a chapter after its lesson has already been earned.',
    signalLog: [
      { stamp: 'Sport', title: 'Archery', text: 'Built precision through patient refinement, where every shot depends on dozens of details landing together.' },
      { stamp: 'Youth', title: 'Basketball', text: 'Carried a teenage pursuit through professional-standard training before ankle and ligament injuries changed the path.' }
    ],
    proofStack: ['Disciplined practice', 'Fundamentals repetition', 'Injury resilience', 'Delayed payoff'],
    proof: ['Archery', 'Basketball', 'Calligraphy'],
    placeholderLabel: 'Endurance Media Placeholder'
  },
  {
    id: 'attunement',
    label: 'Attunement',
    axis: 'Signal Reading / Culture / Environmental Awareness',
    score: 96,
    vector: 'Sensitivity Layer',
    summary: 'Reading people, culture, atmosphere, and weak signals before they become obvious.',
    detail: 'Attunement is the sensitivity layer: noticing underserved groups, cultural memory, timing, and emotional texture before they harden into obvious market facts.',
    bestUse: 'Reads rooms, communities, taste, and when a signal is ready to become a move.',
    tradeoff: 'Can detect patterns before they are ready to become decisions.',
    signalLog: [
      { stamp: 'Community', title: 'TechieCat', text: 'Created China\'s first women-in-tech community by reading an underserved social layer.' },
      { stamp: 'Firmware', title: 'Pop Culture', text: 'Built an aesthetic memory engine from films, music, games, animation, scenes, rhythms, and worlds.' }
    ],
    proofStack: ['Cultural memory', 'Community sensing', 'Aesthetic taste', 'Timing awareness'],
    proof: ['TechieCat', 'Pop Culture', 'XinCheJian'],
    placeholderLabel: 'Attunement Media Placeholder'
  }
];

export const signalRecords = [
  { id: 'ivlp-2016', year: '2016', type: 'program', title: 'US Department of State IVLP', context: 'A high-weight international leadership recognition and exchange program.' },
  { id: 'forbes-2014', year: '2014', type: 'award', title: 'Forbes 30 Under 30 China', context: 'A public signal of early entrepreneurial and technical significance.' },
  { id: 'bourdain', year: '2016', type: 'media', title: 'CNN / Anthony Bourdain Shanghai Episode', context: 'A moment where local context and global media visibility intersected.' },
  { id: 'bbc', year: '2010s', type: 'media', title: 'BBC Interviews', context: 'Independent international media attention on work and perspective.' },
  { id: 'yicai-brainstorm', year: '2010s', type: 'media', title: 'Yicai TV / Brainstorm', context: 'Domestic business-media visibility through the Yicai TV program Brainstorm.' },
  { id: 'tedx-talks', year: '2010s', type: 'talk', title: 'TEDx Talks', context: 'Public articulation of ideas across three TEDx talks.' }
];

export const trophyRecords = [
  {
    id: 'gitcafe-founder-exit',
    tier: 'platinum',
    title: 'Founder Exit: GitCafe',
    description: 'Sold my first company, GitCafe, to Tencent at age 25.',
    year: '2010s',
    category: 'Developer Infrastructure',
    rarity: 'Ultra Rare',
    status: 'unlocked',
    iconClass: 'fas fa-trophy'
  },
  {
    id: 'ivlp-2016',
    tier: 'platinum',
    title: 'International Visitor Leadership Program Alumni',
    description: 'Invited by the U.S. Department of State for a U.S. leadership exchange.',
    year: '2016',
    category: 'Recognition',
    rarity: 'Ultra Rare',
    status: 'unlocked',
    iconClass: 'fas fa-medal'
  },
  {
    id: 'forbes-2014',
    tier: 'gold',
    title: 'Forbes 30 Under 30 China',
    description: 'Recognized as an early entrepreneurial and technical signal in China.',
    year: '2014',
    category: 'Award',
    rarity: 'Very Rare',
    status: 'unlocked',
    iconClass: 'fas fa-award'
  },
  {
    id: 'baiyulan-open-lab',
    tier: 'silver',
    title: 'AI Lab Architect',
    description: 'Invited by Shanghai Jiao Tong University to build a city-backed AI lab.',
    year: '2018-2019',
    category: 'Institution',
    rarity: 'Rare',
    status: 'unlocked',
    iconClass: 'fas fa-university'
  },
  {
    id: 'cnn-bourdain',
    tier: 'gold',
    title: 'Featured on CNN / Anthony Bourdain Shanghai Episode',
    description: 'Appeared in an international media context where local culture met global visibility.',
    year: '2016',
    category: 'Media',
    rarity: 'Very Rare',
    status: 'unlocked',
    iconClass: 'fas fa-tv'
  },
  {
    id: 'archery-mastery',
    tier: 'gold',
    title: 'Archery Mastery',
    description: 'At peak, posted Olympic Ranking Round scores in the top-30 range.',
    year: 'Sport era',
    category: 'Archery',
    rarity: 'Very Rare',
    status: 'unlocked',
    iconClass: 'fas fa-bullseye'
  },
  {
    id: 'tedx-talks',
    tier: 'silver',
    title: 'TEDx Talks',
    description: 'Delivered public ideas across three TEDx talks.',
    year: '2010s',
    category: 'Talk',
    rarity: 'Rare',
    status: 'unlocked',
    iconClass: 'fas fa-microphone-alt'
  },
  {
    id: 'calligraphy-exhibition',
    tier: 'silver',
    title: 'Calligraphy Work Exhibited',
    description: 'Selected for a national touring calligraphy exhibition at age 10.',
    year: 'Age 10',
    category: 'Calligraphy',
    rarity: 'Rare',
    status: 'unlocked',
    iconClass: 'fas fa-pen-nib'
  },
  {
    id: 'shlug-hacker-community',
    tier: 'bronze',
    title: 'Managed a Hacker Culture Community',
    description: 'Helped run SHLUG as a long-running hacker culture community.',
    year: 'Community era',
    category: 'Hacker Culture',
    rarity: 'Uncommon',
    status: 'unlocked',
    iconClass: 'fas fa-terminal'
  },
  {
    id: 'bbc-interviews',
    tier: 'silver',
    title: 'Featured on BBC Interviews',
    description: 'Earned independent international media attention on work and perspective.',
    year: '2010s',
    category: 'Media',
    rarity: 'Rare',
    status: 'unlocked',
    iconClass: 'fas fa-broadcast-tower'
  },
  {
    id: 'yicai-brainstorm',
    tier: 'silver',
    title: 'Featured on Yicai TV / Brainstorm',
    description: 'Appeared in domestic business media through the Yicai TV program Brainstorm.',
    year: '2010s',
    category: 'Media',
    rarity: 'Rare',
    status: 'unlocked',
    iconClass: 'fas fa-chart-line'
  },
  {
    id: 'techiecat',
    tier: 'bronze',
    title: 'Founded China’s First Women-in-Tech Community',
    description: 'Created TechieCat as an early community for women in technology in China.',
    year: 'Community era',
    category: 'Community',
    rarity: 'Uncommon',
    status: 'unlocked',
    iconClass: 'fas fa-users'
  },
  {
    id: 'xinchejian',
    tier: 'bronze',
    title: 'Helped Operate China’s First Makerspace',
    description: 'Supported XinCheJian with events and early maker community building.',
    year: 'Maker era',
    category: 'Maker Community',
    rarity: 'Uncommon',
    status: 'unlocked',
    iconClass: 'fas fa-tools'
  }
];

export const originNarrative = {
  title: 'Tech Tree',
  subtitle: 'Foundation Progression Tree Behind the Character Build',
  summary: 'base-layer unlocks: early constraints, cultural firmware, and practice protocols that later combine into founder, hacker, community, and product instincts.',
  notes: ['Origin systems', 'Base unlocks', 'Trait paths', 'Compiled primitives'],
  thesisLines: [
    'Root conditions load before career titles',
    'Culture runs as firmware, not decoration',
    'Practice protocols turn taste into reflex',
    'Later roles compile from earlier primitives'
  ],
  compiledTraits: [
    'Attunement',
    'Systems Literacy',
    'Competitive Instinct',
    'Aesthetic Discipline',
    'Strategic Rebellion'
  ],
  layers: [
    {
      id: 'origin-conditions',
      label: 'Hardware',
      code: 'L1 Cache',
      summary: 'The earliest terrain: constraints, speed, and city-level operating rules.',
      nodes: [
        {
          id: 'family-system',
          label: 'Fractured Household',
          iconClass: 'fas fa-home',
          type: 'moral pressure system',
          source: 'A fractured household as the first operating environment: split authority, emotional volatility, and early exposure to how adult choices rewrite a child’s world.',
          trainingEffect: 'Compressed adolescence into moral firmware: calibrating right from wrong, thinking at philosophical depth early, and converting pain into a durable refusal to accept unfair systems.',
          unlockedPrimitives: ['Moral Firmware', 'Defiant Resilience'],
          laterCombinesInto: ['Founder resilience', 'Operator judgment', 'Anti-injustice posture'],
          branches: ['moral calibration', 'pain hardening', 'defiance code']
        },
        {
          id: 'shanghai',
          label: 'Shanghai',
          iconClass: 'fas fa-city',
          type: 'urban operating system',
          source: 'Shanghai as home base: an open port-city OS built on absorption, ambition, global signal, and the habit of letting different worlds interoperate.',
          trainingEffect: 'Set a high-resolution baseline early: expand the aperture, benchmark against better systems, and treat excellence as a default target rather than a distant luxury.',
          unlockedPrimitives: ['Global Aperture', 'Excellence Baseline'],
          laterCombinesInto: ['Cross-cultural positioning', 'Market taste', 'Better-default ambition'],
          branches: ['global aperture', 'system benchmarking', 'open city code']
        }
      ]
    },
    {
      id: 'cultural-firmware',
      label: 'Firmware',
      code: 'L2 Cache',
      summary: 'Symbol systems that trained identity, style, mythology, and competitive imagination.',
      nodes: [
        {
          id: 'pop-culture',
          label: 'Pop Culture',
          iconClass: 'fas fa-film',
          type: 'aesthetic memory engine',
          source: 'Films, music, games, animation, and cultural artifacts cached as dialogue, frames, melodies, atmosphere, and the ideas running underneath.',
          trainingEffect: 'Turned recall into an aesthetic database: stored scenes, rhythms, and meanings became reusable modules for taste, judgment, and creative execution.',
          unlockedPrimitives: ['Aesthetic Cache', 'Style Compiler'],
          laterCombinesInto: ['Creative direction', 'Product storytelling', 'Cultural product taste'],
          branches: ['dialogue cache', 'visual imprint', 'melody logic']
        },
        {
          id: 'hip-hop',
          label: 'Hip-Hop',
          iconClass: 'fas fa-music',
          type: 'freestyle liberation protocol',
          source: 'Working-class intelligence, raw anger, abrasive lyrics, street humor, and freestyle as a live protocol for thinking under pressure.',
          trainingEffect: 'Decoded freedom as practice, not slogan: turn pressure into rhythm, speak without permission, improvise through conflict, and enjoy life before the world grants approval.',
          unlockedPrimitives: ['Freestyle Cognition', 'Lived Freedom'],
          laterCombinesInto: ['Improvisational leadership', 'Anti-permission posture', 'Life-affirming style'],
          branches: ['street intelligence', 'anger rhythm', 'freestyle protocol']
        },
        {
          id: 'streetball',
          label: 'Streetball',
          iconClass: 'fas fa-basketball-ball',
          type: 'contact coordination arena',
          source: 'Street basketball as a real-time arena for team synchronization, full-court sensing, body contact, trash talk, pressure, and edge control.',
          trainingEffect: 'Trained cooperation under velocity: read the whole floor, absorb physical and mental confrontation, and operate near intensity without crossing into real trouble.',
          unlockedPrimitives: ['Court Vision', 'Controlled Toughness'],
          laterCombinesInto: ['Team coordination', 'Conflict navigation', 'High-pressure execution'],
          branches: ['team sync', 'contact nerve', 'edge control']
        },
        {
          id: 'calligraphy',
          label: 'Calligraphy',
          iconClass: 'fas fa-pen-nib',
          type: 'aesthetic discipline',
          source: 'Brushwork, structure, spacing, repetition, and the brutal honesty of a medium where every small movement exposes the operator’s inner state.',
          trainingEffect: 'Built artistic sensitivity, patience, detail control, and the discipline to slow the system down until form, force, and intention lock into alignment.',
          unlockedPrimitives: ['Artistic Sensibility', 'Patient Precision'],
          laterCombinesInto: ['Interface judgment', 'Product taste', 'Detail-locked execution'],
          branches: ['detail control', 'patience engine', 'inner steadiness']
        }
      ]
    },
    {
      id: 'practice-protocols',
      label: 'Kernel',
      code: 'L3 Cache',
      summary: 'The deepest access layer: reading systems directly and rebuilding them through hacker instincts.',
      nodes: [
        {
          id: 'hacker-culture',
          label: 'Hacker Culture',
          iconClass: 'fas fa-terminal',
          type: 'open technology ethos',
          source: 'A technology obsession shaped by sharper questions, self-directed learning, knowledge sharing, frontier research, open source, and free software culture.',
          trainingEffect: 'Made technology feel like a shared frontier: learn in public, chase the latest systems, understand the architecture underneath, and pass useful knowledge forward.',
          unlockedPrimitives: ['Self-Learning Protocol', 'Open Source Ethos'],
          laterCombinesInto: ['AI product judgment', 'Community architecture', 'Technology evangelism'],
          branches: ['question craft', 'self learning', 'open source spirit']
        }
      ]
    }
  ]
};

export const questLanes = [
  { id: 'main', label: 'Main Quests', iconClass: 'fas fa-route' },
  { id: 'guild', label: 'Guild Oaths', iconClass: 'fas fa-users' },
  { id: 'arcane', label: 'Arcane Trials', iconClass: 'fas fa-hat-wizard' },
  { id: 'commission', label: 'Royal Commissions', iconClass: 'fas fa-chess-king' },
  { id: 'mastery', label: 'Mastery Trials', iconClass: 'fas fa-bullseye' }
];

const questEntryRecords = [
  {
    id: 'prime-directive',
    lane: 'main',
    category: 'Life Philosophy',
    status: 'Lifelong Practice',
    title: 'Enjoy Life',
    years: 'Lifelong',
    outcome: 'Taste the full range of being alive: the sweet, the bitter, the playful, and the strange.',
    traits: ['Curiosity', 'Range', 'Playful Agency'],
    notes: 'Not a doctrine of perfecting one thing forever. The point is to keep trying the whole map.',
    ...questImage('quest-prime-directive.svg', 'Green cyan symbolic quest visual for Enjoy Life'),
    placeholderLabel: 'Enjoy Life Quest Placeholder'
  },
  {
    id: 'nong-studio',
    lane: 'main',
    category: 'AI Entertainment Studio',
    status: 'Just Launched',
    title: 'NONG Studio',
    years: 'Current',
    outcome: 'Building a next-generation AI entertainment studio for new IP operations and higher-dimensional screen experiences.',
    traits: ['AI Entertainment', 'IP Operations', 'Film x Technology'],
    notes: 'A newly opened mainline quest: assemble a strong cross-industry team, bridge film and technology, and face the hard problems of a new entertainment era.',
    ...questImage('nong-studio-watermark.png', 'NONG Studio logo', {
      mediaLayout: 'wide',
      mediaAspect: '965 / 156'
    }),
    placeholderLabel: 'NONG Studio Quest Placeholder'
  },
  {
    id: 'gitcafe',
    lane: 'main',
    category: 'Open Source Infrastructure',
    status: 'Completed',
    title: 'GitCafe',
    years: 'Age 21-25',
    outcome: 'Built China\'s first GitHub-like service and sold it to Tencent at 25.',
    traits: ['Open Source Culture', 'Developer Tools', 'Education Bridge'],
    notes: 'The first startup quest: connect open-source communities, commercial projects, and schools so more students could touch real code and real collaboration.',
    ...questImage('gitcafe-logo.png', 'GitCafe logo', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'GitCafe Quest Placeholder'
  },
  {
    id: 'shlug',
    lane: 'guild',
    category: 'Urban Hacker Community',
    status: 'Legacy Completed',
    title: 'Shanghai Linux User Group',
    years: 'Age 19',
    outcome: 'Led Asia\'s largest urban hacker community and multiplied its activity before handing it to the next stewards.',
    traits: ['Hacker Culture', 'Open Source Community', 'Weekly Gatherings'],
    notes: 'A legendary guild hall founded in 1997: open-source talks, weekly meetups, hands-on hardware, new technology, and a community that had already shaped China\'s open-source scene.',
    ...questImage('shlug-logo.png', 'Shanghai Linux User Group logo', {
      mediaLayout: 'square-logo'
    }),
    placeholderLabel: 'Shanghai Linux User Group Quest Placeholder'
  },
  {
    id: 'kaiyuanshe',
    lane: 'guild',
    category: 'Open Source Society',
    status: 'Co-founded',
    title: 'KaiYuanShe',
    years: 'Exited 2017',
    outcome: 'Co-founded KaiYuanShe through GitCafe with Microsoft Open Technologies to promote open source across China.',
    traits: ['Open Source Advocacy', 'University Outreach', 'Industry Reports'],
    notes: 'A guild quest for making open source practical in China\'s commercial environment: campus outreach, industry-facing reports, and long-term community succession.',
    ...questImage('kaiyuanshe-logo.png', 'KaiYuanShe logo', {
      mediaLayout: 'square-logo-large'
    }),
    placeholderLabel: 'KaiYuanShe Quest Placeholder'
  },
  {
    id: 'baiyulan-open-lab',
    lane: 'guild',
    category: 'Government-Backed AI Lab',
    status: 'Co-founded',
    title: 'Shanghai BaiYuLan AI Open Lab',
    years: '2018-2019',
    outcome: 'Co-founded a government-supported AI lab with Shanghai Jiao Tong University\'s AI Institute to connect government, academia, and industry.',
    traits: ['Government-Backed AI', 'Academic Collaboration', 'AI for Science'],
    notes: 'An institutional platform quest for AI research, public-sector support, and commercial collaboration, later evolving toward AI for Science.',
    ...questImage('baiyulan-logo.png', 'Shanghai BaiYuLan AI Open Lab logo', {
      mediaLayout: 'square-logo-large'
    })
  },
  {
    id: 'tsinghua-xlp',
    lane: 'commission',
    category: 'Experimental Course',
    status: 'Course Support',
    title: 'Tsinghua XLP',
    years: 'Extreme Learning Programme',
    outcome: 'Built the assignment-tracking system and supported teaching for Tsinghua University\'s Extreme Learning Programme.',
    traits: ['Extreme Learning', 'Course Infrastructure', 'Learning Methodology'],
    notes: 'A royal commission for one of Tsinghua\'s most radical experimental courses, designed to teach students how to rapidly master a new field in a compressed timeframe.',
    ...questImage('xlp-logo.png', 'Tsinghua University logo for XLP', {
      mediaLayout: 'wide',
      mediaAspect: '2270 / 1072'
    }),
    placeholderLabel: 'Tsinghua XLP Quest Placeholder'
  },
  {
    id: 'realnpc',
    lane: 'arcane',
    category: 'AI Character System',
    status: 'Built',
    title: 'RealNPC',
    years: 'AI era',
    outcome: 'Built toward AI digital humans, synthetic characters, and interactive identity systems.',
    traits: ['AI Digital Humans', 'Interactive Identity', 'Synthetic Characters'],
    notes: 'The strange-tech questline: make characters feel less like content and more like presences you can meet.',
    ...questImage('realnpc-logo.png', 'Green cyan RealNPC logo', {
      mediaLayout: 'wide',
      mediaAspect: '2253 / 701'
    }),
    placeholderLabel: 'RealNPC Quest Placeholder'
  },
  {
    id: 'techiecat',
    lane: 'guild',
    category: 'Women in Tech Community',
    status: 'Founded',
    title: 'TechieCat',
    years: 'Community era',
    outcome: 'Founded China\'s first women-in-tech community for beginners crossing into technology.',
    traits: ['Women in Tech', 'Beginner Education', 'Community Events'],
    notes: 'A teaching and sharing community for women from different industries with no technical background, with well-received events across major cities including Beijing and Shanghai.',
    ...questImage('techiecat-logo.png', 'TechieCat logo', {
      mediaLayout: 'square-logo-large'
    }),
    placeholderLabel: 'TechieCat Quest Placeholder'
  },
  {
    id: 'cyberport-hackathon',
    lane: 'commission',
    category: 'Builder Assembly',
    status: 'First',
    title: 'Cyberport Hackathon',
    years: 'Hong Kong',
    outcome: 'Assembled builders for Hong Kong Cyberport’s first hackathon.',
    traits: ['Builder Assembly', 'Event Execution', 'Hong Kong Bridge'],
    notes: 'A public commission: gather the party for Cyberport, set the arena, and let the builders reveal what is possible.',
    ...questImage('cyberport-logo-green-cyan.png', 'Green cyan Cyberport logo for Cyberport Hackathon', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'Cyberport Hackathon Quest Placeholder'
  },
  {
    id: 'bewater',
    lane: 'arcane',
    category: 'Web3 Developer Ecosystem',
    status: 'Exited',
    title: 'BeWater.xyz',
    years: 'One-year attempt',
    outcome: 'Ecosystem building experiment for the Web3 industry.',
    traits: ['Developer Ecosystems', 'Hackathon Systems', 'Founder Boundary'],
    notes: 'An arcane trial applying open-source community operations to Web3: build hackathon infrastructure, organize builder events, and test project incubation under volatile industry incentives.',
    ...questImage('bewater-logo.png', 'Green cyan BeWater logo', {
      mediaLayout: 'wide',
      mediaAspect: '1156 / 344'
    }),
    placeholderLabel: 'BeWater Quest Placeholder'
  },
  {
    id: 'dotu',
    lane: 'arcane',
    category: 'Social Prototype',
    status: 'Attempt',
    title: 'DouTu',
    years: '2017',
    outcome: 'Tested an avatar-based group video world before the category had settled language.',
    traits: ['Category Instinct', 'Avatar Expression', 'Social Experimentation'],
    notes: 'An unstable spell: faces, rooms, video, identity, and play, all before the market had clean words for it.',
    ...questImage('quest-doutu.svg', 'Green cyan meme sticker icon for DouTu', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'DouTu Quest Placeholder'
  },
  {
    id: 'archery',
    lane: 'mastery',
    category: 'Sport',
    status: 'Skill Tree',
    title: 'Archery',
    years: 'Parallel Track',
    outcome: 'Trains precise problem targeting and behavioral consistency.',
    traits: ['Problem Targeting', 'Behavioral Consistency', 'Learning Methodology'],
    notes: 'Archery rewards patient refinement: every shot depends on 30+ details landing together, which quickly filters out anyone chasing fast visible results.',
    ...questImage('archery.png', 'Green cyan archery mastery visual', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'Archery Quest Placeholder'
  },
  {
    id: 'basketball',
    lane: 'mastery',
    category: 'Sport',
    status: 'Parallel Track',
    title: 'Basketball',
    years: 'Parallel Track',
    outcome: 'My defining teenage pursuit, built on team play, tactics, and disciplined fundamentals.',
    traits: ['Team Collaboration', 'Tactical Literacy', 'Fundamentals Training'],
    notes: 'Basketball became my most important youth pursuit: early professional-standard training, a mentor who founded CSBA, and a path redirected by ankle and ligament injuries.',
    ...questImage('basketball.png', 'Green cyan basketball tempo visual', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'Basketball Quest Placeholder'
  },
  {
    id: 'gaming',
    lane: 'mastery',
    category: 'Play',
    status: 'Parallel Track',
    title: 'Hardcore Gaming',
    years: 'Persistent',
    outcome: 'Competitive drive, fast reactions, high-difficulty mastery, and deep love for single-player worlds.',
    traits: ['Competitive Instinct', 'Reaction Speed', 'World Immersion'],
    notes: 'Gaming spans both sides for me: the urge to win in competitive arenas and the slower pleasure of art, story, worldbuilding, and imagination in single-player games.',
    ...questImage('gamepad.png', 'Green cyan hardcore gaming strategy visual', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'Gaming Quest Placeholder'
  },
  {
    id: 'calligraphy',
    lane: 'mastery',
    category: 'Art',
    status: 'Parallel Track',
    title: 'Calligraphy',
    years: 'Early Life',
    outcome: 'A practice of line control, restraint, form, and visible discipline.',
    traits: ['Line Control', 'Aesthetic Discipline', 'Restraint'],
    notes: 'Ink does not hide the hand. This quest trains control, space, rhythm, and respect for form.',
    ...questImage('maobi.png', 'Green cyan calligraphy discipline visual', {
      mediaLayout: 'contain'
    }),
    placeholderLabel: 'Calligraphy Quest Placeholder'
  }
];

const questBriefingCopy = {
  'prime-directive': {
    origin: 'This begins from a simple refusal to reduce life to one perfect track. The character build is meant to stay open to sweetness, bitterness, failure, luck, delight, and surprise.',
    actions: 'Keep trying different experiences: work, games, travel, sport, technology, art, conversations, and the side paths that make the map larger.',
    takeaway: 'Mastery is not the only philosophy. Sometimes the better rule is to play widely, feel fully, and let each experience add another texture to being alive.'
  },
  'nong-studio': {
    origin: 'This begins as a next-generation AI entertainment studio built for the moment when IP operation, film language, and frontier technology start merging into one new category.',
    actions: 'Build solutions for new-era IP operations, explore higher-dimensional film and entertainment formats, and bring together a strong team across the screen industries and technology.',
    takeaway: 'The project has only just started, which means the hard quests are still ahead: format invention, team alignment, market education, and turning a new entertainment thesis into durable work.'
  },
  gitcafe: {
    origin: 'In the early 2010s, very few programmers in China used Git and even fewer knew GitHub. The gap was not only tooling; it was access to open collaboration.',
    actions: 'Built China\'s first GitHub-like service to connect open-source communities, commercial software projects, and education institutions, giving more students a path into real open-source and production work.',
    takeaway: 'GitCafe turned open-source culture into a practical local platform, then became the first founder exit when the project was sold to Tencent at 25.'
  },
  shlug: {
    origin: 'SHLUG was founded in 1997 and became one of the most important open-source communities in China, including moments like bringing Canonical\'s founder to Shanghai in 2006.',
    actions: 'Took over the community at 19, raised activity by at least 20x, hosted weekly exchanges and meetups, and kept the room alive around new open-source technology, hardware, and hacker culture.',
    takeaway: 'After the startup chapter began, the community was handed to later stewards. It has since completed its historical mission and faded, but its contribution to China\'s open-source culture remains part of the foundation.'
  },
  kaiyuanshe: {
    origin: 'KaiYuanShe began as a joint effort between GitCafe and Microsoft Open Technologies to explore how open-source technology could spread inside China\'s commercial environment.',
    actions: 'Promoted open source toward universities, built education and outreach work, and developed industry-facing report services for the broader ecosystem.',
    takeaway: 'After stepping away in 2017, the organization continued under later stewards and remains active, turning the original seed into a living open-source community.'
  },
  'baiyulan-open-lab': {
    origin: 'BaiYuLan was co-founded with Shanghai Jiao Tong University\'s AI Institute as a government-supported AI lab built to connect government, academic institutions, and commercial partners.',
    actions: 'Built the institutional platform and brought it into public view at WAIC 2019, where Li Qiang, now China\'s Premier, witnessed the unveiling.',
    takeaway: 'The lab began as a bridge between public support, research, and industry. Today, its direction has moved more toward AI for Science.'
  },
  'tsinghua-xlp': {
    origin: 'XLP, the Extreme Learning Programme, was one of Tsinghua University\'s most radical experimental courses: a learning-methodology class about mastering new knowledge in very short cycles.',
    actions: 'Provided a full assignment-tracking system for the course and assisted the professor with teaching, making the experimental learning process easier to run and observe.',
    takeaway: 'The commission turned learning itself into the system under study: compress the time, track the work, and teach students how to acquire unfamiliar knowledge fast.'
  },
  dotu: {
    origin: 'This began from sensing that avatar identity, live video, and playful social rooms were starting to merge.',
    actions: 'Built and tested an avatar-based group video social prototype before the market had clean language for the category.',
    takeaway: 'Early category experiments teach timing. Sometimes the spell is real before the market knows what to call it.'
  },
  realnpc: {
    origin: 'This began from the question of what happens when characters stop being static content and start becoming interactive presences.',
    actions: 'Built toward AI digital humans, synthetic characters, and identity systems that people could interact with directly.',
    takeaway: 'Synthetic characters became a product surface: part interface, part performance, part new kind of social presence.'
  },
  techiecat: {
    origin: 'TechieCat was created as China\'s first women-in-tech community, focused on women from different industries who were starting with little or no technical background.',
    actions: 'Built a beginner-friendly teaching and technology-sharing community, then hosted events in major cities including Beijing and Shanghai that received strong feedback.',
    takeaway: 'The point was not only to teach tools. It was to make technology feel approachable, social, and possible for people who had never been invited into that room before.'
  },
  'cyberport-hackathon': {
    origin: 'This began from a builder ecosystem moment in Hong Kong that needed a live arena.',
    actions: 'Helped assemble builders for Hong Kong Cyberport’s first hackathon and turned momentum into a concrete event.',
    takeaway: 'A good hackathon is a summoning ritual: gather the right people, set the rules, and let the room reveal its level.'
  },
  bewater: {
    origin: 'This began from applying open-source community operating experience to Web3 developer ecosystems, in collaboration with top industry players including OKX and ABCDE.',
    actions: 'Built hackathon systems and ecosystem rituals, organized developer events, and tested project incubation as a way to expand the Web3 builder base.',
    takeaway: 'The industry had little patience for long-termism, and the company also faced serious investor interference in direction and operations. After a year, the right move was to exit.'
  },
  archery: {
    origin: 'This began as a precision discipline with an unusually steep entry curve: every set of movements demands at least 30 details landing in the right place.',
    actions: 'Trained problem targeting, behavioral consistency, and the patience to keep refining small motions when results are not immediately visible.',
    takeaway: 'Archery strengthened the same learning methodology used for hard problems: locate the issue precisely, keep the action consistent, and stay with the difficulty long enough for improvement to compound.'
  },
  basketball: {
    origin: 'Basketball was the most important passion and pursuit of my teenage years, not a side hobby or a borrowed metaphor from the tech tree.',
    actions: 'I learned team collaboration, tactical literacy, and fundamentals through structured training. My mentor founded the China Streetball Alliance (CSBA), and in junior high I trained under one of Shanghai\'s strongest high-school basketball development systems with professional discipline.',
    takeaway: 'The professional athlete path eventually closed because of ankle and ligament injuries, but the training stayed with me: teamwork, systems awareness, repeatable fundamentals, and respect for disciplined practice.'
  },
  gaming: {
    origin: 'I have always had a strong competitive instinct in skill-based games, especially where reaction speed, precision, and pressure matter.',
    actions: 'In FPS games like CS and Battlefield, my reaction speed has always been one of my strongest advantages. I also enjoy clearing the hardest action RPG challenges, including no-damage runs in games like God of War, and I like the exploration and difficulty curve of Soulslike games.',
    takeaway: 'Games are also art, story, worldbuilding, and imagination. I enjoy single-player experiences for the worlds they open up, from Death Stranding and Where Winds Meet to Red Dead Redemption.'
  },
  calligraphy: {
    origin: 'This began as early practice in form, restraint, and visible control.',
    actions: 'Trained line, spacing, rhythm, and repetition through a medium that makes hesitation visible.',
    takeaway: 'Taste becomes real when the hand can prove it. Control, space, and restraint have to show up in the stroke.'
  }
};

export const questEntries = questEntryRecords.map((quest) => ({
  ...quest,
  briefing: questBriefingCopy[quest.id] ?? {
    origin: `This began as the first visible signal around ${quest.title}.`,
    actions: quest.outcome,
    takeaway: quest.notes
  }
}));
