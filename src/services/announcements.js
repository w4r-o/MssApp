/* global setTimeout */
// eslint-disable-next-line no-undef
// setTimeout is a global function in JS environments like React Native

// Mock data for announcements
const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Semester 2 Course Selection',
    date: 'Apr 26',
    tag: 'Academic',
    content: 'Course selection for next semester opens tomorrow. Meet with guidance counselors to finalize your choices.',
    image: null,
  },
  {
    id: 2,
    title: 'Spring Sports Tryouts',
    date: 'Apr 27',
    tag: 'Sports',
    content: 'Baseball and soccer tryouts start next week. Sign up in the gym office.',
    image: null,
  },
  {
    id: 3,
    title: 'Math Competition',
    date: 'Apr 30',
    tag: 'Competitions',
    content: 'Register for the upcoming math competition by Friday. See your math teacher for details.',
    image: null,
  },
];

export async function getAnnouncements() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ANNOUNCEMENTS);
    }, 500);
  });
}

export async function getAnnouncementImage(id) {
  // Simulate image loading
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null); // Return null for now since we don't have actual images
    }, 300);
  });
} 