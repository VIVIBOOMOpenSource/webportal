
// const ProjectStatusEnum = {
//   Draft: 0,
//   Rejected: 1,
//   Submitted: 2,
//   Live: 3,
// }
const ProjectStatusEnum = {
  WorkInProgress: 0, // was draft
  Completed: 1, // was rejected
};

const ProjectBadgeStatusEnum = {
  BadgesSubmitted: 0,
  BadgesApproved: 1,
};

const displayProjectStatusLabelById = (id) => {
  var label = "Null";
  switch(id){
    // case ProjectStatusEnum.Draft: label = "Draft"; break;
    // case ProjectStatusEnum.Rejected: label = "Rejected"; break;
    case ProjectStatusEnum.Submitted: label = "Submitted"; break;
    case ProjectStatusEnum.Live: label = "Live"; break;
    default: break;
  }
  return label;
}

module.exports = {
  ProjectStatusEnum,
  ProjectBadgeStatusEnum,
  displayProjectStatusLabelById
};