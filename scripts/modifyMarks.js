const AsyncStorage = require('@react-native-async-storage/async-storage');

const modifyMarksForDemo = async (highMarks = true) => {
  try {
    // Get the current courses data
    const data = await AsyncStorage.getItem('ta_courses');
    if (!data) {
      console.log('No courses data found');
      return;
    }

    let courses = JSON.parse(data);

    // Modify the marks
    courses = courses.map(course => ({
      ...course,
      overallMark: highMarks ? Math.min(98 + Math.random() * 2, 100) : course.overallMark,
      kWeight: highMarks ? Math.min(95 + Math.random() * 5, 100) : course.kWeight,
      tWeight: highMarks ? Math.min(95 + Math.random() * 5, 100) : course.tWeight,
      cWeight: highMarks ? Math.min(95 + Math.random() * 5, 100) : course.cWeight,
      aWeight: highMarks ? Math.min(95 + Math.random() * 5, 100) : course.aWeight,
    }));

    // Save the modified data
    await AsyncStorage.setItem('ta_courses', JSON.stringify(courses));
    console.log(`Marks have been ${highMarks ? 'increased' : 'restored'} for demo purposes`);
  } catch (error) {
    console.error('Error modifying marks:', error);
  }
};

// Usage:
// To set high marks: modifyMarksForDemo(true)
// To restore original marks: modifyMarksForDemo(false)

module.exports = { modifyMarksForDemo }; 