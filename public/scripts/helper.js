// helper functions for some UI operations

//create an html element based on a project obj
function json2Proj(project, classes=''){
  project.category = ['max','even','featured'][Math.floor(Math.random() * 3)];
  let popover = project.notes !== '' ? `data-toggle="popover" data-trigger="hover" data-placement="bottom" title="${project.primaryRoleName}" data-content="${project.notes}"` : ''
  return `<div class="prj-element element-item ${project.category} ${classes}">
                <a href="${serverAdr}/#present:Username=${project.owner}&ProjectName=${project.projectName}" target="_blank" ${popover}>
                <div class="thumbnail">
                  <img src="${project.thumbnail}" alt="NetsBlox Project: ${project.projectName}">
                  <div class="caption text-center">
                    <h4>${project.projectName}</h4>
                    <small>${project.services.length > 0 ? 'Using: ' + project.services.join(' ') : ''} </small>

                  </div>
                  </div>
                </div>
                </a>
              </div>`
}
//create html card based on project obj
function json2Card(project){
  return `
    <div class="element-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card-container">
        <div class="card">
          <div class="front">
            <div class="cover"><img src="${project.thumbnail}"></div>
            <div class="user hidden"><img class="img-circle" src="HERE"></div>
            <div class="content">
              <div class="main">
                <h3 class="name">${project.projectName}</h3>
                <p class="profession">${project.services[0]}</p>
                <!-- p.text-center= eg.notes-->
              </div>
            </div>
          </div>
          <div class="back">
            <div class="content">
              <div class="main">
                <h4 class="text-center">${project.primaryRoleName}</h4>
                <p class="text-center"></p>
                <div class="stats-container">
                  <div class="stats">
                    <h4>235</h4>
                    <p>Views</p>
                  </div>
                  <div class="stats">
                    <h4>114</h4>
                    <p>Likes</p>
                  </div>
                  <div class="stats">
                    <h4>2</h4>
                    <p>Roles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`
}



let json2MobileEl = project => {
  return `<div class="col-lg-2 col-md-3 col-sm-4">
  <div class="h-thumbnail">
    <a href="#">
      <img class="img-responsive center-block img-thumbnail" alt="" src="${project.Thumbnail}" style="width: 100%;"/>
    </a>
      <ul class="list-group">
      <span class="label label-success"></span>  
        <li class="list-group-item title">${project.ProjectName}</li>
      </ul> 
  </div>
</div>`
}