/* global setTimeout */
// eslint-disable-next-line no-undef
// setTimeout is a global function in JS environments like React Native

// Mock data for resources
const RESOURCES = [
  {
    id: 1,
    title: 'Grade 12 Calculus Notes',
    category: 'Mathematics',
    author: 'Sarah K.',
    downloads: 156,
    rating: 4.8,
    image: null,
  },
  {
    id: 2,
    title: 'Chemistry Unit 3 Study Guide',
    category: 'Science',
    author: 'Mike R.',
    downloads: 89,
    rating: 4.5,
    image: null,
  },
  {
    id: 3,
    title: 'English Essay Writing Tips',
    category: 'English',
    author: 'Emma L.',
    downloads: 234,
    rating: 4.9,
    image: null,
  },
];

export async function getResources() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(RESOURCES);
    }, 500);
  });
}

export async function getResourceImage(id) {
  // Simulate image loading
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null); // Return null for now since we don't have actual images
    }, 300);
  });
} 