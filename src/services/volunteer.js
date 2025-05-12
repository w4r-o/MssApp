/* global setTimeout */
// eslint-disable-next-line no-undef
// setTimeout is a global function in JS environments like React Native

// Mock data for volunteer opportunities
const VOLUNTEER_OPPS = [
  {
    id: 1,
    title: 'Library Assistant',
    location: 'School Library',
    hours: '2 hours/day',
    days: '3 days/week',
    spots: 4,
    description: 'Help organize books and assist students with finding resources.',
    requirements: [
      'Grade 10-12 student',
      'Good organizational skills',
    ],
    image: null,
  },
  {
    id: 2,
    title: 'Math Tutor',
    location: 'Study Hall',
    hours: '1.5 hours/day',
    days: '2 days/week',
    spots: 6,
    description: 'Provide tutoring support for Grade 9-10 students in mathematics.',
    requirements: [
      'Grade 11-12 student',
      'Min. 85% in Math',
    ],
    image: null,
  },
  {
    id: 3,
    title: 'Environmental Club Leader',
    location: 'School Grounds',
    hours: '3 hours/day',
    days: '1 days/week',
    spots: 2,
    description: 'Lead environmental initiatives and organize recycling programs.',
    requirements: [
      'Grade 11-12 student',
      'Interest in environmental science',
    ],
    image: null,
  },
];

export async function getVolunteerOpportunities() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(VOLUNTEER_OPPS);
    }, 500);
  });
}

export async function getVolunteerImage(id) {
  // Simulate image loading
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null); // Return null for now since we don't have actual images
    }, 300);
  });
} 