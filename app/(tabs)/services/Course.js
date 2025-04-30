export default class Course {
  constructor(code, name, room, block) {
    this.code = code;
    this.name = name;
    this.room = room;
    this.block = block;
    this.assignments = [];
    this.weightTable = {
      K: 25,
      T: 25,
      C: 25,
      A: 25
    };
    this.overallMark = 0;
  }

  calculateOverallMark() {
    if (this.assignments.length === 0) {
      return 0;
    }

    let totalWeightedMarks = 0;
    let totalWeights = 0;

    const categoryTotals = {
      K: { marks: 0, weights: 0 },
      T: { marks: 0, weights: 0 },
      C: { marks: 0, weights: 0 },
      A: { marks: 0, weights: 0 }
    };

    // Calculate totals for each category
    this.assignments.forEach(assignment => {
      Object.keys(categoryTotals).forEach(category => {
        if (assignment[category] && assignment[category].length > 0) {
          const mark = assignment[category][0];
          if (mark.finished && mark.total > 0) {
            categoryTotals[category].marks += (mark.get / mark.total) * mark.weight;
            categoryTotals[category].weights += mark.weight;
          }
        }
      });
    });

    // Calculate weighted average for each category
    Object.keys(categoryTotals).forEach(category => {
      if (categoryTotals[category].weights > 0) {
        const categoryAverage = (categoryTotals[category].marks / categoryTotals[category].weights) * 100;
        const categoryWeight = this.weightTable[category];
        totalWeightedMarks += categoryAverage * categoryWeight;
        totalWeights += categoryWeight;
      }
    });

    this.overallMark = totalWeights > 0 ? totalWeightedMarks / totalWeights : 0;
    return this.overallMark;
  }

  addAssignment(assignment) {
    this.assignments.push(assignment);
    this.calculateOverallMark();
  }

  setWeightTable(weights) {
    this.weightTable = weights;
    this.calculateOverallMark();
  }
}