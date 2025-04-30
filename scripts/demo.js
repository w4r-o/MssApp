const { modifyMarksForDemo } = require('./modifyMarks');

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

if (command === 'high') {
  modifyMarksForDemo(true)
    .then(() => console.log('Marks increased for demo'))
    .catch(console.error);
} else if (command === 'restore') {
  modifyMarksForDemo(false)
    .then(() => console.log('Marks restored to original values'))
    .catch(console.error);
} else {
  console.log('Usage: node demo.js [high|restore]');
  console.log('  high    - Set high marks for demo');
  console.log('  restore - Restore original marks');
} 