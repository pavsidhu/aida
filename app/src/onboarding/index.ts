import OnboardingMessage from './OnboardingMessage'

const onboardingMessages: { [key: string]: OnboardingMessage } = {
  'introduction-1': {
    message: 'Hey, my name is Aida',
    route: { next: 'introduction-2' }
  },
  'introduction-2': {
    message:
      'My goal is to help you meet new people, bots like me can only talk so much 😅',
    route: { next: 'name-prompt-1' }
  },
  'name-prompt-1': {
    message:
      'In order to find people I think you’ll get along with, It’d be great to get to know each other',
    route: { next: 'name-prompt-2' }
  },
  'name-prompt-2': {
    message: 'What’s your name?',
    input: {
      name: 'name',
      type: 'text'
    },
    route: {
      next: 'name-prompt-success',
      failure: 'name-prompt-failure'
    }
  },
  'name-prompt-failure': {
    message: "I'm going to need your name to help find matches, what is it?",
    input: {
      name: 'name',
      type: 'text'
    },
    route: { next: 'name-prompt-success' }
  },
  'name-prompt-success': {
    message: 'Nice to meet you {{name}}!',
    route: { next: 'photo-prompt' }
  },
  'photo-prompt': {
    message:
      'For your profile, could you upload a photo? This will be displayed to other people when you make a match so look pretty',
    input: {
      name: 'photo',
      type: 'photo'
    },
    route: {
      next: 'photo-prompt-success',
      failure: 'photo-prompt-failure'
    }
  },
  'photo-prompt-failure': {
    message:
      'I need a photo so I can have something to show when you match with new people',
    input: {
      name: 'photo',
      type: 'photo'
    },
    route: { next: 'photo-prompt-success' }
  },
  'photo-prompt-success': {
    message: 'Wow looking good!',
    route: { next: 'location-prompt' }
  },
  'location-prompt': {
    message:
      'Last step now, could you enable location access so I can help find new people around you?',
    input: {
      name: 'location',
      type: 'permission'
    },
    route: {
      next: 'location-prompt-success',
      failure: 'location-prompt-failure'
    }
  },
  'location-prompt-failure': {
    message:
      "I'm going to need location access in order to find matches around you, please enable it in your settings",
    input: {
      name: 'location',
      type: 'permission'
    },
    route: {
      next: 'location-prompt-success',
      failure: 'location-prompt-failure'
    }
  },
  'location-prompt-success': {
    message: 'Great, you’re all set up!',
    route: { next: 'app-explaination-1' }
  },
  'app-explaination-1': {
    message: 'Okay, so my job is to help you prepare for meeting new people',
    route: { next: 'app-explaination-2' }
  },
  'app-explaination-2': {
    message:
      "I'll ask you common dating questions throughout your day, so when you meet people you'll be ready!",
    route: { next: 'app-explaination-3' }
  },
  'app-explaination-3': {
    message:
      "When I've learned enough about you, I'll match you with people you'll be compatible with",
    route: { next: 'app-explaination-4' }
  },
  'app-explaination-4': {
    message:
      'more we talk, the more I can learn about you and the better your matches will be',
    route: { next: 'app-explaination-5' }
  },
  'app-explaination-5': {
    message: "Let's talk soon!",
    route: {}
  }
}

export default onboardingMessages
